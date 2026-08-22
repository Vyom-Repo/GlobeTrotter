import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class SavedEntityType(str, PyEnum):
    COUNTRY = "country"
    CITY = "city"
    ACTIVITY = "activity"

class SavedDestination(Base):
    __tablename__ = "saved_destinations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_type = Column(
        SQLEnum(SavedEntityType, name="saved_entity_type_enum", create_type=True),
        nullable=False,
        default=SavedEntityType.CITY,
        index=True
    )
    country_id = Column(UUID(as_uuid=True), ForeignKey("countries.id", ondelete="CASCADE"), nullable=True, index=True)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id", ondelete="CASCADE"), nullable=True, index=True)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "country_id", name="uq_saved_destination_user_country"),
        UniqueConstraint("user_id", "city_id", name="uq_saved_destination_user_city"),
        UniqueConstraint("user_id", "activity_id", name="uq_saved_destination_user_activity"),
    )

    # Relationships
    user = relationship("User", back_populates="saved_destinations")
    country = relationship("Country")
    city = relationship("City", back_populates="saved_destinations")
    activity = relationship("Activity")
