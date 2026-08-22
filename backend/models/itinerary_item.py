import uuid
from sqlalchemy import Column, Text, Date, Time, Integer, Numeric, DateTime, ForeignKey, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_stop_id = Column(UUID(as_uuid=True), ForeignKey("trip_stops.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    item_order = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    estimated_cost = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("trip_stop_id", "scheduled_date", "item_order", name="uq_itinerary_item_order_per_day"),
        CheckConstraint("item_order > 0", name="chk_itinerary_item_order_positive"),
        CheckConstraint("estimated_cost IS NULL OR estimated_cost >= 0", name="chk_itinerary_cost_non_negative"),
        CheckConstraint("start_time IS NULL OR end_time IS NULL OR start_time < end_time", name="chk_itinerary_time_range"),
        Index("idx_itinerary_stop_date", "trip_stop_id", "scheduled_date"),
    )

    # Relationships
    trip_stop = relationship("TripStop", back_populates="itinerary_items")
    activity = relationship("Activity", back_populates="itinerary_items")
    expenses = relationship("Expense", back_populates="itinerary_item")
