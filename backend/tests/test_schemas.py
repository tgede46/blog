import pytest
from pydantic import ValidationError

from app.schemas.article import ArticleCreate
from app.schemas.contact import ContactRequest
from app.schemas.setting import SettingsOut, SettingsUpdate


def test_seed_compatible_content_blocks_are_valid() -> None:
    article = ArticleCreate(
        title="A title",
        excerpt="An excerpt",
        category="Architecture",
        tag="Python",
        content=[
            {"type": "paragraph", "text": "Body"},
            {"type": "code", "filename": "main.py", "code": "print('ok')"},
            {"type": "callout", "text": "Note", "variant": "tip"},
        ],
    )
    assert len(article.content) == 3
    assert article.content[2].variant == "tip"


@pytest.mark.parametrize(
    "block",
    [
        {"type": "paragraph"},
        {"type": "code", "text": "wrong field"},
        {"type": "image", "text": ""},
        {"type": "unknown", "text": "Body"},
    ],
)
def test_content_blocks_are_strict(block: dict[str, str]) -> None:
    with pytest.raises(ValidationError):
        ArticleCreate(
            title="A title",
            excerpt="An excerpt",
            category="Architecture",
            tag="Python",
            content=[block],
        )


def test_editorial_settings_contract() -> None:
    settings = SettingsOut(
        site_name="My blog",
        contact_email="owner@example.com",
        github_url="https://github.com/example",
    )
    assert str(settings.contact_email) == "owner@example.com"
    assert str(settings.github_url) == "https://github.com/example"
    with pytest.raises(ValidationError):
        SettingsUpdate(site_name="")


def test_contact_validation_rejects_short_message() -> None:
    with pytest.raises(ValidationError):
        ContactRequest(name="Jane", email="jane@example.com", subject="Hello", message="short")
