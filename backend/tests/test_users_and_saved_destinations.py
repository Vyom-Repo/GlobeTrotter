import pytest
from uuid import uuid4

def get_auth_headers(client, email="user_pref@example.com", password="Password123!"):
    client.post("/api/v1/auth/register", json={
        "name": "User Pref Test",
        "email": email,
        "password": password
    })
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    token = res.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

# --- USER PROFILE & PREFERENCES TESTS ---

def test_get_and_update_user_profile(client):
    headers = get_auth_headers(client, "profile_user@example.com")

    # Get profile
    get_res = client.get("/api/v1/users/me", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["data"]["email"] == "profile_user@example.com"

    # Update profile
    put_res = client.put("/api/v1/users/me", json={
        "name": "Updated Name",
        "profile_photo_url": "https://example.com/photo.jpg"
    }, headers=headers)
    assert put_res.status_code == 200
    data = put_res.json()["data"]
    assert data["name"] == "Updated Name"
    assert data["profile_photo_url"] == "https://example.com/photo.jpg"

def test_get_and_update_user_preferences(client):
    headers = get_auth_headers(client, "pref_user@example.com")

    # Get default preferences
    get_res = client.get("/api/v1/users/me/preferences", headers=headers)
    assert get_res.status_code == 200
    data = get_res.json()["data"]
    assert data["language"] == "en"
    assert data["currency"] == "INR"

    # Update preferences
    put_res = client.put("/api/v1/users/me/preferences", json={
        "language": "fr",
        "currency": "EUR"
    }, headers=headers)
    assert put_res.status_code == 200
    upd_data = put_res.json()["data"]
    assert upd_data["language"] == "fr"
    assert upd_data["currency"] == "EUR"

# --- SAVED DESTINATIONS TESTS ---

def test_saved_destinations_crud(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City

    headers = get_auth_headers(client, "saved_dest@example.com")

    country = Country(name="Germany", iso_code="DE", iso3_code="DEU", region="Europe")
    db_session.add(country)
    db_session.flush()
    city = City(country_id=country.id, name="Berlin", region="Berlin")
    db_session.add(city)
    db_session.commit()

    # 1. Save destination
    save_res = client.post("/api/v1/saved-destinations", json={
        "city_id": str(city.id)
    }, headers=headers)
    assert save_res.status_code == 201
    saved_id = save_res.json()["data"]["id"]

    # 2. Duplicate save -> 400
    dup_res = client.post("/api/v1/saved-destinations", json={
        "city_id": str(city.id)
    }, headers=headers)
    assert dup_res.status_code == 400
    assert dup_res.json()["error"]["code"] == "DESTINATION_ALREADY_SAVED"

    # 3. List saved destinations
    list_res = client.get("/api/v1/saved-destinations", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) == 1

    # 4. Remove saved destination
    del_res = client.delete(f"/api/v1/saved-destinations/{saved_id}", headers=headers)
    assert del_res.status_code == 200

    # 5. Remove non-existent saved destination -> 404
    no_exist = client.delete(f"/api/v1/saved-destinations/{uuid4()}", headers=headers)
    assert no_exist.status_code == 404
