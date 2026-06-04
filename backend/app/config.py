from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://blog:blog@db:5432/blog_db"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    frontend_url: AnyHttpUrl | str = "http://localhost:3000"
    upload_dir: str = "uploads"

    s3_bucket: str | None = None
    s3_region: str | None = None
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [str(self.frontend_url).rstrip("/")]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

