import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database.base import Base

class ReportTargetType(str, PyEnum):
    PUBLIC_TRIP = "public_trip"
    SHARED_LINK = "shared_link"
    USER = "user"

class ReportStatus(str, PyEnum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"

class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_type = Column(
        SQLEnum(ReportTargetType, name="report_target_type_enum", create_type=True),
        nullable=False,
        index=True
    )
    target_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    reason = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(
        SQLEnum(ReportStatus, name="report_status_enum", create_type=True),
        nullable=False,
        default=ReportStatus.PENDING,
        index=True
    )
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolver_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    __table_args__ = (
        Index("idx_report_status_target", "status", "target_type", "target_id"),
    )

    # Relationships
    reporter = relationship("User", foreign_keys=[reporter_id])
    resolver = relationship("User", foreign_keys=[resolver_id])
