import pytest
from datetime import date, timedelta
from uuid import uuid4

def get_auth_headers(client, email="user3@example.com", password="Password123!"):
    client.post("/api/v1/auth/register", json={
        "name": "Test User 3",
        "email": email,
        "password": password
    })
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    token = res.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

# --- TRIP CRUD & AUTHORIZATION TESTS ---

def test_create_and_get_trip(client):
    headers = get_auth_headers(client, "owner@example.com")
    today = date.today()
    next_week = today + timedelta(days=7)

    payload = {
        "name": "European Escapade",
        "description": "Visiting Paris & Rome",
        "start_date": str(today),
        "end_date": str(next_week),
        "budget_limit": 5000.00,
        "currency": "EUR",
        "visibility": "private"
    }

    res = client.post("/api/v1/trips", json=payload, headers=headers)
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["name"] == "European Escapade"
    assert data["visibility"] == "private"
    trip_id = data["id"]

    # Get owned trip
    get_res = client.get(f"/api/v1/trips/{trip_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["data"]["id"] == trip_id

def test_unauthorized_trip_access(client):
    headers_owner = get_auth_headers(client, "user_owner@example.com")
    headers_other = get_auth_headers(client, "user_other@example.com")

    today = date.today()
    payload = {
        "name": "Secret Trip",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=3)),
        "visibility": "private"
    }

    create_res = client.post("/api/v1/trips", json=payload, headers=headers_owner)
    trip_id = create_res.json()["data"]["id"]

    # User B tries to view User A's private trip -> 403
    other_res = client.get(f"/api/v1/trips/{trip_id}", headers=headers_other)
    assert other_res.status_code == 403

    # User B tries to update User A's trip -> 403
    update_res = client.put(f"/api/v1/trips/{trip_id}", json={"name": "Hacked Trip"}, headers=headers_other)
    assert update_res.status_code == 403

    # User B tries to delete User A's trip -> 403
    del_res = client.delete(f"/api/v1/trips/{trip_id}", headers=headers_other)
    assert del_res.status_code == 403

def test_trip_date_validation(client):
    headers = get_auth_headers(client, "dateval@example.com")
    today = date.today()
    invalid_payload = {
        "name": "Invalid Dates Trip",
        "start_date": str(today + timedelta(days=5)),
        "end_date": str(today),
        "visibility": "private"
    }
    res = client.post("/api/v1/trips", json=invalid_payload, headers=headers)
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "INVALID_DATE_RANGE"

def test_user_trip_listing_pagination(client):
    headers = get_auth_headers(client, "listuser@example.com")
    today = date.today()

    for i in range(3):
        client.post("/api/v1/trips", json={
            "name": f"Trip {i+1}",
            "start_date": str(today),
            "end_date": str(today + timedelta(days=2))
        }, headers=headers)

    res = client.get("/api/v1/trips?page=1&page_size=2", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["data"]) == 2
    assert data["pagination"]["total"] == 3
    assert data["pagination"]["total_pages"] == 2

# --- CITY & ACTIVITY OFFLINE SEARCH TESTS ---

def test_offline_city_search(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City

    country = Country(name="France", iso_code="FR", iso3_code="FRA", region="Europe")
    db_session.add(country)
    db_session.flush()

    city = City(country_id=country.id, name="Paris", region="Île-de-France")
    db_session.add(city)
    db_session.commit()

    res = client.get("/api/v1/cities?search=Paris")
    assert res.status_code == 200
    cities = res.json()["data"]
    assert len(cities) == 1
    assert cities[0]["name"] == "Paris"

# --- TRIP STOPS & ITINERARY TESTS ---

def test_trip_stops_and_itinerary_workflow(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City
    from backend.models.activity import Activity

    headers = get_auth_headers(client, "itinerary_user@example.com")

    # Setup DB mock data
    country = Country(name="Japan", iso_code="JP", iso3_code="JPN", region="Asia")
    db_session.add(country)
    db_session.flush()

    city = City(country_id=country.id, name="Tokyo", region="Kanto")
    city2 = City(country_id=country.id, name="Kyoto", region="Kansai")
    db_session.add_all([city, city2])
    db_session.flush()

    activity = Activity(city_id=city.id, name="Sensō-ji Temple", activity_type="cultural", estimated_cost=1000)
    activity_kyoto = Activity(city_id=city2.id, name="Fushimi Inari Shrine", activity_type="cultural", estimated_cost=500)
    db_session.add_all([activity, activity_kyoto])
    db_session.commit()

    # 1. Create Trip
    today = date.today()
    trip_res = client.post("/api/v1/trips", json={
        "name": "Japan Journey",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=5))
    }, headers=headers)
    trip_id = trip_res.json()["data"]["id"]

    # 2. Add Stop (Valid range)
    stop_res = client.post("/api/v1/trip-stops", json={
        "trip_id": trip_id,
        "city_id": str(city.id),
        "start_date": str(today),
        "end_date": str(today + timedelta(days=3)),
        "stop_order": 1,
        "notes": "First stop in Tokyo"
    }, headers=headers)
    assert stop_res.status_code == 201
    stop_id = stop_res.json()["data"]["id"]

    # 2b. Add Stop Out of Trip Range -> 400
    stop_out_of_range = client.post("/api/v1/trip-stops", json={
        "trip_id": trip_id,
        "city_id": str(city.id),
        "start_date": str(today + timedelta(days=10)),
        "end_date": str(today + timedelta(days=12)),
        "stop_order": 2
    }, headers=headers)
    assert stop_out_of_range.status_code == 400
    assert stop_out_of_range.json()["error"]["code"] == "STOP_DATES_OUT_OF_RANGE"

    # 3. Add Itinerary Item (Valid)
    item_res = client.post("/api/v1/itinerary", json={
        "trip_stop_id": stop_id,
        "activity_id": str(activity.id),
        "scheduled_date": str(today),
        "start_time": "09:00:00",
        "end_time": "11:00:00",
        "item_order": 1,
        "notes": "Visit early morning"
    }, headers=headers)
    assert item_res.status_code == 201
    item_id = item_res.json()["data"]["id"]

    # 3b. Add Itinerary Item with City Mismatch -> 400
    mismatch_res = client.post("/api/v1/itinerary", json={
        "trip_stop_id": stop_id,
        "activity_id": str(activity_kyoto.id),
        "scheduled_date": str(today),
        "item_order": 2
    }, headers=headers)
    assert mismatch_res.status_code == 400
    assert mismatch_res.json()["error"]["code"] == "ACTIVITY_CITY_MISMATCH"

    # 4. Fetch Stop Itinerary
    itin_res = client.get(f"/api/v1/trip-stops/{stop_id}/itinerary", headers=headers)
    assert itin_res.status_code == 200
    items = itin_res.json()["data"]
    assert len(items) == 1
    assert items[0]["id"] == item_id

    # 5. Delete Itinerary Item
    del_item_res = client.delete(f"/api/v1/itinerary/{item_id}", headers=headers)
    assert del_item_res.status_code == 200

    # 6. Delete Stop
    del_stop_res = client.delete(f"/api/v1/trip-stops/{stop_id}", headers=headers)
    assert del_stop_res.status_code == 200
