import base64
import hashlib
import hmac
import html
import json
import secrets
import time
from datetime import UTC, datetime, timedelta
from uuid import UUID

import pyotp
from cryptography.fernet import Fernet, InvalidToken
from jose import JWTError, jwt

from app.config import settings
from app.models.user import User
from app.services.email import build_brutalist_email, send_email, smtp_configured


def _fernet() -> Fernet:
    key = base64.urlsafe_b64encode(hashlib.sha256(settings.secret_key.encode()).digest())
    return Fernet(key)


def encrypt_secret(secret: str) -> str:
    return _fernet().encrypt(secret.encode()).decode()


def decrypt_secret(value: str) -> str | None:
    try:
        return _fernet().decrypt(value.encode()).decode()
    except (InvalidToken, ValueError):
        return None


def create_mfa_challenge(user_id: UUID) -> str:
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.mfa_challenge_expire_minutes)
    return jwt.encode(
        {"sub": str(user_id), "purpose": "mfa", "exp": expires_at},
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def decode_mfa_challenge(token: str) -> UUID | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        if payload.get("purpose") != "mfa":
            return None
        return UUID(payload["sub"])
    except (JWTError, KeyError, TypeError, ValueError):
        return None


def create_totp_setup(user: User) -> tuple[str, str]:
    secret = pyotp.random_base32()
    user.totp_pending_secret_encrypted = encrypt_secret(secret)
    uri = pyotp.TOTP(secret).provisioning_uri(name=user.email, issuer_name="Gedeon Kpara Blog")
    return secret, uri


def confirm_totp_setup(user: User, code: str) -> list[str] | None:
    if not user.totp_pending_secret_encrypted:
        return None
    secret = decrypt_secret(user.totp_pending_secret_encrypted)
    if not secret or not pyotp.TOTP(secret).verify(code, valid_window=1):
        return None
    recovery_codes = generate_recovery_codes()
    user.totp_secret_encrypted = user.totp_pending_secret_encrypted
    user.totp_pending_secret_encrypted = None
    user.totp_enabled = True
    user.totp_last_used_step = None
    user.recovery_code_hashes = json.dumps([hash_recovery_code(user.id, code) for code in recovery_codes])
    return recovery_codes


def verify_totp(user: User, code: str) -> bool:
    if not user.totp_enabled or not user.totp_secret_encrypted:
        return False
    secret = decrypt_secret(user.totp_secret_encrypted)
    if not secret:
        return False
    current_step = int(time.time() // 30)
    totp = pyotp.TOTP(secret)
    for step in range(current_step - 1, current_step + 2):
        if hmac.compare_digest(totp.at(step * 30), code):
            if user.totp_last_used_step is not None and step <= user.totp_last_used_step:
                return False
            user.totp_last_used_step = step
            return True
    return False


def _otp_hash(user_id: UUID, code: str) -> str:
    return hmac.new(
        settings.secret_key.encode(),
        f"{user_id}:{code}".encode(),
        hashlib.sha256,
    ).hexdigest()


def issue_email_otp(user: User) -> str:
    code = f"{secrets.randbelow(1_000_000):06d}"
    now = datetime.now(UTC)
    user.email_otp_hash = _otp_hash(user.id, code)
    user.email_otp_expires_at = now + timedelta(minutes=settings.email_otp_expire_minutes)
    user.email_otp_sent_at = now
    user.email_otp_attempts = 0
    return code


def can_resend_email_otp(user: User) -> bool:
    if not user.email_otp_sent_at:
        return True
    sent_at = user.email_otp_sent_at
    if sent_at.tzinfo is None:
        sent_at = sent_at.replace(tzinfo=UTC)
    return datetime.now(UTC) - sent_at >= timedelta(seconds=settings.email_otp_resend_seconds)


def verify_email_otp(user: User, code: str) -> bool:
    if not user.email_otp_hash or not user.email_otp_expires_at or user.email_otp_attempts >= 5:
        return False
    expires_at = user.email_otp_expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=UTC)
    if datetime.now(UTC) > expires_at:
        return False
    user.email_otp_attempts += 1
    if not hmac.compare_digest(user.email_otp_hash, _otp_hash(user.id, code)):
        return False
    clear_email_otp(user)
    return True


def clear_email_otp(user: User) -> None:
    user.email_otp_hash = None
    user.email_otp_expires_at = None
    user.email_otp_attempts = 0


def generate_recovery_codes() -> list[str]:
    return [f"{secrets.token_hex(2)}-{secrets.token_hex(2)}".upper() for _ in range(8)]


def hash_recovery_code(user_id: UUID, code: str) -> str:
    return _otp_hash(user_id, code.replace("-", "").upper())


def verify_recovery_code(user: User, code: str) -> bool:
    if not user.recovery_code_hashes:
        return False
    try:
        hashes: list[str] = json.loads(user.recovery_code_hashes)
    except (json.JSONDecodeError, TypeError):
        return False
    candidate = hash_recovery_code(user.id, code)
    for stored in hashes:
        if hmac.compare_digest(stored, candidate):
            hashes.remove(stored)
            user.recovery_code_hashes = json.dumps(hashes)
            return True
    return False


def build_otp_email(code: str) -> tuple[str, str, str]:
    minutes = settings.email_otp_expire_minutes
    subject = "Votre code de connexion"
    text_body = (
        f"Votre code de connexion est : {code}\n\n"
        f"Il expire dans {minutes} minutes. "
        "Si vous n’avez pas demandé ce code, ignorez cet email."
    )
    safe_code = html.escape(code)
    body_html = f"""
              <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#4b5563;">
                Utilise ce code pour finaliser ta connexion. Il expire dans <strong>{minutes} minutes</strong>.
              </p>
              <p style="margin:0;padding:18px 16px;border:3px solid #212121;background:#d0bcff;box-shadow:4px 4px 0 #212121;text-align:center;font-size:32px;line-height:1;font-weight:900;letter-spacing:.28em;font-family:Consolas,Monaco,monospace;">
                {safe_code}
              </p>
              <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#6b7280;">
                Si tu n’as pas demandé ce code, ignore cet email.
              </p>
    """
    html_body = build_brutalist_email(
        title="Votre code de connexion",
        badge="Sécurité",
        badge_bg="#DCFCE7",
        body_html=body_html,
    )
    return subject, text_body, html_body


async def send_otp_email(recipient: str, code: str) -> None:
    if not smtp_configured():
        raise RuntimeError("Email authentication is not configured")
    subject, text_body, html_body = build_otp_email(code)
    await send_email(subject, text_body, recipient, html_body=html_body)
