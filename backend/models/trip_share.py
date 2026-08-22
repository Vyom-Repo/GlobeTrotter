import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class SharePermission(str, PyEnum):
    VIEW = "view"
    COPY = "copy"

class TripShare(Base):
    __tablename__ = "trip_shares"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    shared_with_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    share_token = Column(String(64), nullable=False, unique=True, index=True)
    permission = Column(
        SQLEnum(SharePermission, name="share_permission_enum", create_type=True),
        nullable=False
    )
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint("expires_at IS NULL OR expires_at > created_at", name="chk_share_expires_after_created"),
    )

    # Relationships
    trip = relationship("Trip", back_populates="shares")
    shared_with_user = relationship("User", back_populates="trip_shares")
