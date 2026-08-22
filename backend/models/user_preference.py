import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    language = Column(String(10), nullable=False, default="en")
    currency = Column(String(3), nullable=False, default="INR")
    notifications_enabled = Column(Boolean, nullable=False, default=True)
    budget_alerts_enabled = Column(Boolean, nullable=False, default=True)
    theme = Column(String(20), nullable=False, default="light")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="preferences")
