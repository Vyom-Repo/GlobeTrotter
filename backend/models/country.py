import uuid
from sqlalchemy import Column, String, Text, Numeric, DateTime, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class Country(Base):
    __tablename__ = "countries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True, index=True)
    iso_code = Column(String(2), nullable=False, unique=True, index=True)
    iso3_code = Column(String(3), nullable=False, unique=True, index=True)
    region = Column(String(50), nullable=False, index=True)
    subregion = Column(String(50), nullable=True, index=True)
    capital = Column(String(100), nullable=True)
    currency_code = Column(String(3), nullable=True)
    latitude = Column(Numeric(9, 6), nullable=True)
    longitude = Column(Numeric(9, 6), nullable=True)
    flag_emoji = Column(String(10), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("latitude IS NULL OR (latitude >= -90 AND latitude <= 90)", name="chk_country_latitude_range"),
        CheckConstraint("longitude IS NULL OR (longitude >= -180 AND longitude <= 180)", name="chk_country_longitude_range"),
        Index("idx_country_region_subregion", "region", "subregion"),
    )

    # Relationships
    cities = relationship("City", back_populates="country", cascade="all, delete-orphan")
