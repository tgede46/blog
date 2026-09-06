from types import SimpleNamespace

from app.services import newsletter


def test_publish_email_contains_title_excerpt_and_link(monkeypatch) -> None:
    monkeypatch.setattr(newsletter.settings, "frontend_url", "https://blog.example.com")

    article = SimpleNamespace(
        title="Apprendre Python proprement",
        excerpt="Un résumé court pour les abonnés.",
        slug="apprendre-python-proprement",
    )

    subject, text_body, html_body = newsletter.build_publish_email(article)
    url = newsletter.article_public_url(article.slug)

    assert subject == "Nouvel article : Apprendre Python proprement"
    assert article.excerpt in text_body
    assert f"Lire l’article :\n{url}" in text_body
    assert text_body.index(article.excerpt) < text_body.index(url)
    assert "Lire l’article" in html_body
    assert url in html_body
    assert "background:#FDE047" in html_body
    assert article.title in html_body
