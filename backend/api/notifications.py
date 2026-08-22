from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.models.notification import NotificationType
from backend.schemas.common import SuccessResponse
from backend.schemas.notification import NotificationResponse, NotificationListResponse, UnreadCountResponse
from backend.services.notification_service import NotificationService
from backend.services.reminder_service import ReminderService

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=SuccessResponse[NotificationListResponse])
def get_notifications(
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    type: Optional[NotificationType] = Query(None, description="Filter by notification type"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve paginated notifications for the authenticated user."""
    notifications, unread_count, pagination = NotificationService.get_notifications(
        db=db,
        user_id=current_user.id,
        is_read=is_read,
        notification_type=type,
        page=page,
        page_size=page_size
    )

    items = [NotificationResponse.model_validate(n) for n in notifications]
    list_response = NotificationListResponse(
        items=items,
        unread_count=unread_count,
        pagination=pagination
    )
    return SuccessResponse(data=list_response)

@router.get("/unread-count", response_model=SuccessResponse[UnreadCountResponse])
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get total count of unread notifications for the current user."""
    unread_count = NotificationService.get_unread_count(db, current_user.id)
    return SuccessResponse(data=UnreadCountResponse(unread_count=unread_count))

@router.get("/{notification_id}", response_model=SuccessResponse[NotificationResponse])
def get_notification(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve a single notification by ID enforcing user ownership."""
    notification = NotificationService.get_notification_by_id(db, current_user.id, notification_id)
    return SuccessResponse(data=NotificationResponse.model_validate(notification))

@router.patch("/{notification_id}/read", response_model=SuccessResponse[NotificationResponse])
def mark_notification_as_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read."""
    notification = NotificationService.mark_as_read(db, current_user.id, notification_id)
    return SuccessResponse(data=NotificationResponse.model_validate(notification))

@router.patch("/read-all", response_model=SuccessResponse[dict])
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all unread notifications for the current user as read."""
    updated_count = NotificationService.mark_all_as_read(db, current_user.id)
    return SuccessResponse(data={"message": f"{updated_count} notification(s) marked as read", "updated_count": updated_count})

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a notification enforcing user ownership."""
    NotificationService.delete_notification(db, current_user.id, notification_id)
    return None

@router.post("/generate-reminders", response_model=SuccessResponse[dict])
def trigger_reminder_generation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Trigger reminder check for upcoming trips, stops, and itinerary items."""
    reminders = ReminderService.generate_trip_reminders(db, user_id=current_user.id)
    return SuccessResponse(data={"message": f"Generated {len(reminders)} new reminder(s)", "generated_count": len(reminders)})
