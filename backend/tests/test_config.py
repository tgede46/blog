import pytest
from pydantic import ValidationError

from app.config import Settings


def test_development_cors_supports_local_frontend() -> None:
    config = Settings(
        _env_file=None,
        environment="development",
        frontend_url="http://localhost:3001",
        allowed_origins="",
    )
    assert config.cors_origins == ["http://localhost:3001", "http://localhost:3000"]
    assert config.cookie_secure is False


def test_production_requires_safe_secret_and_origins() -> None:
    with pytest.raises(ValidationError):
        Settings(_env_file=None, environment="production")


def test_production_cookie_is_cross_site_compatible() -> None:
    config = Settings(
        _env_file=None,
        environment="production",
        secret_key="x" * 32,
        allowed_origins="https://blog.vercel.app",
    )
    assert config.cors_origins == ["https://blog.vercel.app"]
    assert config.cookie_secure is True
    assert config.effective_cookie_samesite == "none"


def test_neon_database_url_is_async_compatible() -> None:
    config = Settings(
        _env_file=None,
        database_url=(
            "postgresql://user:pass@neon.example/db"
            "?sslmode=require&channel_binding=require"
        ),
    )
    assert config.database_url == "postgresql+asyncpg://user:pass@neon.example/db?ssl=require"
