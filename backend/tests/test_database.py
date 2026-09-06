from app.database import _engine_kwargs


def test_engine_uses_pre_ping_and_recycle() -> None:
    kwargs = _engine_kwargs("postgresql+asyncpg://user:pass@ep-example.neon.tech/db")
    assert kwargs["pool_pre_ping"] is True
    assert kwargs["pool_recycle"] == 280
    assert "connect_args" not in kwargs


def test_pooler_disables_statement_cache() -> None:
    kwargs = _engine_kwargs("postgresql+asyncpg://user:pass@ep-example-pooler.neon.tech/db")
    assert kwargs["connect_args"] == {"statement_cache_size": 0}
