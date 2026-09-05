from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import (
    EmailMFAConfirmRequest,
    LoginRequest,
    LoginResponse,
    MessageResponse,
    MFAChallengeRequest,
    MFAStatusResponse,
    MFAVerifyRequest,
    PasswordChangeRequest,
    RecoveryCodesResponse,
    TOTPConfirmRequest,
    TOTPSetupResponse,
    UserOut,
)
from app.services.auth import (
    authenticate_user,
    create_access_token,
    hash_password,
    verify_password,
)
from app.services.mfa import (
    can_resend_email_otp,
    clear_email_otp,
    confirm_totp_setup,
    create_mfa_challenge,
    create_totp_setup,
    decode_mfa_challenge,
    issue_email_otp,
    send_otp_email,
    verify_email_otp,
    verify_recovery_code,
    verify_totp,
)

router = APIRouter()


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=token,
        max_age=settings.access_token_expire_minutes * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.effective_cookie_samesite,
        domain=settings.cookie_domain,
        path="/",
    )


def mfa_methods(user: User) -> list[str]:
    methods: list[str] = []
    if user.totp_enabled:
        methods.append("totp")
    if user.email_mfa_enabled:
        methods.append("email")
    if user.recovery_code_hashes:
        methods.append("recovery")
    return methods


async def challenge_user(db: AsyncSession, token: str) -> User:
    user_id = decode_mfa_challenge(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="MFA challenge expired or invalid")
    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)) -> LoginResponse:
    user = await authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    methods = mfa_methods(user)
    if methods:
        return LoginResponse(
            mfa_required=True,
            challenge_token=create_mfa_challenge(user.id),
            methods=methods,
        )

    token = create_access_token(user.id, user.token_version)
    set_auth_cookie(response, token)
    return LoginResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/mfa/email/send", response_model=MessageResponse)
async def send_email_code(payload: MFAChallengeRequest, db: AsyncSession = Depends(get_db)) -> MessageResponse:
    user = await challenge_user(db, payload.challenge_token)
    if not user.email_mfa_enabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email authentication is not enabled")
    if not can_resend_email_otp(user):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Please wait before requesting another code")
    code = issue_email_otp(user)
    try:
        await send_otp_email(user.email, code)
        await db.commit()
    except RuntimeError as exc:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    return MessageResponse(message="Code sent")


@router.post("/mfa/verify", response_model=LoginResponse)
async def verify_mfa(payload: MFAVerifyRequest, response: Response, db: AsyncSession = Depends(get_db)) -> LoginResponse:
    user = await challenge_user(db, payload.challenge_token)
    valid = False
    if payload.method == "totp":
        valid = verify_totp(user, payload.code)
    elif payload.method == "email":
        valid = user.email_mfa_enabled and verify_email_otp(user, payload.code)
    elif payload.method == "recovery":
        valid = verify_recovery_code(user, payload.code)
    if not valid:
        await db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication code")
    await db.commit()
    token = create_access_token(user.id, user.token_version)
    set_auth_cookie(response, token)
    return LoginResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/mfa/status", response_model=MFAStatusResponse)
async def mfa_status(user: User = Depends(get_current_user)) -> MFAStatusResponse:
    return MFAStatusResponse(
        totp_enabled=user.totp_enabled,
        email_enabled=user.email_mfa_enabled,
        email_available=bool(settings.smtp_host and (settings.smtp_from_email or settings.smtp_user)),
    )


@router.post("/mfa/totp/setup", response_model=TOTPSetupResponse)
async def setup_totp(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> TOTPSetupResponse:
    secret, provisioning_uri = create_totp_setup(user)
    await db.commit()
    return TOTPSetupResponse(secret=secret, provisioning_uri=provisioning_uri)


@router.post("/mfa/totp/confirm", response_model=RecoveryCodesResponse)
async def confirm_totp(
    payload: TOTPConfirmRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RecoveryCodesResponse:
    recovery_codes = confirm_totp_setup(user, payload.code)
    if recovery_codes is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid authentication code")
    await db.commit()
    return RecoveryCodesResponse(recovery_codes=recovery_codes)


@router.post("/mfa/email/setup", response_model=MessageResponse)
async def setup_email_mfa(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)) -> MessageResponse:
    if not can_resend_email_otp(user):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Please wait before requesting another code")
    code = issue_email_otp(user)
    try:
        await send_otp_email(user.email, code)
        await db.commit()
    except RuntimeError as exc:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    return MessageResponse(message="Code sent")


@router.post("/mfa/email/confirm", response_model=MessageResponse)
async def confirm_email_mfa(
    payload: EmailMFAConfirmRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    if not verify_email_otp(user, payload.code):
        await db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid authentication code")
    user.email_mfa_enabled = True
    await db.commit()
    return MessageResponse(message="Email authentication enabled")


@router.post("/password", response_model=MessageResponse)
async def change_password(
    payload: PasswordChangeRequest,
    response: Response,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if verify_password(payload.new_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password must be different")
    user.password_hash = hash_password(payload.new_password)
    user.token_version += 1
    clear_email_otp(user)
    await db.commit()
    set_auth_cookie(response, create_access_token(user.id, user.token_version))
    return MessageResponse(message="Password updated")


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response, _: User = Depends(get_current_user)) -> MessageResponse:
    response.delete_cookie(
        settings.auth_cookie_name,
        domain=settings.cookie_domain,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.effective_cookie_samesite,
    )
    return MessageResponse(message="ok")


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)) -> User:
    return user

