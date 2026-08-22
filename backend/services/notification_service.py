from datetime import datetime, timezone
from typing import Optional, List, Dict, Any, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.core.exceptions import NotFoundException
from backend.models.notification import Notification, NotificationType
from backend.schemas.common import PaginationMeta

class NotificationService:
    @staticmethod
    def create_notification(
        db: Session,
        user_id: UUID,
        type: NotificationType,
        title: str,
        message: str,
        related_entity_type: Optional[str] = None,
        related_entity_id: Optional[UUID] = None,
        payload: Optional[Dict[str, Any]] = None,
        return_tuple: bool = False
    ) -> Any:
        """Create a notification for a user with duplicate suppression for identical pending notifications."""
        # Prevent duplicate identical notifications for the same entity and type
        if related_entity_type and related_entity_id:
            existing = (
                db.query(Notification)
                .filter(
                    Notification.user_id == user_id,
                    Notification.type == type,
                    Notification.related_entity_type == related_entity_type,
                    Notification.related_entity_id == related_entity_id,
                    Notification.is_read == False
                )
                .first()
            )
            if existing:
                return (existing, False) if return_tuple else existing

        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            related_entity_type=related_entity_type,
            related_entity_id=related_entity_id,
            is_read=False,
            payload=payload or {}
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return (notification, True) if return_tuple else notification

    @staticmethod
    def get_notifications(
        db: Session,
        user_id: UUID,
        is_read: Optional[bool] = None,
        notification_type: Optional[NotificationType] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Notification], int, PaginationMeta]:
        """Fetch user notifications with pagination and filtering."""
        query = db.query(Notification).filter(Notification.user_id == user_id)

        if is_read is not None:
            query = query.filter(Notification.is_read == is_read)
        if notification_type is not None:
            query = query.filter(Notification.type == notification_type)

        total = query.count()
        total_pages = max(1, (total + page_size - 1) // page_size)
        offset = (page - 1) * page_size

        notifications = (
            query.order_by(desc(Notification.created_at))
            .offset(offset)
            .limit(page_size)
            .all()
        )

        unread_count = (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .count()
        )

        pagination = PaginationMeta(
            page=page,
            page_size=page_size,
            total=total,
            total_pages=total_pages
        )

        return notifications, unread_count, pagination

    @staticmethod
    def get_notification_by_id(db: Session, user_id: UUID, notification_id: UUID) -> Notification:
        """Fetch a specific notification enforcing user ownership."""
        notification = (
            db.query(Notification)
            .filter(Notification.id == notification_id, Notification.user_id == user_id)
            .first()
        )
        if not notification:
            raise NotFoundException("Notification not found")
        return notification

    @staticmethod
    def mark_as_read(db: Session, user_id: UUID, notification_id: UUID) -> Notification:
        """Mark a single notification as read."""
        notification = NotificationService.get_notification_by_id(db, user_id, notification_id)
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = datetime.now(timezone.utc)
            db.commit()
            db.refresh(notification)
        return notification

    @staticmethod
    def mark_all_as_read(db: Session, user_id: UUID) -> int:
        """Mark all unread notifications for a user as read."""
        now = datetime.now(timezone.utc)
        count = (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .update({Notification.is_read: True, Notification.read_at: now}, synchronize_session=False)
        )
        db.commit()
        return count

    @staticmethod
    def delete_notification(db: Session, user_id: UUID, notification_id: UUID) -> None:
        """Delete a notification enforcing user ownership."""
        notification = NotificationService.get_notification_by_id(db, user_id, notification_id)
        db.delete(notification)
        db.commit()

    @staticmethod
    def get_unread_count(db: Session, user_id: UUID) -> int:
        """Get count of unread notifications for a user."""
        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id, Notification.is_read == False)
            .count()
        )
