from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, require_admin
from backend.models.user import User
from backend.models.trip import TripVisibility
from backend.models.report import ReportStatus, ReportTargetType
from backend.schemas.common import SuccessResponse, PaginatedResponse, PaginationMeta
from backend.schemas.user import UserResponse
from backend.schemas.trip import TripResponse
from backend.schemas.admin import ReportResponse, ReportResolveRequest, AdminStatsResponse
from backend.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Admin & Moderation"])

@router.get("/users", response_model=PaginatedResponse[UserResponse])
def list_users(
    search: Optional[str] = Query(None, description="Search users by name or email"),
    is_active: Optional[bool] = Query(None, description="Filter active/inactive users"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List and filter system users (Admin only)."""
    users, total = AdminService.list_users(db, search=search, is_active=is_active, page=page, page_size=page_size)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    return PaginatedResponse(
        data=[UserResponse.model_validate(u) for u in users],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.post("/users/{user_id}/deactivate", response_model=SuccessResponse[UserResponse])
def deactivate_user(
    user_id: UUID,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Deactivate user account (Admin only)."""
    user = AdminService.set_user_active_status(db, user_id, is_active=False)
    return SuccessResponse(data=UserResponse.model_validate(user))

@router.post("/users/{user_id}/reactivate", response_model=SuccessResponse[UserResponse])
def reactivate_user(
    user_id: UUID,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Reactivate user account (Admin only)."""
    user = AdminService.set_user_active_status(db, user_id, is_active=True)
    return SuccessResponse(data=UserResponse.model_validate(user))

@router.get("/public-trips", response_model=PaginatedResponse[TripResponse])
def list_public_trips(
    search: Optional[str] = Query(None, description="Search public trips"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List public trips for moderation (Admin only)."""
    trips, total = AdminService.list_public_trips(db, search=search, page=page, page_size=page_size)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    return PaginatedResponse(
        data=[TripResponse.model_validate(t) for t in trips],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.post("/public-trips/{trip_id}/unpublish", response_model=SuccessResponse[TripResponse])
def unpublish_trip(
    trip_id: UUID,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Unpublish an inappropriate public trip by setting visibility to private (Admin only)."""
    trip = AdminService.moderate_trip_visibility(db, trip_id, TripVisibility.PRIVATE)
    return SuccessResponse(data=TripResponse.model_validate(trip))

@router.post("/public-trips/{trip_id}/publish", response_model=SuccessResponse[TripResponse])
def publish_trip(
    trip_id: UUID,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Restore a public trip by setting visibility to public (Admin only)."""
    trip = AdminService.moderate_trip_visibility(db, trip_id, TripVisibility.PUBLIC)
    return SuccessResponse(data=TripResponse.model_validate(trip))

@router.get("/reports", response_model=PaginatedResponse[ReportResponse])
def list_reports(
    status: Optional[ReportStatus] = Query(None, description="Filter by report status"),
    target_type: Optional[ReportTargetType] = Query(None, description="Filter by target type"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List reported content for moderation (Admin only)."""
    reports, total = AdminService.list_reports(db, status=status, target_type=target_type, page=page, page_size=page_size)
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0
    return PaginatedResponse(
        data=[ReportResponse.model_validate(r) for r in reports],
        pagination=PaginationMeta(page=page, page_size=page_size, total=total, total_pages=total_pages)
    )

@router.post("/reports/{report_id}/resolve", response_model=SuccessResponse[ReportResponse])
def resolve_report(
    report_id: UUID,
    resolve_in: ReportResolveRequest,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Resolve or dismiss a moderation report (Admin only)."""
    report = AdminService.resolve_report(db, admin_user, report_id, resolve_in)
    return SuccessResponse(data=ReportResponse.model_validate(report))

@router.get("/stats", response_model=SuccessResponse[AdminStatsResponse])
def get_admin_stats(
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Fetch aggregate database & activity stats (Admin only)."""
    stats = AdminService.get_admin_stats(db)
    return SuccessResponse(data=stats)
