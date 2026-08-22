import pytest
from datetime import timedelta
from backend.core.security import create_access_token, get_password_hash
from backend.models.user import User

def test_register_user_success(client):
    """Test successful user registration."""
    payload = {
        "name": "Jane Traveller",
        "email": "jane@example.com",
        "password": "securePassword123",
        "profile_photo_url": "https://example.com/avatar.jpg"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["token_type"] == "bearer"
    
    user_data = data["data"]["user"]
    assert user_data["name"] == "Jane Traveller"
    assert user_data["email"] == "jane@example.com"
    assert user_data["profile_photo_url"] == "https://example.com/avatar.jpg"
    assert "password" not in user_data
    assert "password_hash" not in user_data

def test_register_user_duplicate_email(client):
    """Test registering with an existing email returns EMAIL_ALREADY_EXISTS code."""
    payload = {
        "name": "First User",
        "email": "duplicate@example.com",
        "password": "password123"
    }
    client.post("/api/v1/auth/register", json=payload)

    # Second attempt with same email (different case)
    payload_dup = {
        "name": "Second User",
        "email": "DUPLICATE@example.com",
        "password": "password456"
    }
    response = client.post("/api/v1/auth/register", json=payload_dup)
    assert response.status_code == 400
    res_data = response.json()
    assert res_data["success"] is False
    assert res_data["error"]["code"] == "EMAIL_ALREADY_EXISTS"

def test_register_short_password(client):
    """Test registering with a password shorter than 6 characters fails validation."""
    payload = {
        "name": "Short Pass User",
        "email": "short@example.com",
        "password": "123"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422

def test_login_success(client):
    """Test login with valid credentials."""
    reg_payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "mysecretpassword"
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    login_payload = {
        "email": "john@example.com",
        "password": "mysecretpassword"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["email"] == "john@example.com"

def test_login_invalid_credentials(client):
    """Test login with wrong password returns INVALID_CREDENTIALS."""
    reg_payload = {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "mysecretpassword"
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    login_payload = {
        "email": "john@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 401
    res_data = response.json()
    assert res_data["success"] is False
    assert res_data["error"]["code"] == "INVALID_CREDENTIALS"

def test_login_deactivated_account(client, db_session):
    """Test login for a deactivated account fails."""
    hashed = get_password_hash("password123")
    user = User(
        name="Deactivated User",
        email="inactive@example.com",
        password_hash=hashed,
        is_active=False
    )
    db_session.add(user)
    db_session.commit()

    response = client.post("/api/v1/auth/login", json={"email": "inactive@example.com", "password": "password123"})
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "ACCOUNT_DEACTIVATED"

def test_get_current_user_me(client):
    """Test authenticated endpoints /auth/me and /users/me."""
    reg_resp = client.post("/api/v1/auth/register", json={
        "name": "Alice Traveler",
        "email": "alice@example.com",
        "password": "password123"
    }).json()
    token = reg_resp["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # /auth/me
    me_resp = client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["data"]["email"] == "alice@example.com"

    # /users/me
    user_me_resp = client.get("/api/v1/users/me", headers=headers)
    assert user_me_resp.status_code == 200
    assert user_me_resp.json()["data"]["name"] == "Alice Traveler"

def test_unauthenticated_protected_route(client):
    """Test accessing protected route without Bearer token returns 401."""
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "AUTHENTICATION_REQUIRED"

def test_expired_jwt_token(client, db_session):
    """Test expired token returns 401."""
    user = User(
        name="Test User",
        email="test@example.com",
        password_hash=get_password_hash("pass123")
    )
    db_session.add(user)
    db_session.commit()

    expired_token = create_access_token(subject=user.id, expires_delta=timedelta(seconds=-10))
    headers = {"Authorization": f"Bearer {expired_token}"}

    response = client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "INVALID_TOKEN"

def test_update_user_profile(client):
    """Test updating authenticated user profile."""
    reg_resp = client.post("/api/v1/auth/register", json={
        "name": "Bob Explorer",
        "email": "bob@example.com",
        "password": "password123"
    }).json()
    token = reg_resp["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    update_payload = {
        "name": "Bob the Explorer",
        "profile_photo_url": "https://example.com/bob.jpg"
    }
    resp = client.put("/api/v1/users/me", json=update_payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["name"] == "Bob the Explorer"
    assert data["profile_photo_url"] == "https://example.com/bob.jpg"
