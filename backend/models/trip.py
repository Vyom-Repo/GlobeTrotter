import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Text, Date, Numeric, DateTime, ForeignKey, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class TripVisibility(str, PyEnum):
    PRIVATE = "private"
    SHARED = "shared"
    PUBLIC = "public"

class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False)
    cover_photo_url = Column(Text, nullable=True)
    budget_limit = Column(Numeric(12, 2), nullable=True)
    currency = Column(String(3), nullable=False, default="INR")
    visibility = Column(
        SQLEnum(TripVisibility, name="trip_visibility_enum", create_type=True),
        nullable=False,
        default=TripVisibility.PRIVATE,
        index=True
    )
    share_token = Column(String(64), unique=True, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("start_date <= end_date", name="chk_trip_date_range"),
        CheckConstraint("budget_limit IS NULL OR budget_limit >= 0", name="chk_trip_budget_limit_positive"),
    )

    # Relationships
    user = relationship("User", back_populates="trips")
    stops = relationship("TripStop", back_populates="trip", cascade="all, delete-orphan", order_by="TripStop.stop_order")
    expenses = relationship("Expense", back_populates="trip", cascade="all, delete-orphan")
    shares = relationship("TripShare", back_populates="trip", cascade="all, delete-orphan")
