import uuid
from sqlalchemy import Column, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class SavedDestination(Base):
    __tablename__ = "saved_destinations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(UUID(as_uuid=True), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "city_id", name="uq_saved_destination_user_city"),
    )

    # Relationships
    user = relationship("User", back_populates="saved_destinations")
    city = relationship("City", back_populates="saved_destinations")
