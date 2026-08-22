import pytest
from datetime import date, timedelta
from decimal import Decimal
from uuid import uuid4

def get_auth_headers(client, email="budget_user@example.com", password="Password123!"):
    client.post("/api/v1/auth/register", json={
        "name": "Budget User",
        "email": email,
        "password": password
    })
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    token = res.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

# --- EXPENSE & BUDGET PHASE 4 TESTS ---

def test_create_expense_authenticated(client):
    headers = get_auth_headers(client, "user_exp1@example.com")
    today = date.today()

    trip_res = client.post("/api/v1/trips", json={
        "name": "Paris Vacation",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=5)),
        "currency": "EUR"
    }, headers=headers)
    trip_id = trip_res.json()["data"]["id"]

    exp_res = client.post("/api/v1/expenses", json={
        "trip_id": trip_id,
        "category": "transport",
        "description": "Flight to Paris",
        "amount": 450.00,
        "currency": "EUR",
        "expense_date": str(today)
    }, headers=headers)
    assert exp_res.status_code == 201
    data = exp_res.json()["data"]
    assert data["description"] == "Flight to Paris"
    assert data["category"] == "transport"
    assert float(data["amount"]) == 450.00

def test_unauthenticated_create_expense_rejected(client):
    res = client.post("/api/v1/expenses", json={
        "trip_id": str(uuid4()),
        "category": "meals",
        "description": "Lunch",
        "amount": 25.00,
        "currency": "USD"
    })
    assert res.status_code == 401

def test_get_own_and_other_user_expense_authorization(client):
    headers_owner = get_auth_headers(client, "exp_owner@example.com")
    headers_other = get_auth_headers(client, "exp_other@example.com")
    today = date.today()

    trip_res = client.post("/api/v1/trips", json={
        "name": "Owner Trip",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=3)),
        "visibility": "private",
        "currency": "USD"
    }, headers=headers_owner)
    trip_id = trip_res.json()["data"]["id"]

    exp_res = client.post("/api/v1/expenses", json={
        "trip_id": trip_id,
        "category": "accommodation",
        "description": "Hotel Stay",
        "amount": 300.00,
        "currency": "USD"
    }, headers=headers_owner)
    exp_id = exp_res.json()["data"]["id"]

    # Owner can get
    owner_get = client.get(f"/api/v1/expenses/{exp_id}", headers=headers_owner)
    assert owner_get.status_code == 200

    # Other user cannot get private expense -> 403
    other_get = client.get(f"/api/v1/expenses/{exp_id}", headers=headers_other)
    assert other_get.status_code == 403

    # Other user cannot update -> 403
    other_put = client.put(f"/api/v1/expenses/{exp_id}", json={"amount": 999.00}, headers=headers_other)
    assert other_put.status_code == 403

    # Other user cannot delete -> 403
    other_del = client.delete(f"/api/v1/expenses/{exp_id}", headers=headers_other)
    assert other_del.status_code == 403

    # Owner update -> 200
    owner_put = client.put(f"/api/v1/expenses/{exp_id}", json={"amount": 350.00}, headers=headers_owner)
    assert owner_put.status_code == 200
    assert float(owner_put.json()["data"]["amount"]) == 350.00

    # Owner delete -> 200
    owner_del = client.delete(f"/api/v1/expenses/{exp_id}", headers=headers_owner)
    assert owner_del.status_code == 200

def test_invalid_negative_or_zero_amount_rejected(client):
    headers = get_auth_headers(client, "negexp@example.com")
    today = date.today()

    trip_res = client.post("/api/v1/trips", json={
        "name": "Trip", "start_date": str(today), "end_date": str(today + timedelta(days=1)), "currency": "USD"
    }, headers=headers)
    trip_id = trip_res.json()["data"]["id"]

    # Zero amount -> 400
    res_zero = client.post("/api/v1/expenses", json={
        "trip_id": trip_id, "category": "meals", "amount": 0.00, "currency": "USD"
    }, headers=headers)
    assert res_zero.status_code == 400

    # Negative amount -> 400
    res_neg = client.post("/api/v1/expenses", json={
        "trip_id": trip_id, "category": "meals", "amount": -50.00, "currency": "USD"
    }, headers=headers)
    assert res_neg.status_code == 400

