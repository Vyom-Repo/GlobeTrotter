import logging
from datetime import date, datetime, timezone, timedelta
from typing import Optional, List
from uuid import UUID
from sqlalchemy.orm import Session

from backend.models.user import User
from backend.models.trip import Trip
from backend.models.trip_stop import TripStop
from backend.models.itinerary_item import ItineraryItem
from backend.models.expense import Expense
from backend.models.notification import Notification, NotificationType
from backend.models.user_activity import UserActivity
from backend.services.notification_service import NotificationService
from backend.services.budget_service import BudgetService

logger = logging.getLogger(__name__)

class ReminderService:
    @staticmethod
    def generate_trip_reminders(db: Session, user_id: Optional[UUID] = None) -> List[Notification]:
        """Inspect upcoming trips, stops, and scheduled itinerary items to generate due reminders without duplication."""
        reminders_created = []
        today = date.today()

        # 1. Trip Start Reminders (e.g. starting within next 7 days)
        trips_query = db.query(Trip).filter(Trip.start_date >= today, Trip.start_date <= today + timedelta(days=7))
        if user_id:
            trips_query = trips_query.filter(Trip.user_id == user_id)

        upcoming_trips = trips_query.all()
        for trip in upcoming_trips:
            days_until = (trip.start_date - today).days
            time_str = "today!" if days_until == 0 else f"in {days_until} day{'s' if days_until > 1 else ''}!"
            title = f"Upcoming Trip Reminder: {trip.name}"
            message = f"Your journey to '{trip.name}' starts {time_str} Get ready to explore!"

            notif, created = NotificationService.create_notification(
                db=db,
                user_id=trip.user_id,
                type=NotificationType.TRIP_REMINDER,
                title=title,
                message=message,
                related_entity_type="trip",
                related_entity_id=trip.id,
                payload={"start_date": str(trip.start_date), "days_until": days_until},
                return_tuple=True
            )
            if created and notif:
                reminders_created.append(notif)

        # 2. Destination Stop Reminders (e.g. starting within next 3 days)
        stops_query = (
            db.query(TripStop, Trip)
            .join(Trip, TripStop.trip_id == Trip.id)
            .filter(TripStop.start_date >= today, TripStop.start_date <= today + timedelta(days=3))
        )
        if user_id:
            stops_query = stops_query.filter(Trip.user_id == user_id)

        upcoming_stops = stops_query.all()
        for stop, trip in upcoming_stops:
            days_until = (stop.start_date - today).days
            time_str = "today" if days_until == 0 else f"in {days_until} day(s)"
            city_name = stop.city.name if hasattr(stop, 'city') and stop.city else "your destination"
            title = f"Destination Stop Starting Soon: {city_name}"
            message = f"Your stop at {city_name} on trip '{trip.name}' begins {time_str} ({stop.start_date})."

            notif, created = NotificationService.create_notification(
                db=db,
                user_id=trip.user_id,
                type=NotificationType.TRIP_REMINDER,
                title=title,
                message=message,
                related_entity_type="trip_stop",
                related_entity_id=stop.id,
                payload={"city_name": city_name, "start_date": str(stop.start_date)},
                return_tuple=True
            )
            if created and notif:
                reminders_created.append(notif)

        # 3. Scheduled Itinerary Activity Reminders (e.g. scheduled today or tomorrow)
        items_query = (
            db.query(ItineraryItem, TripStop, Trip)
            .join(TripStop, ItineraryItem.trip_stop_id == TripStop.id)
            .join(Trip, TripStop.trip_id == Trip.id)
            .filter(ItineraryItem.scheduled_date >= today, ItineraryItem.scheduled_date <= today + timedelta(days=1))
        )
        if user_id:
            items_query = items_query.filter(Trip.user_id == user_id)

        upcoming_items = items_query.all()
        for item, stop, trip in upcoming_items:
            activity_name = item.activity.name if hasattr(item, 'activity') and item.activity else "Scheduled Activity"
            time_info = f" at {item.start_time.strftime('%H:%M')}" if item.start_time else ""
            title = f"Activity Reminder: {activity_name}"
            message = f"Reminder for '{activity_name}' scheduled on {item.scheduled_date}{time_info} during your trip '{trip.name}'."

            notif, created = NotificationService.create_notification(
                db=db,
                user_id=trip.user_id,
                type=NotificationType.ITINERARY_REMINDER,
                title=title,
                message=message,
                related_entity_type="itinerary_item",
                related_entity_id=item.id,
                payload={"scheduled_date": str(item.scheduled_date)},
                return_tuple=True
            )
            if created and notif:
                reminders_created.append(notif)

        return reminders_created

    @staticmethod
    def check_budget_warnings(db: Session, trip_id: UUID) -> Optional[Notification]:
        """Check budget limit for a trip and issue 80% warning or 100% exceeded notification."""
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip or not trip.budget_limit or float(trip.budget_limit) <= 0:
            return None

        trip_owner = db.query(User).filter(User.id == trip.user_id).first()
        budget_summary = BudgetService.get_trip_budget_summary(db, trip_id, user=trip_owner)
        pct = budget_summary.utilization_percentage if budget_summary.utilization_percentage is not None else 0.0
        budget_limit = float(trip.budget_limit)
        total_spent = float(budget_summary.total_spent)

        if pct >= 100.0:
            title = f"Budget Exceeded Alert: {trip.name}"
            message = f"You have exceeded your target budget limit of {trip.currency} {budget_limit:,.2f}! Current spending: {trip.currency} {total_spent:,.2f} ({pct:.1f}%)."
            return NotificationService.create_notification(
                db=db,
                user_id=trip.user_id,
                type=NotificationType.BUDGET_WARNING,
                title=title,
                message=message,
                related_entity_type="trip_budget_exceeded",
                related_entity_id=trip.id,
                payload={"percentage_used": pct, "total_spent": total_spent, "budget_limit": budget_limit}
            )
        elif pct >= 80.0:
            title = f"Budget Warning (80% Reached): {trip.name}"
            message = f"You have used {pct:.1f}% of your budget for '{trip.name}'. Total spent: {trip.currency} {total_spent:,.2f} of {trip.currency} {budget_limit:,.2f}."
            return NotificationService.create_notification(
                db=db,
                user_id=trip.user_id,
                type=NotificationType.BUDGET_WARNING,
                title=title,
                message=message,
                related_entity_type="trip_budget_warning",
                related_entity_id=trip.id,
                payload={"percentage_used": pct, "total_spent": total_spent, "budget_limit": budget_limit}
            )

        return None

    @staticmethod
    def log_user_activity(
        db: Session,
        user_id: UUID,
        activity_type: str,
        description: str,
        entity_type: Optional[str] = None,
        entity_id: Optional[UUID] = None,
        metadata_payload: Optional[dict] = None
    ) -> UserActivity:
        """Record a lightweight user activity event."""
        activity = UserActivity(
            user_id=user_id,
            activity_type=activity_type,
            description=description,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata_payload=metadata_payload or {}
        )
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
