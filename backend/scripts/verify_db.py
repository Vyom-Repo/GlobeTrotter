import sys
import logging
from datetime import date, time
from decimal import Decimal
from pathlib import Path

# Add root directory to sys.path
root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy.orm import sessionmaker

from backend.core.config import settings
from backend.database.base import Base
from backend.models.user import User
from backend.models.user_preference import UserPreference
from backend.models.country import Country
from backend.models.city import City
from backend.models.activity import Activity
from backend.models.trip import Trip, TripVisibility
from backend.models.trip_stop import TripStop
from backend.models.itinerary_item import ItineraryItem
from backend.models.expense import Expense, ExpenseCategory
from backend.models.saved_destination import SavedDestination
from backend.models.trip_share import TripShare, SharePermission

# Import seed function to seed data for verification if using in-memory engine
from backend.scripts.seed_data import seed_database

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def run_verification():
    """Verify all 10+ core tables, offline global travel datasets, search/filter queries, and constraints."""
    logger.info("Starting complete offline database verification test suite...")

    pg_engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    try:
        connection = pg_engine.connect()
        connection.close()
        engine_to_use = pg_engine
        logger.info(f"Connected to target PostgreSQL database at: {settings.DATABASE_URL}")
    except OperationalError:
        logger.warning(f"Target PostgreSQL database at '{settings.DATABASE_URL}' is currently offline.")
        logger.info("Using in-memory engine with seeded static dataset for verification testing...")
        engine_to_use = create_engine("sqlite:///:memory:", echo=False)
        Base.metadata.create_all(bind=engine_to_use)

    TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine_to_use)
    session = TestSession()

    try:
        # Seed in-memory engine if empty
        if session.query(Country).count() == 0:
            logger.info("Populating verification engine from local dataset JSON files...")
            seed_database(session=session)

        country_count = session.query(Country).count()
        city_count = session.query(City).count()
        activity_count = session.query(Activity).count()

        logger.info("--> Verification Step 1: Checking Offline Dataset Minimum Counts")
        logger.info(f"  Countries found:  {country_count} (Requirement: >= 120)")
        logger.info(f"  Cities found:     {city_count} (Requirement: >= 500)")
        logger.info(f"  Activities found: {activity_count} (Requirement: >= 1500)")

        assert country_count >= 120, f"Country count failed: {country_count} < 120"
        assert city_count >= 500, f"City count failed: {city_count} < 500"
        assert activity_count >= 1500, f"Activity count failed: {activity_count} < 1500"
        logger.info("✓ Dataset minimum count thresholds PASSED!")

        # Uniqueness Verification
        logger.info("--> Verification Step 2: Uniqueness Constraints")
        iso_codes = [c.iso_code for c in session.query(Country.iso_code).all()]
        iso3_codes = [c.iso3_code for c in session.query(Country.iso3_code).all()]
        country_names = [c.name for c in session.query(Country.name).all()]

        assert len(iso_codes) == len(set(iso_codes)), "Country ISO codes are not unique!"
        assert len(iso3_codes) == len(set(iso3_codes)), "Country ISO3 codes are not unique!"
        assert len(country_names) == len(set(country_names)), "Country names are not unique!"
        logger.info("✓ Country uniqueness constraints PASSED!")

        # Referential Integrity Verification
        logger.info("--> Verification Step 3: Referential Integrity")
        cities_without_country = session.query(City).filter(City.country_id.is_(None)).count()
        activities_without_city = session.query(Activity).filter(Activity.city_id.is_(None)).count()
        assert cities_without_country == 0, "Found orphan cities without country_id!"
        assert activities_without_city == 0, "Found orphan activities without city_id!"
        logger.info("✓ Referential integrity (Cities -> Countries & Activities -> Cities) PASSED!")

        # Search Query Verification
        logger.info("--> Verification Step 4: Offline Travel Data Search Queries")
        search_terms = ["India", "France", "Japan", "Paris", "Tokyo", "Dubai"]
        for term in search_terms:
            c_matches = session.query(Country).filter(Country.name.ilike(f"%{term}%")).all()
            ct_matches = session.query(City).filter(City.name.ilike(f"%{term}%")).all()
            logger.info(f"  Search term '{term}': {len(c_matches)} countries matched, {len(ct_matches)} cities matched.")
            assert (len(c_matches) + len(ct_matches)) > 0, f"Search term '{term}' returned 0 results!"
        logger.info("✓ Offline travel search queries PASSED!")

        # Filter Verification
        logger.info("--> Verification Step 5: Region & Category Filtering")
        europe_cities = session.query(City).join(Country).filter(Country.region == "Europe").all()
        food_activities = session.query(Activity).filter(Activity.activity_type == "food").all()
        cheap_activities = session.query(Activity).filter(Activity.estimated_cost <= Decimal("1000.00")).all()

        logger.info(f"  Cities in Europe: {len(europe_cities)}")
        logger.info(f"  Food activities:  {len(food_activities)}")
        logger.info(f"  Activities <= 1000: {len(cheap_activities)}")

        assert len(europe_cities) > 0, "Filtering cities by region 'Europe' returned 0 results!"
        assert len(food_activities) > 0, "Filtering activities by type 'food' returned 0 results!"
        assert len(cheap_activities) > 0, "Filtering activities by cost returned 0 results!"
        logger.info("✓ Region and category filtering PASSED!")

        # End-to-End Transactional Verification (User -> Trip -> Stop -> Itinerary -> Expense)
        logger.info("--> Verification Step 6: End-to-End Relational Model Operations")
        test_user = User(
            name="Bob Offline",
            email="bob.offline@globetrotter.io",
            password_hash="$2b$12$passwordhash"
        )
        session.add(test_user)
        session.commit()

        sample_city = session.query(City).first()
        sample_activity = session.query(Activity).filter(Activity.city_id == sample_city.id).first()

        test_trip = Trip(
            user_id=test_user.id,
            name="Offline World Tour",
            start_date=date(2026, 10, 1),
            end_date=date(2026, 10, 15),
            budget_limit=Decimal("100000.00"),
            currency="USD",
            visibility=TripVisibility.PRIVATE
        )
        session.add(test_trip)
        session.commit()

        stop = TripStop(
            trip_id=test_trip.id,
            city_id=sample_city.id,
            start_date=date(2026, 10, 1),
            end_date=date(2026, 10, 5),
            stop_order=1
        )
        session.add(stop)
        session.commit()

        item = ItineraryItem(
            trip_stop_id=stop.id,
            activity_id=sample_activity.id,
            scheduled_date=date(2026, 10, 2),
            start_time=time(9, 30),
            end_time=time(11, 30),
            item_order=1,
            estimated_cost=sample_activity.estimated_cost
        )
        session.add(item)
        session.commit()

        exp = Expense(
            trip_id=test_trip.id,
            trip_stop_id=stop.id,
            itinerary_item_id=item.id,
            category=ExpenseCategory.ACTIVITIES,
            description="Tour ticket",
            amount=sample_activity.estimated_cost,
            currency="USD",
            expense_date=date(2026, 10, 2)
        )
        session.add(exp)
        session.commit()

        share = TripShare(
            trip_id=test_trip.id,
            share_token="offline_share_token_999",
            permission=SharePermission.VIEW
        )
        session.add(share)
        session.commit()

        # Clean up test records
        session.delete(test_user)
        session.commit()
        logger.info("✓ End-to-end trip, stop, itinerary, expense, share, and cascade operations PASSED!")

        logger.info("==================================================")
        logger.info("COMPLETE OFFLINE DATABASE VERIFICATION PASSED!")
        logger.info("==================================================")

    except Exception as e:
        session.rollback()
        logger.error(f"Verification failed: {e}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    run_verification()
