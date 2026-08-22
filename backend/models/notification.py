import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum, Index, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class NotificationType(str, PyEnum):
    TRIP_REMINDER = "trip_reminder"
    ITINERARY_REMINDER = "itinerary_reminder"
    BUDGET_WARNING = "budget_warning"
    TRIP_SHARING = "trip_sharing"
    SAVED_UPDATE = "saved_update"
    SYSTEM = "system"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(
        SQLEnum(NotificationType, name="notification_type_enum", create_type=True),
        nullable=False,
        index=True
    )
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    related_entity_type = Column(String(50), nullable=True, index=True)
    related_entity_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    is_read = Column(Boolean, nullable=False, default=False, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    payload = Column(JSON, nullable=True)

    __table_args__ = (
        Index("idx_notifications_user_read", "user_id", "is_read"),
        Index("idx_notifications_user_created", "user_id", "created_at"),
    )

    # Relationship
    user = relationship("User", back_populates="notifications")
