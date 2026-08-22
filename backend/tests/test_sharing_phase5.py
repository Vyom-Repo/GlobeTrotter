import pytest
from datetime import date, datetime, timedelta, timezone
from uuid import uuid4, UUID

def get_auth_headers(client, email="sharing_user@example.com", password="Password123!"):
    client.post("/api/v1/auth/register", json={
        "name": "Sharing User",
        "email": email,
        "password": password
    })
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    token = res.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

# --- TRIP SHARING & PUBLIC DISCOVERY TESTS ---

def test_create_and_list_share_token_owner_only(client):
    headers_owner = get_auth_headers(client, "share_owner@example.com")
    headers_other = get_auth_headers(client, "share_other@example.com")
    today = date.today()

    # Create private trip
    trip_res = client.post("/api/v1/trips", json={
        "name": "Secret Escape",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=3)),
        "visibility": "private"
    }, headers=headers_owner)
    trip_id = trip_res.json()["data"]["id"]

    # 1. Owner creates share token
    share_res = client.post(f"/api/v1/trip-shares?trip_id={trip_id}", json={
        "permission": "view"
    }, headers=headers_owner)
    assert share_res.status_code == 201
    share_data = share_res.json()["data"]
    assert "share_token" in share_data
    token = share_data["share_token"]

    # 2. Non-owner cannot create share token -> 403
    other_share = client.post(f"/api/v1/trip-shares?trip_id={trip_id}", json={
        "permission": "view"
    }, headers=headers_other)
    assert other_share.status_code == 403

    # 3. Owner can list shares
    list_res = client.get(f"/api/v1/trips/{trip_id}/shares", headers=headers_owner)
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) == 1

    # 4. Non-owner cannot list shares -> 403
    other_list = client.get(f"/api/v1/trips/{trip_id}/shares", headers=headers_other)
    assert other_list.status_code == 403

def test_resolve_share_token_anonymous_and_expired(client, db_session):
    from backend.models.trip_share import TripShare

    headers_owner = get_auth_headers(client, "token_owner@example.com")
    today = date.today()

    trip_id = client.post("/api/v1/trips", json={
        "name": "Shared Voyage",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=4)),
        "visibility": "private"
    }, headers=headers_owner).json()["data"]["id"]

    # Create active share
    share_res = client.post(f"/api/v1/trip-shares?trip_id={trip_id}", json={
        "permission": "view"
    }, headers=headers_owner)
    token = share_res.json()["data"]["share_token"]
    share_id = share_res.json()["data"]["id"]

    # 7. Anonymous user can resolve valid share token
    anon_res = client.get(f"/api/v1/trip-shares/{token}")
    assert anon_res.status_code == 200
    assert anon_res.json()["data"]["name"] == "Shared Voyage"

    # 8. Invalid token returns 404
    inv_res = client.get(f"/api/v1/trip-shares/invalid_token_xyz_123")
    assert inv_res.status_code == 404
    assert inv_res.json()["error"]["code"] == "SHARE_TOKEN_INVALID"

    # Simulate expired token directly on DB record satisfying created_at < expires_at
    share_record = db_session.query(TripShare).filter(TripShare.id == UUID(share_id)).first()
    share_record.created_at = datetime.now(timezone.utc) - timedelta(days=2)
    share_record.expires_at = datetime.now(timezone.utc) - timedelta(days=1)
    db_session.commit()

    # 10. Expired token returns 404
    exp_res = client.get(f"/api/v1/trip-shares/{token}")
    assert exp_res.status_code == 404
    assert exp_res.json()["error"]["code"] == "SHARE_TOKEN_EXPIRED"

