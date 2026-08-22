import pytest
from datetime import date, timedelta
from backend.models.user import User
from backend.models.trip import Trip, TripVisibility
from backend.models.report import ReportStatus, ReportTargetType
from backend.services.auth_service import AuthService
from backend.schemas.user import UserCreate

@pytest.fixture
def admin_data(db_session):
    # 1. Create Regular User
    regular_in = UserCreate(name="Regular User", email="regular@example.com", password="Password123!")
    regular_user, regular_token = AuthService.register_user(db_session, regular_in)

    # 2. Create Admin User
    admin_in = UserCreate(name="System Admin", email="admin@example.com", password="Password123!")
    admin_user, admin_token = AuthService.register_user(db_session, admin_in)
    admin_user.is_admin = True
    db_session.commit()
    db_session.refresh(admin_user)

    # 3. Create Public Trip owned by regular user
    public_trip = Trip(
        user_id=regular_user.id,
        name="Community Public Trip",
        description="Public trip subject to moderation.",
        start_date=date.today(),
        end_date=date.today() + timedelta(days=5),
        visibility=TripVisibility.PUBLIC,
        currency="INR"
    )
    db_session.add(public_trip)
    db_session.commit()
    db_session.refresh(public_trip)

    return {
        "regular_user": regular_user,
        "regular_token": regular_token,
        "admin_user": admin_user,
        "admin_token": admin_token,
        "public_trip": public_trip
    }

def test_non_admin_forbidden_from_admin_endpoints(client, admin_data):
    headers = {"Authorization": f"Bearer {admin_data['regular_token']}"}

    res_users = client.get("/api/v1/admin/users", headers=headers)
    assert res_users.status_code == 403
    assert res_users.json()["error"]["code"] == "ADMIN_REQUIRED"

    res_stats = client.get("/api/v1/admin/stats", headers=headers)
    assert res_stats.status_code == 403

def test_admin_list_users_and_deactivate_reactivate(client, admin_data):
    admin_headers = {"Authorization": f"Bearer {admin_data['admin_token']}"}
    target_user = admin_data["regular_user"]

    # 1. List users
    res_list = client.get("/api/v1/admin/users?search=regular", headers=admin_headers)
    assert res_list.status_code == 200
    assert len(res_list.json()["data"]) >= 1

    # 2. Deactivate user
    res_deact = client.post(f"/api/v1/admin/users/{target_user.id}/deactivate", headers=admin_headers)
    assert res_deact.status_code == 200
    assert res_deact.json()["data"]["is_active"] is False

    # 3. Reactivate user
    res_react = client.post(f"/api/v1/admin/users/{target_user.id}/reactivate", headers=admin_headers)
    assert res_react.status_code == 200
    assert res_react.json()["data"]["is_active"] is True

def test_admin_trip_moderation(client, admin_data):
    admin_headers = {"Authorization": f"Bearer {admin_data['admin_token']}"}
    public_trip = admin_data["public_trip"]

    # 1. Unpublish trip
    res_unpub = client.post(f"/api/v1/admin/public-trips/{public_trip.id}/unpublish", headers=admin_headers)
    assert res_unpub.status_code == 200
    assert res_unpub.json()["data"]["visibility"] == "private"

    # 2. Publish trip
    res_pub = client.post(f"/api/v1/admin/public-trips/{public_trip.id}/publish", headers=admin_headers)
    assert res_pub.status_code == 200
    assert res_pub.json()["data"]["visibility"] == "public"

def test_report_lifecycle(client, admin_data):
    reg_headers = {"Authorization": f"Bearer {admin_data['regular_token']}"}
    admin_headers = {"Authorization": f"Bearer {admin_data['admin_token']}"}
    public_trip = admin_data["public_trip"]

    report_payload = {
        "target_type": "public_trip",
        "target_id": str(public_trip.id),
        "reason": "Inappropriate Content",
        "description": "This trip contains invalid description."
    }

    # 1. User submits report
    res_rep = client.post("/api/v1/reports", json=report_payload, headers=reg_headers)
    assert res_rep.status_code == 201
    report_id = res_rep.json()["data"]["id"]
    assert res_rep.json()["data"]["status"] == "pending"

    # 2. Duplicate report rejected
    res_dup = client.post("/api/v1/reports", json=report_payload, headers=reg_headers)
    assert res_dup.status_code == 400
    assert res_dup.json()["error"]["code"] == "DUPLICATE_REPORT"

    # 3. Admin lists reports
    res_list = client.get("/api/v1/admin/reports?status=pending", headers=admin_headers)
    assert res_list.status_code == 200
    assert len(res_list.json()["data"]) >= 1

    # 4. Admin resolves report
    res_res = client.post(
        f"/api/v1/admin/reports/{report_id}/resolve",
        json={"status": "resolved", "notes": "Reviewed and resolved."},
        headers=admin_headers
    )
    assert res_res.status_code == 200
    assert res_res.json()["data"]["status"] == "resolved"

def test_admin_stats(client, admin_data):
    admin_headers = {"Authorization": f"Bearer {admin_data['admin_token']}"}

    res_stats = client.get("/api/v1/admin/stats", headers=admin_headers)
    assert res_stats.status_code == 200
    data = res_stats.json()["data"]
    assert data["total_users"] >= 2
    assert data["total_trips"] >= 1
