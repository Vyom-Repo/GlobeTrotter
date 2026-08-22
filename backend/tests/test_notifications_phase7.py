from datetime import date, timedelta
from decimal import Decimal
import pytest

from backend.models.user import User
from backend.models.country import Country
from backend.models.city import City
from backend.models.trip import Trip, TripVisibility
from backend.models.trip_stop import TripStop
from backend.models.itinerary_item import ItineraryItem
from backend.models.expense import Expense, ExpenseCategory
from backend.models.notification import Notification, NotificationType
from backend.services.auth_service import AuthService
from backend.services.notification_service import NotificationService
from backend.services.reminder_service import ReminderService
from backend.schemas.user import UserCreate
from backend.schemas.expense import ExpenseCreate

@pytest.fixture
def auth_user_a(db_session):
    user_in = UserCreate(name="User A", email="user_a@example.com", password="Password123!")
    user, token = AuthService.register_user(db_session, user_in)
    return user, token

@pytest.fixture
def auth_user_b(db_session):
    user_in = UserCreate(name="User B", email="user_b@example.com", password="Password123!")
    user, token = AuthService.register_user(db_session, user_in)
    return user, token

def test_unauthenticated_notification_access_rejected(client):
    res = client.get("/api/v1/notifications")
    assert res.status_code == 401
    assert res.json()["success"] is False

def test_notification_crud_operations(client, db_session, auth_user_a):
    user, token = auth_user_a
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create notifications for User A
    n1 = NotificationService.create_notification(
        db=db_session,
        user_id=user.id,
        type=NotificationType.SYSTEM,
        title="Welcome to GlobeTrotter",
        message="Your account is ready for trip planning."
    )
    n2 = NotificationService.create_notification(
        db=db_session,
        user_id=user.id,
        type=NotificationType.TRIP_REMINDER,
        title="Upcoming Trip",
        message="Paris trip starts tomorrow!"
    )

    # 2. Get list of notifications
    res = client.get("/api/v1/notifications", headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data["items"]) == 2
    assert data["unread_count"] == 2

    # 3. Filter by type
    res_filtered = client.get("/api/v1/notifications?type=trip_reminder", headers=headers)
    assert res_filtered.status_code == 200
    assert len(res_filtered.json()["data"]["items"]) == 1
    assert res_filtered.json()["data"]["items"][0]["type"] == "trip_reminder"

    # 4. Get unread count endpoint
    res_unread = client.get("/api/v1/notifications/unread-count", headers=headers)
    assert res_unread.status_code == 200
    assert res_unread.json()["data"]["unread_count"] == 2

    # 5. Mark n1 as read
    res_read = client.patch(f"/api/v1/notifications/{n1.id}/read", headers=headers)
    assert res_read.status_code == 200
    assert res_read.json()["data"]["is_read"] is True

    # Check unread count is now 1
    res_unread2 = client.get("/api/v1/notifications/unread-count", headers=headers)
    assert res_unread2.json()["data"]["unread_count"] == 1

    # 6. Mark all as read
    res_read_all = client.patch("/api/v1/notifications/read-all", headers=headers)
    assert res_read_all.status_code == 200
    assert res_read_all.json()["data"]["updated_count"] == 1

    res_unread3 = client.get("/api/v1/notifications/unread-count", headers=headers)
    assert res_unread3.json()["data"]["unread_count"] == 0

    # 7. Delete n2
    res_del = client.delete(f"/api/v1/notifications/{n2.id}", headers=headers)
    assert res_del.status_code == 204

    # Verify n2 is deleted
    res_get_del = client.get(f"/api/v1/notifications/{n2.id}", headers=headers)
    assert res_get_del.status_code == 404

def test_notification_user_authorization(client, db_session, auth_user_a, auth_user_b):
    user_a, token_a = auth_user_a
    user_b, token_b = auth_user_b
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # Create notification for User A
    notif_a = NotificationService.create_notification(
        db=db_session,
        user_id=user_a.id,
        type=NotificationType.SYSTEM,
        title="Private Notification for A",
        message="User B must not see this."
    )

    # User B tries to read User A's notification -> 404
    res_get = client.get(f"/api/v1/notifications/{notif_a.id}", headers=headers_b)
    assert res_get.status_code == 404

    # User B tries to mark User A's notification as read -> 404
    res_read = client.patch(f"/api/v1/notifications/{notif_a.id}/read", headers=headers_b)
    assert res_read.status_code == 404

    # User B tries to delete User A's notification -> 404
    res_del = client.delete(f"/api/v1/notifications/{notif_a.id}", headers=headers_b)
    assert res_del.status_code == 404

def test_trip_reminder_generation_and_deduplication(db_session, auth_user_a):
    user, _ = auth_user_a
    today = date.today()

    # Create an upcoming trip starting in 2 days
    trip = Trip(
        user_id=user.id,
        name="Euro Trip 2026",
        start_date=today + timedelta(days=2),
        end_date=today + timedelta(days=10),
        visibility=TripVisibility.PRIVATE,
        currency="USD"
    )
    db_session.add(trip)
    db_session.commit()
    db_session.refresh(trip)

    # Generate reminders
    reminders = ReminderService.generate_trip_reminders(db_session, user_id=user.id)
    assert len(reminders) == 1
    assert reminders[0].type == NotificationType.TRIP_REMINDER
    assert reminders[0].related_entity_id == trip.id

    # Run reminder generation AGAIN -> duplicate should be prevented
    reminders_2 = ReminderService.generate_trip_reminders(db_session, user_id=user.id)
    assert len(reminders_2) == 0

    # Verify total notifications in DB is still 1
    total_notifs = db_session.query(Notification).filter(Notification.user_id == user.id).count()
    assert total_notifs == 1

def test_budget_warning_notifications(db_session, auth_user_a):
    user, _ = auth_user_a
    today = date.today()

    # Create trip with budget limit 1000.00
    trip = Trip(
        user_id=user.id,
        name="Budget Test Trip",
        start_date=today,
        end_date=today + timedelta(days=5),
        budget_limit=Decimal("1000.00"),
        currency="USD",
        visibility=TripVisibility.PRIVATE
    )
    db_session.add(trip)
    db_session.commit()
    db_session.refresh(trip)

    # 1. Log expense 500 (50%) -> no budget warning yet
    exp1 = Expense(
        trip_id=trip.id,
        category=ExpenseCategory.TRANSPORT,
        description="Flight tickets",
        amount=Decimal("500.00"),
        currency="USD"
    )
    db_session.add(exp1)
    db_session.commit()

    ReminderService.check_budget_warnings(db_session, trip.id)
    notifs_50 = db_session.query(Notification).filter(Notification.user_id == user.id).all()
    assert len(notifs_50) == 0

    # 2. Log expense 350 (Total 850 / 85%) -> triggers 80% warning
    exp2 = Expense(
        trip_id=trip.id,
        category=ExpenseCategory.ACCOMMODATION,
        description="Hotel booking",
        amount=Decimal("350.00"),
        currency="USD"
    )
    db_session.add(exp2)
    db_session.commit()

    ReminderService.check_budget_warnings(db_session, trip.id)
    notifs_85 = db_session.query(Notification).filter(Notification.user_id == user.id).all()
    assert len(notifs_85) == 1
    assert notifs_85[0].type == NotificationType.BUDGET_WARNING
    assert "80% Reached" in notifs_85[0].title

    # 3. Trigger check again -> duplicate warning prevented
    ReminderService.check_budget_warnings(db_session, trip.id)
    notifs_repeat = db_session.query(Notification).filter(Notification.user_id == user.id).all()
    assert len(notifs_repeat) == 1
