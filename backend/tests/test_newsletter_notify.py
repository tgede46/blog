from types import SimpleNamespace

from app.services import newsletter


def test_publish_email_contains_title_excerpt_and_link(monkeypatch) -> None:
    monkeypatch.setattr(newsletter.settings, "frontend_url", "https://blog.example.com")

    article = SimpleNamespace(
        title="Apprendre Python proprement",
        excerpt="Un résumé court pour les abonnés.",
        slug="apprendre-python-proprement",
    )

    subject, body = newsletter.build_publish_email(article)
    url = newsletter.article_public_url(article.slug)

    assert subject == "Nouvel article : Apprendre Python proprement"
    assert article.excerpt in body
    assert f"Lire l’article :\n{url}" in body
    assert body.index(article.excerpt) < body.index(url)
