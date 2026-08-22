from datetime import date, timedelta
from decimal import Decimal
import pytest

from backend.models.user import User
from backend.models.country import Country
from backend.models.city import City
from backend.models.activity import Activity
from backend.models.trip import Trip, TripVisibility
from backend.models.saved_destination import SavedDestination
from backend.services.auth_service import AuthService
from backend.schemas.user import UserCreate

@pytest.fixture
def test_data(db_session):
    # 1. Create User
    user_in = UserCreate(name="Search Tester", email="searcher@example.com", password="Password123!")
    user, token = AuthService.register_user(db_session, user_in)

    # 2. Create Country
    country = Country(name="Japan", iso_code="JP", iso3_code="JPN", region="Asia")
    db_session.add(country)
    db_session.commit()
    db_session.refresh(country)

    # 3. Create City
    city = City(
        country_id=country.id,
        name="Tokyo",
        region="Kanto",
        description="Vibrant metropolis combining traditional culture and futuristic tech.",
        popularity_score=Decimal("95.0")
    )
    db_session.add(city)
    db_session.commit()
    db_session.refresh(city)

    # 4. Create Activity
    activity = Activity(
        city_id=city.id,
        name="Senso-ji Temple Tour",
        description="Historical Buddhist temple in Asakusa.",
        activity_type="cultural",
        estimated_cost=Decimal("500.00"),
        currency="INR",
        popularity_score=Decimal("90.0")
    )
    db_session.add(activity)
    db_session.commit()
    db_session.refresh(activity)

    # 5. Create Public Trip
    public_trip = Trip(
        user_id=user.id,
        name="Discovering Tokyo",
        description="An unforgettable exploration of Tokyo's top sights.",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=7),
        visibility=TripVisibility.PUBLIC,
        currency="INR"
    )
    # 6. Create Private Trip
    private_trip = Trip(
        user_id=user.id,
        name="Secret Private Escape",
        description="Private itinerary strictly confidential.",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=3),
        visibility=TripVisibility.PRIVATE,
        currency="INR"
    )
    db_session.add_all([public_trip, private_trip])
    db_session.commit()
    db_session.refresh(public_trip)
    db_session.refresh(private_trip)

    return {
        "user": user,
        "token": token,
        "country": country,
        "city": city,
        "activity": activity,
        "public_trip": public_trip,
        "private_trip": private_trip
    }

def test_unauthenticated_unified_search(client, test_data):
    # 1. Search without auth for "Tokyo"
    res = client.get("/api/v1/search?q=tokyo")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data["items"]) >= 1

    titles = [item["title"] for item in data["items"]]
    assert "Tokyo" in titles or "Discovering Tokyo" in titles

    # Verify private trip is EXCLUDED
    assert "Secret Private Escape" not in titles

def test_search_entity_type_filtering(client, test_data):
    # Search specifically for entity_type=city
    res_city = client.get("/api/v1/search?q=tokyo&entity_type=city")
    assert res_city.status_code == 200
    items = res_city.json()["data"]["items"]
    assert all(item["entity_type"] == "city" for item in items)
    assert any(item["title"] == "Tokyo" for item in items)

    # Search specifically for entity_type=activity
    res_act = client.get("/api/v1/search?q=senso&entity_type=activity")
    assert res_act.status_code == 200
    items_act = res_act.json()["data"]["items"]
    assert all(item["entity_type"] == "activity" for item in items_act)
    assert any("Senso-ji" in item["title"] for item in items_act)

def test_unauthenticated_recommendations_rejected(client):
    res = client.get("/api/v1/recommendations")
    assert res.status_code == 401
    assert res.json()["success"] is False

def test_authenticated_recommendations(client, db_session, test_data):
    user = test_data["user"]
    token = test_data["token"]
    city = test_data["city"]
    headers = {"Authorization": f"Bearer {token}"}

    # Bookmark Tokyo in saved destinations
    saved = SavedDestination(user_id=user.id, city_id=city.id, entity_type="city")
    db_session.add(saved)
    db_session.commit()

    res = client.get("/api/v1/recommendations?type=all", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert "items" in data
    assert len(data["items"]) >= 1
    assert data["items"][0]["score"] > 0
    assert len(data["items"][0]["match_reasons"]) > 0

def test_related_content_endpoints(client, test_data):
    city = test_data["city"]
    activity = test_data["activity"]
    public_trip = test_data["public_trip"]

    # 1. Related cities
    res_city = client.get(f"/api/v1/cities/{city.id}/related")
    assert res_city.status_code == 200
    assert isinstance(res_city.json()["data"], list)

    # 2. Related activities
    res_act = client.get(f"/api/v1/activities/{activity.id}/related")
    assert res_act.status_code == 200
    assert isinstance(res_act.json()["data"], list)

    # 3. Related trips
    res_trip = client.get(f"/api/v1/trips/{public_trip.id}/related")
    assert res_trip.status_code == 200
    assert isinstance(res_trip.json()["data"], list)
