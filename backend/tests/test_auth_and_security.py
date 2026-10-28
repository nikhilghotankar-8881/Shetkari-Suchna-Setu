import time
from datetime import timedelta
from app.core.security import (
    generate_profile_token,
    hash_token,
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
)


def test_farmer_anonymous_token():
    token_a = generate_profile_token()
    token_b = generate_profile_token()

    assert token_a != token_b
    assert len(token_a) == 64  # 32 bytes hex encoded = 64 chars

    hash_a = hash_token(token_a)
    hash_b = hash_token(token_b)

    assert hash_a != hash_b
    assert len(hash_a) == 64  # SHA-256 output length
    assert hash_token(token_a) == hash_a  # Deterministic


def test_admin_password_hashing():
    raw_pass = "SuperSecretAdminPass123!"
    hashed = get_password_hash(raw_pass)

    assert hashed != raw_pass
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_admin_jwt_lifecycle():
    user_payload = {"sub": "user-uuid-1234", "email": "admin@shetkari.gov.in", "role": "admin"}
    token = create_access_token(user_payload, expires_delta=timedelta(minutes=5))

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user-uuid-1234"
    assert decoded["email"] == "admin@shetkari.gov.in"
    assert decoded["role"] == "admin"


def test_expired_jwt_rejected():
    user_payload = {"sub": "user-uuid-1234", "role": "admin"}
    # Token expired 1 minute ago
    expired_token = create_access_token(user_payload, expires_delta=timedelta(seconds=-60))

    decoded = decode_access_token(expired_token)
    assert decoded is None
