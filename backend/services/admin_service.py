from typing import Optional, List, Tuple
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, desc

from backend.core.exceptions import BadRequestException, NotFoundException
from backend.models.user import User
from backend.models.trip import Trip, TripVisibility
from backend.models.report import Report, ReportStatus, ReportTargetType
from backend.models.saved_destination import SavedDestination
from backend.schemas.admin import ReportCreate, ReportResolveRequest, AdminStatsResponse

class AdminService:
    @staticmethod
    def list_users(
        db: Session,
        search: Optional[str] = None,
        is_active: Optional[bool] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[User], int]:
        """List and search users with pagination and active/inactive filtering."""
        query = db.query(User)

        if search:
            clean_search = search.strip().lower()
            query = query.filter(or_(
                func.lower(User.name).contains(clean_search),
                func.lower(User.email).contains(clean_search)
            ))

        if is_active is not None:
            query = query.filter(User.is_active == is_active)

        total = query.count()
        offset = (page - 1) * page_size
        users = query.order_by(desc(User.created_at)).offset(offset).limit(page_size).all()
        return users, total

    @staticmethod
    def set_user_active_status(db: Session, user_id: UUID, is_active: bool) -> User:
        """Deactivate or reactivate a user account."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundException("User not found")
        user.is_active = is_active
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def list_public_trips(
        db: Session,
        search: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Trip], int]:
        """List public trips for admin moderation."""
        query = db.query(Trip).filter(Trip.visibility == TripVisibility.PUBLIC)

        if search:
            clean_s = search.strip().lower()
            query = query.filter(or_(
                func.lower(Trip.name).contains(clean_s),
                func.lower(Trip.description).contains(clean_s)
            ))

        total = query.count()
        offset = (page - 1) * page_size
        trips = query.order_by(desc(Trip.created_at)).offset(offset).limit(page_size).all()
        return trips, total

    @staticmethod
    def moderate_trip_visibility(db: Session, trip_id: UUID, visibility: TripVisibility) -> Trip:
        """Moderate a trip (e.g. unpublish or publish)."""
        trip = db.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise NotFoundException("Trip not found")
        trip.visibility = visibility
        db.commit()
        db.refresh(trip)
        return trip

    @staticmethod
    def create_report(db: Session, reporter: User, report_in: ReportCreate) -> Report:
        """Create a new report while suppressing duplicate pending spam reports."""
        existing = (
            db.query(Report)
            .filter(
                Report.reporter_id == reporter.id,
                Report.target_type == report_in.target_type,
                Report.target_id == report_in.target_id,
                Report.status == ReportStatus.PENDING
            )
            .first()
        )
        if existing:
            raise BadRequestException("You have already submitted a pending report for this item", code="DUPLICATE_REPORT")

        report = Report(
            reporter_id=reporter.id,
            target_type=report_in.target_type,
            target_id=report_in.target_id,
            reason=report_in.reason.strip(),
            description=report_in.description.strip() if report_in.description else None,
            status=ReportStatus.PENDING
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def list_reports(
        db: Session,
        status: Optional[ReportStatus] = None,
        target_type: Optional[ReportTargetType] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[Report], int]:
        """List reported content for admin review."""
        query = db.query(Report)

        if status:
            query = query.filter(Report.status == status)
        if target_type:
            query = query.filter(Report.target_type == target_type)

        total = query.count()
        offset = (page - 1) * page_size
        reports = query.order_by(desc(Report.created_at)).offset(offset).limit(page_size).all()
        return reports, total

    @staticmethod
    def resolve_report(db: Session, admin_user: User, report_id: UUID, resolve_in: ReportResolveRequest) -> Report:
        """Resolve or dismiss a report."""
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            raise NotFoundException("Report not found")

        report.status = resolve_in.status
        report.resolved_at = datetime.now()
        report.resolver_id = admin_user.id

        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def get_admin_stats(db: Session) -> AdminStatsResponse:
        """Generate aggregate system statistics."""
        total_users = db.query(func.count(User.id)).scalar() or 0
        active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0
        inactive_users = total_users - active_users

        total_trips = db.query(func.count(Trip.id)).scalar() or 0
        public_trips = db.query(func.count(Trip.id)).filter(Trip.visibility == TripVisibility.PUBLIC).scalar() or 0

        total_reports = db.query(func.count(Report.id)).scalar() or 0
        pending_reports = db.query(func.count(Report.id)).filter(Report.status == ReportStatus.PENDING).scalar() or 0

        saved_count = db.query(func.count(SavedDestination.id)).scalar() or 0

        return AdminStatsResponse(
            total_users=total_users,
            active_users=active_users,
            inactive_users=inactive_users,
            total_trips=total_trips,
            public_trips=public_trips,
            total_reports=total_reports,
            pending_reports=pending_reports,
            saved_destinations_count=saved_count
        )
