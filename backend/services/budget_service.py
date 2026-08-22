from decimal import Decimal
from typing import Dict, List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.core.exceptions import NotFoundException, ForbiddenException, BadRequestException
from backend.models.expense import Expense, ExpenseCategory
from backend.models.trip import Trip
from backend.models.trip_stop import TripStop
from backend.models.itinerary_item import ItineraryItem
from backend.models.user import User
from backend.schemas.expense import ExpenseCreate, ExpenseUpdate, BudgetSummary
from backend.services.trip_service import TripService

class BudgetService:
    """Service layer handling trip budget breakdowns, expense logging, and financial aggregations."""

    @staticmethod
    def create_expense(db: Session, expense_in: ExpenseCreate, user: User) -> Expense:
        trip = TripService.get_trip_by_id(db, expense_in.trip_id, user)
        if trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to log expenses for this trip", code="TRIP_MODIFY_DENIED")

        if expense_in.amount <= Decimal("0.00"):
            raise BadRequestException(message="Expense amount must be strictly greater than zero", code="INVALID_EXPENSE_AMOUNT")

        if expense_in.currency.upper() != trip.currency.upper():
            raise BadRequestException(
                message=f"Expense currency ({expense_in.currency}) must match trip currency ({trip.currency})",
                code="CURRENCY_MISMATCH"
            )

        # Stop hierarchy check
        if expense_in.trip_stop_id:
            stop = db.query(TripStop).filter(TripStop.id == expense_in.trip_stop_id).first()
            if not stop:
                raise NotFoundException(message="Trip stop not found", code="TRIP_STOP_NOT_FOUND")
            if stop.trip_id != expense_in.trip_id:
                raise BadRequestException(message="Trip stop does not belong to the specified trip", code="STOP_TRIP_MISMATCH")

        # Itinerary item hierarchy check
        if expense_in.itinerary_item_id:
            item = db.query(ItineraryItem).filter(ItineraryItem.id == expense_in.itinerary_item_id).first()
            if not item:
                raise NotFoundException(message="Itinerary item not found", code="ITINERARY_ITEM_NOT_FOUND")
            stop = db.query(TripStop).filter(TripStop.id == item.trip_stop_id).first() if item else None
            if not stop or stop.trip_id != expense_in.trip_id:
                raise BadRequestException(message="Itinerary item does not belong to the specified trip", code="ITINERARY_TRIP_MISMATCH")

        db_exp = Expense(
            trip_id=expense_in.trip_id,
            trip_stop_id=expense_in.trip_stop_id,
            itinerary_item_id=expense_in.itinerary_item_id,
            category=expense_in.category,
            description=expense_in.description,
            amount=expense_in.amount,
            currency=expense_in.currency.upper(),
            expense_date=expense_in.expense_date
        )
        db.add(db_exp)
        db.commit()
        db.refresh(db_exp)
        return db_exp

    @staticmethod
    def list_expenses(
        db: Session,
        trip_id: UUID,
        category: Optional[ExpenseCategory] = None,
        trip_stop_id: Optional[UUID] = None,
        itinerary_item_id: Optional[UUID] = None,
        user: Optional[User] = None
    ) -> List[Expense]:
        TripService.get_trip_by_id(db, trip_id, user)

        query = db.query(Expense).filter(Expense.trip_id == trip_id)
        if category:
            query = query.filter(Expense.category == category)
        if trip_stop_id:
            query = query.filter(Expense.trip_stop_id == trip_stop_id)
        if itinerary_item_id:
            query = query.filter(Expense.itinerary_item_id == itinerary_item_id)

        return query.order_by(Expense.expense_date.desc().nullslast(), Expense.created_at.desc()).all()

    @staticmethod
    def get_expense_by_id(db: Session, expense_id: UUID, user: Optional[User] = None) -> Expense:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise NotFoundException(message="Expense not found", code="EXPENSE_NOT_FOUND")

        TripService.get_trip_by_id(db, expense.trip_id, user)
        return expense

    @staticmethod
    def update_expense(db: Session, expense_id: UUID, expense_in: ExpenseUpdate, user: User) -> Expense:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise NotFoundException(message="Expense not found", code="EXPENSE_NOT_FOUND")

        trip = db.query(Trip).filter(Trip.id == expense.trip_id).first()
        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to modify this expense", code="EXPENSE_MODIFY_DENIED")

        update_data = expense_in.model_dump(exclude_unset=True)

        if "amount" in update_data and update_data["amount"] is not None:
            if update_data["amount"] <= Decimal("0.00"):
                raise BadRequestException(message="Expense amount must be strictly greater than zero", code="INVALID_EXPENSE_AMOUNT")

        if "currency" in update_data and update_data["currency"] is not None:
            if update_data["currency"].upper() != trip.currency.upper():
                raise BadRequestException(
                    message=f"Expense currency ({update_data['currency']}) must match trip currency ({trip.currency})",
                    code="CURRENCY_MISMATCH"
                )
            update_data["currency"] = update_data["currency"].upper()

        if "trip_stop_id" in update_data and update_data["trip_stop_id"]:
            stop = db.query(TripStop).filter(TripStop.id == update_data["trip_stop_id"]).first()
            if not stop or stop.trip_id != expense.trip_id:
                raise BadRequestException(message="Trip stop does not belong to the specified trip", code="STOP_TRIP_MISMATCH")

        if "itinerary_item_id" in update_data and update_data["itinerary_item_id"]:
            item = db.query(ItineraryItem).filter(ItineraryItem.id == update_data["itinerary_item_id"]).first()
            stop = db.query(TripStop).filter(TripStop.id == item.trip_stop_id).first() if item else None
            if not stop or stop.trip_id != expense.trip_id:
                raise BadRequestException(message="Itinerary item does not belong to the specified trip", code="ITINERARY_TRIP_MISMATCH")

        for key, value in update_data.items():
            setattr(expense, key, value)

        db.commit()
        db.refresh(expense)
        return expense

    @staticmethod
    def delete_expense(db: Session, expense_id: UUID, user: User) -> None:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            raise NotFoundException(message="Expense not found", code="EXPENSE_NOT_FOUND")

        trip = db.query(Trip).filter(Trip.id == expense.trip_id).first()
        if not trip or trip.user_id != user.id:
            raise ForbiddenException(message="You do not have permission to delete this expense", code="EXPENSE_DELETE_DENIED")

        db.delete(expense)
        db.commit()

    @staticmethod
    def get_trip_budget_summary(db: Session, trip_id: UUID, user: Optional[User] = None) -> BudgetSummary:
        trip = TripService.get_trip_by_id(db, trip_id, user)

        # Aggregate total expenses by category using PostgreSQL / SQLAlchemy SUM
        category_sums = db.query(
            Expense.category,
            func.coalesce(func.sum(Expense.amount), Decimal("0.00")).label("cat_total")
        ).filter(Expense.trip_id == trip_id).group_by(Expense.category).all()

        by_cat_dict: Dict[str, Decimal] = {cat.value: Decimal("0.00") for cat in ExpenseCategory}
        total_spent = Decimal("0.00")

        for cat, amount in category_sums:
            by_cat_dict[cat.value] = Decimal(str(amount))
            total_spent += Decimal(str(amount))

        remaining_budget = (trip.budget_limit - total_spent) if trip.budget_limit is not None else None

        utilization_pct: Optional[float] = None
        if trip.budget_limit is not None and trip.budget_limit > Decimal("0.00"):
            utilization_pct = round(float((total_spent / trip.budget_limit) * 100), 2)

        return BudgetSummary(
            trip_id=trip.id,
            budget_limit=trip.budget_limit,
            total_spent=total_spent,
            remaining_budget=remaining_budget,
            utilization_percentage=utilization_pct,
            currency=trip.currency,
            category_breakdown=by_cat_dict
        )
