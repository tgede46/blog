import pytest
from pydantic import ValidationError

from app.schemas.article import ArticleCreate, ArticleUpdate
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
            {
                "type": "image",
                "url": "https://cdn.example.com/image.png",
                "alt": "Architecture",
                "caption": "Vue générale",
            },
            {"type": "heading", "text": "Section", "level": 2},
            {"type": "heading", "text": "Sous-section", "level": 3},
            {"type": "list", "items": ["un admin", "des médias"]},
        ],
    )
    assert len(article.content) == 7
    assert article.content[2].variant == "tip"
    assert article.content[3].url == "https://cdn.example.com/image.png"
    assert article.content[5].level == 3
    assert article.content[6].items == ["un admin", "des médias"]


def test_legacy_image_text_is_migrated_to_url() -> None:
    article = ArticleCreate(
        title="A title",
        excerpt="An excerpt",
        category="Architecture",
        tag="Python",
        content=[{"type": "image", "text": "https://cdn.example.com/legacy.png"}],
    )

    assert article.content[0].url == "https://cdn.example.com/legacy.png"
    assert article.content[0].alt == ""


def test_complete_article_update_contract() -> None:
    update = ArticleUpdate(
        title="Article final",
        excerpt="Résumé",
        category="Développement",
        tag="TypeScript",
        status="published",
        read_minutes=7,
        content=[
            {"type": "heading", "text": "Introduction"},
            {"type": "paragraph", "text": "Contenu"},
            {"type": "callout", "text": "À retenir", "variant": "quote"},
            {"type": "callout", "text": "Astuce", "variant": "tip"},
            {"type": "code", "code": "const ready = true", "filename": "article.ts"},
            {"type": "image", "url": "https://cdn.example.com/final.png", "alt": "Aperçu"},
        ],
    )

    assert len(update.content or []) == 6
    assert update.status == "published"


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
