from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

from backend.models.report import ReportTargetType, ReportStatus

class ReportCreate(BaseModel):
    target_type: ReportTargetType
    target_id: UUID
    reason: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None

class ReportResolveRequest(BaseModel):
    status: ReportStatus = Field(..., description="Target status: resolved | dismissed | reviewed")
    notes: Optional[str] = None

class ReportResponse(BaseModel):
    id: UUID
    reporter_id: UUID
    target_type: str
    target_id: UUID
    reason: str
    description: Optional[str] = None
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    resolver_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)

class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    total_trips: int
    public_trips: int
    total_reports: int
    pending_reports: int
    saved_destinations_count: int

    model_config = ConfigDict(from_attributes=True)