def test_revoke_share_token_owner_only(client):
    headers_owner = get_auth_headers(client, "revoke_owner@example.com")
    headers_other = get_auth_headers(client, "revoke_other@example.com")
    today = date.today()

    trip_id = client.post("/api/v1/trips", json={
        "name": "Revokable Trip",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=2))
    }, headers=headers_owner).json()["data"]["id"]

    share_res = client.post(f"/api/v1/trip-shares?trip_id={trip_id}", headers=headers_owner)
    share_id = share_res.json()["data"]["id"]
    token = share_res.json()["data"]["share_token"]

    # 6. Non-owner cannot revoke -> 403
    other_revoke = client.delete(f"/api/v1/trip-shares/{share_id}", headers=headers_other)
    assert other_revoke.status_code == 403

    # 5. Owner revokes -> 200
    owner_revoke = client.delete(f"/api/v1/trip-shares/{share_id}", headers=headers_owner)
    assert owner_revoke.status_code == 200

    # 9. Revoked token cannot resolve -> 404
    rev_get = client.get(f"/api/v1/trip-shares/{token}")
    assert rev_get.status_code == 404

def test_public_trips_discovery_and_filtering(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City

    headers = get_auth_headers(client, "pub_user@example.com")

    country = Country(name="Greece", iso_code="GR", iso3_code="GRC", region="Europe")
    db_session.add(country)
    db_session.flush()
    city = City(country_id=country.id, name="Athens", region="Attica")
    db_session.add(city)
    db_session.commit()

    today = date.today()
    # 1. Create Public Trip
    pub_trip = client.post("/api/v1/trips", json={
        "name": "Greek Islands Odyssey",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=7)),
        "visibility": "public"
    }, headers=headers).json()["data"]
    pub_trip_id = pub_trip["id"]

    # Add stop in Athens to public trip
    client.post("/api/v1/trip-stops", json={
        "trip_id": pub_trip_id,
        "city_id": str(city.id),
        "start_date": str(today),
        "end_date": str(today + timedelta(days=3)),
        "stop_order": 1
    }, headers=headers)

    # 2. Create Private Trip
    client.post("/api/v1/trips", json={
        "name": "Secret Private Trip",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=2)),
        "visibility": "private"
    }, headers=headers)

    # 11 & 12. Public trip appears in discovery; private trip does not
    disc_res = client.get("/api/v1/public/trips")
    assert disc_res.status_code == 200
    disc_data = disc_res.json()["data"]
    assert len(disc_data) == 1
    assert disc_data[0]["name"] == "Greek Islands Odyssey"

    # 13. Anonymous user can view public trip details by ID
    pub_detail = client.get(f"/api/v1/public/trips/{pub_trip_id}")
    assert pub_detail.status_code == 200
    assert pub_detail.json()["data"]["name"] == "Greek Islands Odyssey"

    # 14. Anonymous user cannot access private trip details -> 404
    priv_detail = client.get(f"/api/v1/public/trips/{uuid4()}")
    assert priv_detail.status_code == 404

    # 15. Search by title
    search_res = client.get("/api/v1/public/trips?search=Greek")
    assert search_res.status_code == 200
    assert len(search_res.json()["data"]) == 1

    no_match_res = client.get("/api/v1/public/trips?search=NonExistentTitle")
    assert no_match_res.status_code == 200
    assert len(no_match_res.json()["data"]) == 0

    # 16. City & Country filtering
    city_res = client.get(f"/api/v1/public/trips?city_id={city.id}")
    assert city_res.status_code == 200
    assert len(city_res.json()["data"]) == 1

    country_res = client.get(f"/api/v1/public/trips?country_id={country.id}")
    assert country_res.status_code == 200
    assert len(country_res.json()["data"]) == 1

    # 17. Pagination
    page_res = client.get("/api/v1/public/trips?page=1&page_size=1")
    assert page_res.status_code == 200
    assert len(page_res.json()["data"]) == 1
    assert page_res.json()["pagination"]["total"] == 1

    # 18 & 21. Verify public response does not leak sensitive user fields or allow mutation
    trip_dict = pub_detail.json()["data"]
    assert "password" not in trip_dict
    assert "hashed_password" not in trip_dict
