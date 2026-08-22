from backend.schemas.common import SuccessResponse, ErrorResponse, PaginatedResponse, PaginationMeta
from backend.schemas.country import CountryBase, CountryResponse
from backend.schemas.city import CityBase, CityResponse
from backend.schemas.activity import ActivityBase, ActivityResponse
from backend.schemas.user import (
    UserBase, UserCreate, UserUpdate, UserResponse,
    PasswordChangeRequest, UserPreferenceUpdate, UserPreferenceResponse
)
from backend.schemas.auth import LoginRequest, TokenResponse, TokenPayload
from backend.schemas.trip import TripBase, TripCreate, TripUpdate, TripResponse
from backend.schemas.trip_stop import TripStopBase, TripStopCreate, TripStopResponse
from backend.schemas.itinerary import ItineraryItemBase, ItineraryItemCreate, ItineraryItemResponse
from backend.schemas.expense import ExpenseBase, ExpenseCreate, ExpenseResponse, BudgetSummary
from backend.schemas.saved_destination import SavedDestinationCreate, SavedDestinationResponse
from backend.schemas.trip_share import TripShareCreate, TripShareResponse
from backend.schemas.notification import NotificationResponse, NotificationListResponse, UnreadCountResponse
from backend.schemas.user_activity import UserActivityResponse
from backend.schemas.search import (
    SearchResultItem, UnifiedSearchResponse,
    RecommendationItem, RecommendationListResponse
)
from backend.schemas.admin import (
    ReportCreate, ReportResolveRequest, ReportResponse, AdminStatsResponse
)

__all__ = [
    "SuccessResponse",
    "ErrorResponse",
    "PaginatedResponse",
    "PaginationMeta",
    "CountryBase",
    "CountryResponse",
    "CityBase",
    "CityResponse",
    "ActivityBase",
    "ActivityResponse",
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "PasswordChangeRequest",
    "UserPreferenceUpdate",
    "UserPreferenceResponse",
    "LoginRequest",
    "TokenResponse",
    "TokenPayload",
    "TripBase",
    "TripCreate",
    "TripUpdate",
    "TripResponse",
    "TripStopBase",
    "TripStopCreate",
    "TripStopResponse",
    "ItineraryItemBase",
    "ItineraryItemCreate",
    "ItineraryItemResponse",
    "ExpenseBase",
    "ExpenseCreate",
    "ExpenseResponse",
    "BudgetSummary",
    "SavedDestinationCreate",
    "SavedDestinationResponse",
    "TripShareCreate",
    "TripShareResponse",
    "NotificationResponse",
    "NotificationListResponse",
    "UnreadCountResponse",
    "UserActivityResponse",
    "SearchResultItem",
    "UnifiedSearchResponse",
    "RecommendationItem",
    "RecommendationListResponse",
    "ReportCreate",
    "ReportResolveRequest",
    "ReportResponse",
    "AdminStatsResponse",
]
