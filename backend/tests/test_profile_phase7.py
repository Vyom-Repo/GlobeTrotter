import pytest
from backend.models.user import User
from backend.services.auth_service import AuthService
from backend.schemas.user import UserCreate

@pytest.fixture
def test_user(db_session):
    user_in = UserCreate(name="Original Name", email="user_phase7@example.com", password="Password123!")
    user, token = AuthService.register_user(db_session, user_in)
    return user, token

@pytest.fixture
def second_user(db_session):
    user_in = UserCreate(name="Second User", email="second_user@example.com", password="Password123!")
    user, token = AuthService.register_user(db_session, user_in)
    return user, token

# 1. PROFILE TESTS
def test_unauthenticated_profile_access_rejected(client):
    res = client.get("/api/v1/users/me")
    assert res.status_code == 401
    assert res.json()["success"] is False

def test_get_current_profile_success(client, test_user):
    user, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/users/me", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["email"] == "user_phase7@example.com"
    assert data["name"] == "Original Name"
    assert "password" not in data
    assert "password_hash" not in data

def test_update_profile_success_and_email_normalization(client, test_user):
    user, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    update_payload = {
        "name": "Updated Name",
        "email": "  USER_PHASE7_NEW@EXAMPLE.COM  ",
        "phone": "+1 555-0199",
        "city": "New York",
        "country": "USA"
    }

    res = client.put("/api/v1/users/me", json=update_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["name"] == "Updated Name"
    assert data["email"] == "user_phase7_new@example.com"
    assert data["phone"] == "+1 555-0199"
    assert data["city"] == "New York"
    assert data["country"] == "USA"

def test_update_profile_duplicate_email_rejected(client, test_user, second_user):
    user, token = test_user
    _, _ = second_user
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt to take second_user's email
    res = client.put("/api/v1/users/me", json={"email": "SECOND_USER@example.com"}, headers=headers)
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "EMAIL_ALREADY_EXISTS"

# 2. PASSWORD MANAGEMENT TESTS
def test_change_password_success_and_login(client, db_session, test_user):
    user, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    change_pwd_payload = {
        "current_password": "Password123!",
        "new_password": "NewSecretPassword456!",
        "confirm_password": "NewSecretPassword456!"
    }

    res = client.post("/api/v1/users/me/change-password", json=change_pwd_payload, headers=headers)
    assert res.status_code == 200
    assert res.json()["success"] is True

    # Attempt login with OLD password -> fails
    res_old_login = client.post("/api/v1/auth/login", json={"email": user.email, "password": "Password123!"})
    assert res_old_login.status_code == 401
    assert res_old_login.json()["error"]["code"] == "INVALID_CREDENTIALS"

    # Login with NEW password -> succeeds
    res_new_login = client.post("/api/v1/auth/login", json={"email": user.email, "password": "NewSecretPassword456!"})
    assert res_new_login.status_code == 200
    assert "access_token" in res_new_login.json()["data"]

def test_change_password_incorrect_current_password(client, test_user):
    _, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "current_password": "WrongCurrentPassword!",
        "new_password": "NewPassword123!",
        "confirm_password": "NewPassword123!"
    }
    res = client.post("/api/v1/users/me/change-password", json=payload, headers=headers)
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "INVALID_CURRENT_PASSWORD"

def test_change_password_mismatch_confirmation(client, test_user):
    _, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "current_password": "Password123!",
        "new_password": "NewPassword123!",
        "confirm_password": "DifferentPassword123!"
    }
    res = client.post("/api/v1/users/me/change-password", json=payload, headers=headers)
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "PASSWORD_CONFIRMATION_MISMATCH"

def test_change_password_reuse_rejected(client, test_user):
    _, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "current_password": "Password123!",
        "new_password": "Password123!",
        "confirm_password": "Password123!"
    }
    res = client.post("/api/v1/users/me/change-password", json=payload, headers=headers)
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "PASSWORD_REUSE_NOT_ALLOWED"

def test_change_password_weak_password_rejected(client, test_user):
    _, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "current_password": "Password123!",
        "new_password": "123",
        "confirm_password": "123"
    }
    res = client.post("/api/v1/users/me/change-password", json=payload, headers=headers)
    assert res.status_code in (400, 422)

# 3. PREFERENCES TESTS
def test_user_preferences_crud(client, test_user):
    _, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    # Get initial preferences
    res_get = client.get("/api/v1/users/me/preferences", headers=headers)
    assert res_get.status_code == 200
    data = res_get.json()["data"]
    assert data["language"] == "en"
    assert data["currency"] == "INR"

    # Update preferences
    pref_update = {
        "language": "es",
        "currency": "EUR",
        "notifications_enabled": False,
        "theme": "dark"
    }
    res_put = client.put("/api/v1/users/me/preferences", json=pref_update, headers=headers)
    assert res_put.status_code == 200
    data_put = res_put.json()["data"]
    assert data_put["language"] == "es"
    assert data_put["currency"] == "EUR"
    assert data_put["notifications_enabled"] is False
    assert data_put["theme"] == "dark"

    # Verify persistence
    res_get2 = client.get("/api/v1/users/me/preferences", headers=headers)
    assert res_get2.json()["data"]["currency"] == "EUR"

# 4. ACCOUNT LIFECYCLE TESTS
def test_account_deactivation_blocks_login_and_token(client, test_user):
    user, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    # Deactivate account
    res_deact = client.post("/api/v1/users/me/deactivate", headers=headers)
    assert res_deact.status_code == 200
    assert res_deact.json()["success"] is True

    # Login attempt fails with ACCOUNT_DEACTIVATED / 401
    res_login = client.post("/api/v1/auth/login", json={"email": user.email, "password": "Password123!"})
    assert res_login.status_code == 401
    assert res_login.json()["error"]["code"] == "ACCOUNT_DEACTIVATED"

    # Protected route attempt with token fails with USER_NOT_FOUND / 401
    res_prot = client.get("/api/v1/users/me", headers=headers)
    assert res_prot.status_code == 401

def test_account_deletion_endpoint(client, test_user):
    user, token = test_user
    headers = {"Authorization": f"Bearer {token}"}

    res_del = client.delete("/api/v1/users/me", headers=headers)
    assert res_del.status_code == 200
    assert res_del.json()["success"] is True

    # Further calls fail
    res_me = client.get("/api/v1/users/me", headers=headers)
    assert res_me.status_code == 401
