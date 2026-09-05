from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.user import UserRole


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    avatar_url: str | None = None
    role: UserRole

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginResponse(BaseModel):
    access_token: str | None = None
    token_type: str = "bearer"
    user: UserOut | None = None
    mfa_required: bool = False
    challenge_token: str | None = None
    methods: list[Literal["totp", "email", "recovery"]] = Field(default_factory=list)


class MFAChallengeRequest(BaseModel):
    challenge_token: str


class MFAVerifyRequest(MFAChallengeRequest):
    method: Literal["totp", "email", "recovery"]
    code: str


class TOTPSetupResponse(BaseModel):
    secret: str
    provisioning_uri: str


class TOTPConfirmRequest(BaseModel):
    code: str


class RecoveryCodesResponse(BaseModel):
    recovery_codes: list[str]


class MFAStatusResponse(BaseModel):
    totp_enabled: bool
    email_enabled: bool
    email_available: bool


class EmailMFAConfirmRequest(BaseModel):
    code: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must contain at least 8 characters")
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 bytes")
        return value


class MessageResponse(BaseModel):
    message: str

