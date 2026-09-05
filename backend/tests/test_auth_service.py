from uuid import uuid4

import pytest

from app.services.auth import (
    create_access_token,
    decode_access_token_claims,
    hash_password,
    verify_password,
)


def test_password_hash_round_trip() -> None:
    password_hash = hash_password("correct horse battery staple")

    assert verify_password("correct horse battery staple", password_hash)
    assert not verify_password("wrong password", password_hash)


def test_password_longer_than_bcrypt_limit_is_rejected() -> None:
    with pytest.raises(ValueError, match="72 bytes"):
        hash_password("é" * 40)


def test_access_token_contains_session_version() -> None:
    user_id = uuid4()

    claims = decode_access_token_claims(create_access_token(user_id, token_version=3))

    assert claims == (user_id, 3)

