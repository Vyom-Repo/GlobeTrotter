from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, get_current_user
from backend.models.user import User
from backend.schemas.common import SuccessResponse
from backend.schemas.admin import ReportCreate, ReportResponse
from backend.services.admin_service import AdminService

router = APIRouter(prefix="/reports", tags=["Reporting"])

@router.post("", response_model=SuccessResponse[ReportResponse], status_code=status.HTTP_201_CREATED)
def submit_report(
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a moderation report for inappropriate content or public trips."""
    report = AdminService.create_report(db, current_user, report_in)
    return SuccessResponse(data=ReportResponse.model_validate(report))
