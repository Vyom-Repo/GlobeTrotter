import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Date, Numeric, DateTime, ForeignKey, Enum as SQLEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class ExpenseCategory(str, PyEnum):
    TRANSPORT = "transport"
    ACCOMMODATION = "accommodation"
    ACTIVITIES = "activities"
    MEALS = "meals"
    OTHER = "other"

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    trip_stop_id = Column(UUID(as_uuid=True), ForeignKey("trip_stops.id", ondelete="SET NULL"), nullable=True, index=True)
    itinerary_item_id = Column(UUID(as_uuid=True), ForeignKey("itinerary_items.id", ondelete="SET NULL"), nullable=True, index=True)
    category = Column(
        SQLEnum(ExpenseCategory, name="expense_category_enum", create_type=True),
        nullable=False,
        index=True
    )
    description = Column(String(255), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="INR")
    expense_date = Column(Date, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("amount >= 0", name="chk_expense_amount_non_negative"),
    )

    # Relationships
    trip = relationship("Trip", back_populates="expenses")
    trip_stop = relationship("TripStop", back_populates="expenses")
    itinerary_item = relationship("ItineraryItem", back_populates="expenses")
