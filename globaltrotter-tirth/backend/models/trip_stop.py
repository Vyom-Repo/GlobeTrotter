import uuid
from sqlalchemy import Column, Text, Date, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class TripStop(Base):
    __tablename__ = "trip_stops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    stop_order = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("trip_id", "stop_order", name="uq_trip_stop_order"),
        CheckConstraint("start_date <= end_date", name="chk_stop_date_range"),
        CheckConstraint("stop_order > 0", name="chk_stop_order_positive"),
        Index("idx_trip_stop_trip_order", "trip_id", "stop_order"),
    )

    # Relationships
    trip = relationship("Trip", back_populates="stops")
    city = relationship("City", back_populates="trip_stops")
    itinerary_items = relationship("ItineraryItem", back_populates="trip_stop", cascade="all, delete-orphan", order_by="ItineraryItem.item_order")
    expenses = relationship("Expense", back_populates="trip_stop")
