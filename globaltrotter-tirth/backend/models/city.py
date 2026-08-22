import uuid
from sqlalchemy import Column, String, Text, Numeric, DateTime, ForeignKey, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class City(Base):
    __tablename__ = "cities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_id = Column(UUID(as_uuid=True), ForeignKey("countries.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    region = Column(String(100), nullable=True, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    cost_index = Column(Numeric(5, 2), nullable=True, index=True)
    popularity_score = Column(Numeric(5, 2), nullable=True, index=True)
    latitude = Column(Numeric(9, 6), nullable=True)
    longitude = Column(Numeric(9, 6), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("cost_index IS NULL OR cost_index >= 0", name="chk_city_cost_index_positive"),
        CheckConstraint("popularity_score IS NULL OR popularity_score >= 0", name="chk_city_popularity_positive"),
        CheckConstraint("latitude IS NULL OR (latitude >= -90 AND latitude <= 90)", name="chk_city_latitude_range"),
        CheckConstraint("longitude IS NULL OR (longitude >= -180 AND longitude <= 180)", name="chk_city_longitude_range"),
        Index("idx_city_country_region", "country_id", "region"),
        Index("idx_city_name_country", "name", "country_id"),
    )

    # Relationships
    country = relationship("Country", back_populates="cities")
    activities = relationship("Activity", back_populates="city", cascade="all, delete-orphan")
    trip_stops = relationship("TripStop", back_populates="city")
    saved_destinations = relationship("SavedDestination", back_populates="city", cascade="all, delete-orphan")
