from types import SimpleNamespace
from uuid import uuid4

from fastapi.testclient import TestClient

from app.deps import get_db
from app.main import app
from app.models.user import UserRole
from app.routers import auth as auth_router
from app.routers import contact as contact_router
from app.routers import settings as settings_router
from app.schemas.setting import SettingsOut


async def fake_db() -> object:
    yield object()


def test_login_returns_bearer_and_sets_http_only_cookie(monkeypatch) -> None:
    user = SimpleNamespace(
        id=uuid4(),
        email="admin@example.com",
        name="Admin",
        avatar_url=None,
        role=UserRole.admin,
        totp_enabled=False,
        email_mfa_enabled=False,
        recovery_code_hashes=None,
        token_version=0,
    )

    async def authenticate(*_args) -> object:
        return user

    monkeypatch.setattr(auth_router, "authenticate_user", authenticate)
    monkeypatch.setattr(auth_router, "create_access_token", lambda *_args: "signed-token")
    app.dependency_overrides[get_db] = fake_db
    try:
        response = TestClient(app).post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": "secret"},
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["access_token"] == "signed-token"
    cookie = response.headers["set-cookie"].lower()
    assert "httponly" in cookie
    assert "samesite=lax" in cookie


def test_login_requires_second_factor_when_enabled(monkeypatch) -> None:
    user = SimpleNamespace(
        id=uuid4(),
        email="admin@example.com",
        name="Admin",
        avatar_url=None,
        role=UserRole.admin,
        totp_enabled=True,
        email_mfa_enabled=True,
        recovery_code_hashes='["hash"]',
        token_version=0,
    )

    async def authenticate(*_args) -> object:
        return user

    monkeypatch.setattr(auth_router, "authenticate_user", authenticate)
    monkeypatch.setattr(auth_router, "create_mfa_challenge", lambda _user_id: "mfa-token")
    app.dependency_overrides[get_db] = fake_db
    try:
        response = TestClient(app).post(
            "/api/auth/login",
            json={"email": "admin@example.com", "password": "secret"},
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["mfa_required"] is True
    assert response.json()["challenge_token"] == "mfa-token"
    assert response.json()["methods"] == ["totp", "email", "recovery"]
    assert "blog_access_token" not in response.cookies


def test_public_settings_contract(monkeypatch) -> None:
    async def get_values(_db) -> SettingsOut:
        return SettingsOut(site_name="Production blog", hero_title="Welcome")

    monkeypatch.setattr(settings_router, "get_settings_values", get_values)
    app.dependency_overrides[get_db] = fake_db
    try:
        response = TestClient(app).get("/api/settings")
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["hero_title"] == "Welcome"
    assert "legal_content" in response.json()


def test_contact_succeeds_without_smtp(monkeypatch) -> None:
    delivered: list[str] = []

    async def get_values(_db) -> SettingsOut:
        return SettingsOut(contact_email="owner@example.com")

    async def deliver(payload, recipient) -> None:
        delivered.append(f"{payload.subject}:{recipient}")

    monkeypatch.setattr(contact_router, "get_settings_values", get_values)
    monkeypatch.setattr(contact_router, "deliver_contact", deliver)
    app.dependency_overrides[get_db] = fake_db
    try:
        response = TestClient(app).post(
            "/api/contact",
            json={
                "name": "Jane Doe",
                "email": "jane@example.com",
                "subject": "A question",
                "message": "This is a sufficiently long contact message.",
            },
        )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 202
    assert response.json()["success"] is True
    assert delivered == ["A question:owner@example.com"]


def test_required_routes_are_exposed() -> None:
    paths = app.openapi()["paths"]
    assert {
        "/api/auth/login",
        "/api/auth/logout",
        "/api/auth/me",
        "/api/articles",
        "/api/articles/{slug}",
        "/api/articles/{slug}/related",
        "/api/newsletter/subscribe",
        "/api/contact",
        "/api/settings",
        "/api/admin/posts",
        "/api/admin/posts/{post_id}",
        "/api/admin/media",
        "/api/admin/settings",
        "/api/admin/stats",
        "/health/live",
        "/health/ready",
    } <= paths.keys()
