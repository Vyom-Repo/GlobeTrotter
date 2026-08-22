import pytest
from datetime import date, timedelta
from backend.models.user import User
from backend.models.trip import Trip, TripVisibility
from backend.models.expense import Expense, ExpenseCategory
from backend.services.auth_service import AuthService
from backend.schemas.user import UserCreate

@pytest.fixture
def horizontal_privilege_users(db_session):
    # User A
    user_a_in = UserCreate(name="User A", email="usera@example.com", password="Password123!")
    user_a, token_a = AuthService.register_user(db_session, user_a_in)

    # User B
    user_b_in = UserCreate(name="User B", email="userb@example.com", password="Password123!")
    user_b, token_b = AuthService.register_user(db_session, user_b_in)

    # User A's private trip
    trip_a = Trip(
        user_id=user_a.id,
        name="User A Private Escape",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=3),
        visibility=TripVisibility.PRIVATE
    )
    db_session.add(trip_a)
    db_session.commit()
    db_session.refresh(trip_a)

    return {
        "user_a": user_a,
        "token_a": token_a,
        "user_b": user_b,
        "token_b": token_b,
        "trip_a": trip_a
    }

def test_horizontal_privilege_escalation_blocked(client, horizontal_privilege_users):
    headers_b = {"Authorization": f"Bearer {horizontal_privilege_users['token_b']}"}
    trip_a_id = horizontal_privilege_users["trip_a"].id

    # User B attempts to GET User A's private trip -> 404 / 403
    res_get = client.get(f"/api/v1/trips/{trip_a_id}", headers=headers_b)
    assert res_get.status_code in (403, 404)

    # User B attempts to UPDATE User A's private trip -> 404 / 403
    res_put = client.put(f"/api/v1/trips/{trip_a_id}", json={"name": "Hacked Title"}, headers=headers_b)
    assert res_put.status_code in (403, 404)

    # User B attempts to DELETE User A's private trip -> 404 / 403
    res_del = client.delete(f"/api/v1/trips/{trip_a_id}", headers=headers_b)
    assert res_del.status_code in (403, 404)

def test_invalid_uuid_input_handling(client, horizontal_privilege_users):
    headers_a = {"Authorization": f"Bearer {horizontal_privilege_users['token_a']}"}

    # Invalid UUID parameter format
    res = client.get("/api/v1/trips/invalid-uuid-format", headers=headers_a)
    assert res.status_code in (400, 422)

def test_data_privacy_no_password_hashes_leaked(client, horizontal_privilege_users):
    headers_a = {"Authorization": f"Bearer {horizontal_privilege_users['token_a']}"}

    res = client.get("/api/v1/users/me", headers=headers_a)
    assert res.status_code == 200
    res_str = res.text.lower()
    assert "password_hash" not in res_str
    assert "secret" not in res_str
