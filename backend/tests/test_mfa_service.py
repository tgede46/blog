from types import SimpleNamespace
from uuid import uuid4

import pyotp

from app.services.mfa import (
    confirm_totp_setup,
    create_mfa_challenge,
    create_totp_setup,
    decode_mfa_challenge,
    issue_email_otp,
    verify_email_otp,
    verify_recovery_code,
    verify_totp,
)


def make_user() -> SimpleNamespace:
    return SimpleNamespace(
        id=uuid4(),
        email="admin@example.com",
        totp_secret_encrypted=None,
        totp_pending_secret_encrypted=None,
        totp_enabled=False,
        totp_last_used_step=None,
        email_otp_hash=None,
        email_otp_expires_at=None,
        email_otp_sent_at=None,
        email_otp_attempts=0,
        recovery_code_hashes=None,
    )


def test_mfa_challenge_is_scoped_and_signed() -> None:
    user = make_user()
    token = create_mfa_challenge(user.id)

    assert decode_mfa_challenge(token) == user.id
    assert decode_mfa_challenge(f"{token}invalid") is None


def test_totp_setup_and_replay_protection() -> None:
    user = make_user()
    secret, uri = create_totp_setup(user)
    code = pyotp.TOTP(secret).now()

    recovery_codes = confirm_totp_setup(user, code)

    assert uri.startswith("otpauth://totp/")
    assert recovery_codes is not None
    assert len(recovery_codes) == 8
    assert user.totp_enabled is True
    assert verify_totp(user, code) is True
    assert verify_totp(user, code) is False


def test_email_otp_is_one_time_and_limits_failed_attempts() -> None:
    user = make_user()
    code = issue_email_otp(user)

    assert verify_email_otp(user, "000000" if code != "000000" else "999999") is False
    assert user.email_otp_attempts == 1
    assert verify_email_otp(user, code) is True
    assert verify_email_otp(user, code) is False


def test_recovery_code_can_only_be_used_once() -> None:
    user = make_user()
    secret, _ = create_totp_setup(user)
    recovery_codes = confirm_totp_setup(user, pyotp.TOTP(secret).now())
    assert recovery_codes

    code = recovery_codes[0]
    assert verify_recovery_code(user, code) is True
    assert verify_recovery_code(user, code) is False
