from fastapi import APIRouter

from backend.api.auth import router as auth_router
from backend.api.users import router as users_router
from backend.api.countries import router as countries_router
from backend.api.cities import router as cities_router
from backend.api.activities import router as activities_router
from backend.api.trips import router as trips_router
from backend.api.trip_stops import router as trip_stops_router
from backend.api.itinerary import router as itinerary_router
from backend.api.expenses import router as expenses_router
from backend.api.saved_destinations import router as saved_destinations_router
from backend.api.trip_shares import router as trip_shares_router
from backend.api.public import router as public_router
from backend.api.notifications import router as notifications_router
from backend.api.search import router as search_router
from backend.api.admin import router as admin_router
from backend.api.reports import router as reports_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(countries_router)
api_router.include_router(cities_router)
api_router.include_router(activities_router)
api_router.include_router(trips_router)
api_router.include_router(trip_stops_router)
api_router.include_router(itinerary_router)
api_router.include_router(expenses_router)
api_router.include_router(saved_destinations_router)
api_router.include_router(trip_shares_router)
api_router.include_router(public_router)
api_router.include_router(notifications_router)
api_router.include_router(search_router)
api_router.include_router(admin_router)
api_router.include_router(reports_router)
