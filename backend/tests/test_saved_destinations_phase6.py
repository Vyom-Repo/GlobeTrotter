import pytest
from uuid import uuid4

def get_auth_headers(client, email="saved_phase6@example.com", password="Password123!"):
    client.post("/api/v1/auth/register", json={
        "name": "Phase 6 User",
        "email": email,
        "password": password
    })
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    token = res.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

# --- SAVED DESTINATIONS & FAVORITES PHASE 6 TESTS ---

def test_anonymous_access_rejected(client):
    # 1. Anonymous user cannot save
    res1 = client.post("/api/v1/saved-destinations", json={"entity_type": "city", "entity_id": str(uuid4())})
    assert res1.status_code == 401

    # 2. Anonymous user cannot list
    res2 = client.get("/api/v1/saved-destinations")
    assert res2.status_code == 401

    # 3. Anonymous user cannot delete
    res3 = client.delete(f"/api/v1/saved-destinations/{uuid4()}")
    assert res3.status_code == 401

def test_save_country_city_and_activity(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City
    from backend.models.activity import Activity

    headers = get_auth_headers(client, "saver_user@example.com")

    # Setup database objects
    country = Country(name="Portugal", iso_code="PT", iso3_code="PRT", region="Europe")
    db_session.add(country)
    db_session.flush()

    city = City(country_id=country.id, name="Lisbon", region="Lisbon")
    db_session.add(city)
    db_session.flush()

    activity = Activity(city_id=city.id, name="Belém Tower", activity_type="sightseeing", estimated_cost=15)
    db_session.add(activity)
    db_session.commit()

    # 4. Authenticated user can save a country
    save_country = client.post("/api/v1/saved-destinations", json={
        "entity_type": "country", "entity_id": str(country.id)
    }, headers=headers)
    assert save_country.status_code == 201
    c_data = save_country.json()["data"]
    assert c_data["entity_type"] == "country"
    assert c_data["name"] == "Portugal"

    # 5. Authenticated user can save a city
    save_city = client.post("/api/v1/saved-destinations", json={
        "entity_type": "city", "entity_id": str(city.id)
    }, headers=headers)
    assert save_city.status_code == 201
    city_saved_id = save_city.json()["data"]["id"]

    # 6. Authenticated user can save an activity
    save_act = client.post("/api/v1/saved-destinations", json={
        "entity_type": "activity", "entity_id": str(activity.id)
    }, headers=headers)
    assert save_act.status_code == 201
    assert save_act.json()["data"]["name"] == "Belém Tower"

    # 7. Invalid entity type is rejected -> 422
    inv_type = client.post("/api/v1/saved-destinations", json={
        "entity_type": "invalid_type", "entity_id": str(city.id)
    }, headers=headers)
    assert inv_type.status_code == 422

    # 8. Non-existent entity ID is rejected -> 404
    non_exist = client.post("/api/v1/saved-destinations", json={
        "entity_type": "city", "entity_id": str(uuid4())
    }, headers=headers)
    assert non_exist.status_code == 404

    # 9. Duplicate save is prevented -> 400
    dup_res = client.post("/api/v1/saved-destinations", json={
        "entity_type": "city", "entity_id": str(city.id)
    }, headers=headers)
    assert dup_res.status_code == 400
    assert dup_res.json()["error"]["code"] == "DESTINATION_ALREADY_SAVED"

    # 20. Saved-state check returns correct state
    chk_true = client.get(f"/api/v1/saved-destinations/check?entity_type=city&entity_id={city.id}", headers=headers)
    assert chk_true.status_code == 200
    assert chk_true.json()["data"]["saved"] is True
    assert chk_true.json()["data"]["saved_id"] == city_saved_id

    chk_false = client.get(f"/api/v1/saved-destinations/check?entity_type=city&entity_id={uuid4()}", headers=headers)
    assert chk_false.status_code == 200
    assert chk_false.json()["data"]["saved"] is False

def test_listing_filtering_and_pagination(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City

    headers = get_auth_headers(client, "list_saver@example.com")

    country = Country(name="Norway", iso_code="NO", iso3_code="NOR", region="Europe")
    db_session.add(country)
    db_session.flush()

    city1 = City(country_id=country.id, name="Oslo", region="Oslo")
    city2 = City(country_id=country.id, name="Bergen", region="Vestland")
    db_session.add_all([city1, city2])
    db_session.commit()

    client.post("/api/v1/saved-destinations", json={"entity_type": "country", "entity_id": str(country.id)}, headers=headers)
    client.post("/api/v1/saved-destinations", json={"entity_type": "city", "entity_id": str(city1.id)}, headers=headers)
    client.post("/api/v1/saved-destinations", json={"entity_type": "city", "entity_id": str(city2.id)}, headers=headers)

    # 10. User can list saved items
    list_all = client.get("/api/v1/saved-destinations", headers=headers)
    assert list_all.status_code == 200
    assert len(list_all.json()["data"]) == 3

    # 12. Pagination
    page_res = client.get("/api/v1/saved-destinations?page=1&page_size=2", headers=headers)
    assert page_res.status_code == 200
    assert len(page_res.json()["data"]) == 2
    assert page_res.json()["pagination"]["total"] == 3

    # 13. Entity type filtering
    countries_only = client.get("/api/v1/saved-destinations?entity_type=country", headers=headers)
    assert countries_only.status_code == 200
    assert len(countries_only.json()["data"]) == 1

    # 14. Search filtering
    search_res = client.get("/api/v1/saved-destinations?search=Bergen", headers=headers)
    assert search_res.status_code == 200
    assert len(search_res.json()["data"]) == 1

def test_ownership_authorization_and_deletion(client, db_session):
    from backend.models.country import Country
    from backend.models.city import City

    headers_user_a = get_auth_headers(client, "user_a_save@example.com")
    headers_user_b = get_auth_headers(client, "user_b_save@example.com")

    country = Country(name="Sweden", iso_code="SE", iso3_code="SWE", region="Europe")
    db_session.add(country)
    db_session.flush()

    city = City(country_id=country.id, name="Stockholm", region="Stockholm")
    db_session.add(city)
    db_session.commit()

    # User A saves Stockholm
    save_a = client.post("/api/v1/saved-destinations", json={"entity_type": "city", "entity_id": str(city.id)}, headers=headers_user_a)
    saved_id_a = save_a.json()["data"]["id"]

    # 11. User B only sees their own saved items (User B list is empty)
    list_b = client.get("/api/v1/saved-destinations", headers=headers_user_b)
    assert list_b.status_code == 200
    assert len(list_b.json()["data"]) == 0

    # 16. User B cannot get User A's saved item -> 404
    get_b = client.get(f"/api/v1/saved-destinations/{saved_id_a}", headers=headers_user_b)
    assert get_b.status_code == 404

    # 17. User B cannot delete User A's saved item -> 404
    del_b = client.delete(f"/api/v1/saved-destinations/{saved_id_a}", headers=headers_user_b)
    assert del_b.status_code == 404

    # 18. User A can delete saved item -> 200
    del_a = client.delete(f"/api/v1/saved-destinations/{saved_id_a}", headers=headers_user_a)
    assert del_a.status_code == 200

    # 19. Deleted item no longer appears in listing
    list_a_after = client.get("/api/v1/saved-destinations", headers=headers_user_a)
    assert list_a_after.status_code == 200
    assert len(list_a_after.json()["data"]) == 0