def test_invalid_category_rejected(client):
    headers = get_auth_headers(client, "invcat@example.com")
    today = date.today()

    trip_res = client.post("/api/v1/trips", json={
        "name": "Trip", "start_date": str(today), "end_date": str(today + timedelta(days=1)), "currency": "USD"
    }, headers=headers)
    trip_id = trip_res.json()["data"]["id"]

    res = client.post("/api/v1/expenses", json={
        "trip_id": trip_id, "category": "invalid_category_name", "amount": 50.00, "currency": "USD"
    }, headers=headers)
    assert res.status_code == 422

def test_invalid_trip_reference_rejected(client):
    headers = get_auth_headers(client, "invtrip@example.com")
    res = client.post("/api/v1/expenses", json={
        "trip_id": str(uuid4()), "category": "meals", "amount": 50.00, "currency": "USD"
    }, headers=headers)
    assert res.status_code == 404

def test_cross_trip_stop_and_itinerary_references_rejected(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City
    from backend.models.activity import Activity

    headers = get_auth_headers(client, "crosstrip@example.com")

    # Setup cities
    country = Country(name="Spain", iso_code="ES", iso3_code="ESP", region="Europe")
    db_session.add(country)
    db_session.flush()
    city1 = City(country_id=country.id, name="Madrid", region="Madrid")
    city2 = City(country_id=country.id, name="Barcelona", region="Catalonia")
    db_session.add_all([city1, city2])
    db_session.flush()

    activity = Activity(city_id=city2.id, name="Sagrada Família", activity_type="sightseeing", estimated_cost=30)
    db_session.add(activity)
    db_session.commit()

    today = date.today()
    # Trip A
    trip_a = client.post("/api/v1/trips", json={
        "name": "Trip A", "start_date": str(today), "end_date": str(today + timedelta(days=5)), "currency": "EUR"
    }, headers=headers).json()["data"]["id"]

    # Trip B
    trip_b = client.post("/api/v1/trips", json={
        "name": "Trip B", "start_date": str(today), "end_date": str(today + timedelta(days=5)), "currency": "EUR"
    }, headers=headers).json()["data"]["id"]

    # Stop B on Trip B
    stop_b = client.post("/api/v1/trip-stops", json={
        "trip_id": trip_b, "city_id": str(city2.id), "start_date": str(today), "end_date": str(today + timedelta(days=2)), "stop_order": 1
    }, headers=headers).json()["data"]["id"]

    # Itinerary Item B on Stop B
    item_b = client.post("/api/v1/itinerary", json={
        "trip_stop_id": stop_b, "activity_id": str(activity.id), "scheduled_date": str(today), "item_order": 1
    }, headers=headers).json()["data"]["id"]

    # Try attaching Stop B (Trip B) to an expense on Trip A -> 400
    cross_stop = client.post("/api/v1/expenses", json={
        "trip_id": trip_a, "trip_stop_id": stop_b, "category": "activities", "amount": 30.00, "currency": "EUR"
    }, headers=headers)
    assert cross_stop.status_code == 400
    assert cross_stop.json()["error"]["code"] == "STOP_TRIP_MISMATCH"

    # Try attaching Item B (Trip B) to an expense on Trip A -> 400
    cross_item = client.post("/api/v1/expenses", json={
        "trip_id": trip_a, "itinerary_item_id": item_b, "category": "activities", "amount": 30.00, "currency": "EUR"
    }, headers=headers)
    assert cross_item.status_code == 400
    assert cross_item.json()["error"]["code"] == "ITINERARY_TRIP_MISMATCH"

def test_stop_level_itinerary_level_and_trip_level_expenses(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City
    from backend.models.activity import Activity

    headers = get_auth_headers(client, "levelsexp@example.com")

    country = Country(name="Italy", iso_code="IT", iso3_code="ITA", region="Europe")
    db_session.add(country)
    db_session.flush()
    city = City(country_id=country.id, name="Rome", region="Lazio")
    db_session.add(city)
    db_session.flush()
    activity = Activity(city_id=city.id, name="Colosseum", activity_type="historical", estimated_cost=25)
    db_session.add(activity)
    db_session.commit()

    today = date.today()
    trip_id = client.post("/api/v1/trips", json={
        "name": "Rome Adventure", "start_date": str(today), "end_date": str(today + timedelta(days=5)), "currency": "EUR"
    }, headers=headers).json()["data"]["id"]

    stop_id = client.post("/api/v1/trip-stops", json={
        "trip_id": trip_id, "city_id": str(city.id), "start_date": str(today), "end_date": str(today + timedelta(days=3)), "stop_order": 1
    }, headers=headers).json()["data"]["id"]

    item_id = client.post("/api/v1/itinerary", json={
        "trip_stop_id": stop_id, "activity_id": str(activity.id), "scheduled_date": str(today), "item_order": 1
    }, headers=headers).json()["data"]["id"]

    # 1. Trip-level expense
    exp1 = client.post("/api/v1/expenses", json={
        "trip_id": trip_id, "category": "other", "description": "Travel Insurance", "amount": 50.00, "currency": "EUR"
    }, headers=headers)
    assert exp1.status_code == 201

    # 2. Stop-level expense
    exp2 = client.post("/api/v1/expenses", json={
        "trip_id": trip_id, "trip_stop_id": stop_id, "category": "accommodation", "description": "Hotel Rome", "amount": 200.00, "currency": "EUR"
    }, headers=headers)
    assert exp2.status_code == 201

    # 3. Itinerary-level expense
    exp3 = client.post("/api/v1/expenses", json={
        "trip_id": trip_id, "itinerary_item_id": item_id, "category": "activities", "description": "Colosseum Entry", "amount": 25.00, "currency": "EUR"
    }, headers=headers)
    assert exp3.status_code == 201

def test_budget_summary_and_aggregation_calculations(client):
    headers = get_auth_headers(client, "budgetcalc@example.com")
    today = date.today()

    trip_res = client.post("/api/v1/trips", json={
        "name": "Budget Calc Trip",
        "start_date": str(today),
        "end_date": str(today + timedelta(days=4)),
        "budget_limit": 1000.00,
        "currency": "USD"
    }, headers=headers)
    trip_id = trip_res.json()["data"]["id"]

    # Add expenses across categories
    client.post("/api/v1/expenses", json={"trip_id": trip_id, "category": "transport", "amount": 200.00, "currency": "USD"}, headers=headers)
    client.post("/api/v1/expenses", json={"trip_id": trip_id, "category": "accommodation", "amount": 300.00, "currency": "USD"}, headers=headers)
    client.post("/api/v1/expenses", json={"trip_id": trip_id, "category": "activities", "amount": 100.00, "currency": "USD"}, headers=headers)
    client.post("/api/v1/expenses", json={"trip_id": trip_id, "category": "meals", "amount": 50.00, "currency": "USD"}, headers=headers)

    # Fetch budget summary via /api/v1/trips/{trip_id}/budget
    summary_res = client.get(f"/api/v1/trips/{trip_id}/budget", headers=headers)
    assert summary_res.status_code == 200
    summary = summary_res.json()["data"]

    assert float(summary["budget_limit"]) == 1000.00
    assert float(summary["total_spent"]) == 650.00
    assert float(summary["remaining_budget"]) == 350.00
    assert summary["utilization_percentage"] == 65.0
    assert float(summary["category_breakdown"]["transport"]) == 200.00
    assert float(summary["category_breakdown"]["accommodation"]) == 300.00
    assert float(summary["category_breakdown"]["activities"]) == 100.00
    assert float(summary["category_breakdown"]["meals"]) == 50.00
    assert float(summary["category_breakdown"]["other"]) == 0.00

def test_zero_or_null_budget_limit_handled_safely(client):
    headers = get_auth_headers(client, "nullbudget@example.com")
    today = date.today()

    # Trip with no budget limit (None)
    trip_res = client.post("/api/v1/trips", json={
        "name": "No Limit Trip", "start_date": str(today), "end_date": str(today + timedelta(days=2)), "currency": "USD"
    }, headers=headers)
    trip_id = trip_res.json()["data"]["id"]

    client.post("/api/v1/expenses", json={"trip_id": trip_id, "category": "meals", "amount": 75.00, "currency": "USD"}, headers=headers)

    summary_res = client.get(f"/api/v1/trips/{trip_id}/budget", headers=headers)
    assert summary_res.status_code == 200
    summary = summary_res.json()["data"]

    assert summary["budget_limit"] is None
    assert float(summary["total_spent"]) == 75.00
    assert summary["remaining_budget"] is None
    assert summary["utilization_percentage"] is None
