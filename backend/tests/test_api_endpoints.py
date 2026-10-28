import pytest
from app.config import settings
from app.models.user import User
from app.core.security import get_password_hash


@pytest.mark.asyncio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Shetkari Suchna-Setu" in data["app"]


@pytest.mark.asyncio
async def test_anonymous_farmer_profile_lifecycle(client):
    # 1. Create anonymous profile
    profile_payload = {
        "district": "Nashik",
        "taluka": "Niphad",
        "crops": ["Soybean", "Grapes"],
        "lang": "mr"
    }
    create_res = await client.post("/api/v1/farmer/profile", json=profile_payload)
    assert create_res.status_code == 201
    profile_data = create_res.json()
    assert profile_data["district"] == "Nashik"
    assert "token" in profile_data
    token = profile_data["token"]
    assert len(token) == 64

    # 2. Get profile using header
    get_res = await client.get("/api/v1/farmer/profile", headers={"X-Profile-Token": token})
    assert get_res.status_code == 200
    assert get_res.json()["district"] == "Nashik"

    # 3. Test unauthorized access with invalid token
    bad_res = await client.get("/api/v1/farmer/profile", headers={"X-Profile-Token": "invalid_fake_token_1234"})
    assert bad_res.status_code == 401

    # 4. Update profile
    update_res = await client.put(
        "/api/v1/farmer/profile",
        headers={"X-Profile-Token": token},
        json={"district": "Nashik", "crops": ["Soybean", "Grapes", "Onion"]}
    )
    assert update_res.status_code == 200
    assert "Onion" in update_res.json()["crops"]

    # 5. Delete profile (DPDP compliance)
    del_res = await client.delete("/api/v1/farmer/profile", headers={"X-Profile-Token": token})
    assert del_res.status_code == 204

    # 6. Verify profile no longer accessible
    verify_del = await client.get("/api/v1/farmer/profile", headers={"X-Profile-Token": token})
    assert verify_del.status_code == 401


@pytest.mark.asyncio
async def test_admin_auth_and_rbac(client, db_session):
    # Seed an admin user directly into the test DB session
    test_admin = User(
        email="test_reviewer@shetkari.gov.in",
        password_hash=get_password_hash("TestPassword123!"),
        role="reviewer",
        is_active=True,
    )
    db_session.add(test_admin)
    await db_session.commit()

    # 1. Unauthenticated request to /api/v1/admin/sources should fail with 401
    unauth_res = await client.get("/api/v1/admin/sources")
    assert unauth_res.status_code == 401

    # 2. Login as reviewer
    login_res = await client.post(
        "/api/v1/admin/login",
        json={"email": "test_reviewer@shetkari.gov.in", "password": "TestPassword123!"}
    )
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    access_token = token_data["access_token"]
    assert token_data["role"] == "reviewer"

    # 3. Access /api/v1/admin/sources with token
    auth_res = await client.get(
        "/api/v1/admin/sources",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert auth_res.status_code == 200
    assert isinstance(auth_res.json(), list)

    # 4. Reviewer attempting to perform admin-only action (create source) should get 403 Forbidden
    create_src_res = await client.post(
        "/api/v1/admin/sources",
        headers={"Authorization": f"Bearer {access_token}"},
        json={
            "name": "Test Source",
            "url": "https://example.com/notices",
            "kind": "html",
            "mode": "auto",
            "poll_minutes": 120
        }
    )
    assert create_src_res.status_code == 403
