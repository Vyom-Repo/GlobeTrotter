import uuid
from sqlalchemy import Column, String, Text, Numeric, Integer, DateTime, ForeignKey, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    activity_type = Column(String(50), nullable=False, index=True)
    estimated_cost = Column(Numeric(12, 2), nullable=False, default=0, index=True)
    currency = Column(String(3), nullable=False, default="INR")
    duration_minutes = Column(Integer, nullable=True)
    image_url = Column(Text, nullable=True)
    popularity_score = Column(Numeric(5, 2), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("estimated_cost >= 0", name="chk_activity_estimated_cost_positive"),
        CheckConstraint("duration_minutes IS NULL OR duration_minutes > 0", name="chk_activity_duration_positive"),
        CheckConstraint("popularity_score IS NULL OR popularity_score >= 0", name="chk_activity_popularity_positive"),
        Index("idx_activity_city_type", "city_id", "activity_type"),
    )

    # Relationships
    city = relationship("City", back_populates="activities")
    itinerary_items = relationship("ItineraryItem", back_populates="activity")
