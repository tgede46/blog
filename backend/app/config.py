from functools import lru_cache
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"
    database_url: str = "postgresql+asyncpg://blog:blog@db:5432/blog_db"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    mfa_challenge_expire_minutes: int = 5
    email_otp_expire_minutes: int = 10
    email_otp_resend_seconds: int = 60

    frontend_url: str = "http://localhost:3000"
    allowed_origins: str = ""
    auth_cookie_name: str = "blog_access_token"
    cookie_domain: str | None = None
    cookie_samesite: str = "lax"
    upload_dir: str = "uploads"
    max_upload_bytes: int = 10 * 1024 * 1024
    allowed_upload_mime_types: str = "image/jpeg,image/png,image/webp,image/gif"
    allowed_upload_extensions: str = ".jpg,.jpeg,.png,.webp,.gif"

    s3_bucket: str | None = None
    s3_region: str | None = None
    s3_endpoint_url: str | None = None
    s3_public_base_url: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_to_email: str | None = None
    smtp_use_tls: bool = True
    rate_limit_requests: int = 120
    rate_limit_window_seconds: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("environment")
    @classmethod
    def normalize_environment(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: object) -> object:
        if not isinstance(value, str):
            return value
        if value.startswith("postgres://"):
            value = value.replace("postgres://", "postgresql+asyncpg://", 1)
        elif value.startswith("postgresql://"):
            value = value.replace("postgresql://", "postgresql+asyncpg://", 1)
        parts = urlsplit(value)
        query = []
        for key, item in parse_qsl(parts.query, keep_blank_values=True):
            if key == "channel_binding":
                continue
            query.append(("ssl" if key == "sslmode" else key, item))
        return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))

    @field_validator("cookie_samesite")
    @classmethod
    def validate_samesite(cls, value: str) -> str:
        normalized = value.lower()
        if normalized not in {"lax", "strict", "none"}:
            raise ValueError("COOKIE_SAMESITE must be lax, strict, or none")
        return normalized

    @model_validator(mode="after")
    def validate_production(self) -> "Settings":
        if self.is_production:
            if self.secret_key == "change-me-in-production" or len(self.secret_key) < 32:
                raise ValueError("A SECRET_KEY of at least 32 characters is required in production")
            if not self.allowed_origins.strip():
                raise ValueError("ALLOWED_ORIGINS is required in production")
        return self

    @property
    def is_production(self) -> bool:
        return self.environment in {"production", "prod"}

    @property
    def cors_origins(self) -> list[str]:
        base = str(self.frontend_url).rstrip("/")
        configured = [origin.strip().rstrip("/") for origin in self.allowed_origins.split(",") if origin.strip()]
        if self.is_production:
            return list(dict.fromkeys(configured))
        return list(dict.fromkeys([base, "http://localhost:3000", "http://localhost:3001", *configured]))

    @property
    def cookie_secure(self) -> bool:
        return self.is_production

    @property
    def effective_cookie_samesite(self) -> str:
        return "none" if self.is_production else self.cookie_samesite

    @property
    def upload_mime_types(self) -> set[str]:
        return {value.strip().lower() for value in self.allowed_upload_mime_types.split(",") if value.strip()}

    @property
    def upload_extensions(self) -> set[str]:
        return {value.strip().lower() for value in self.allowed_upload_extensions.split(",") if value.strip()}


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

