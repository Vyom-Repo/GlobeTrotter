import sys
import json
import logging
from pathlib import Path
from decimal import Decimal

# Add root directory to sys.path
root_dir = Path(__file__).resolve().parents[2]
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

from backend.core.config import settings
from backend.database.base import Base
from backend.models.country import Country
from backend.models.city import City
from backend.models.activity import Activity

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parents[1] / "data"

def load_json_data():
    """Load static local dataset JSON files."""
    countries_file = DATA_DIR / "countries.json"
    cities_file = DATA_DIR / "cities.json"
    activities_file = DATA_DIR / "activities.json"

    if not (countries_file.exists() and cities_file.exists() and activities_file.exists()):
        raise FileNotFoundError(
            f"Missing required offline dataset files in {DATA_DIR}. "
            f"Please run 'python -m backend.scripts.generate_dataset' first."
        )

    with open(countries_file, "r", encoding="utf-8") as f:
        countries_data = json.load(f)

    with open(cities_file, "r", encoding="utf-8") as f:
        cities_data = json.load(f)

    with open(activities_file, "r", encoding="utf-8") as f:
        activities_data = json.load(f)

    return countries_data, cities_data, activities_data

def validate_datasets(countries_data, cities_data, activities_data):
    """Validate data integrity before inserting. Fail loudly if corrupt data is found."""
    logger.info("Validating local static dataset integrity...")

    # Validate Countries
    iso_codes = set()
    iso3_codes = set()
    country_names = set()

    for c in countries_data:
        if c["iso_code"] in iso_codes:
            raise ValueError(f"Duplicate country ISO code detected: {c['iso_code']}")
        if c["iso3_code"] in iso3_codes:
            raise ValueError(f"Duplicate country ISO3 code detected: {c['iso3_code']}")
        if c["name"] in country_names:
            raise ValueError(f"Duplicate country name detected: {c['name']}")

        iso_codes.add(c["iso_code"])
        iso3_codes.add(c["iso3_code"])
        country_names.add(c["name"])

        lat, lng = c.get("latitude"), c.get("longitude")
        if lat is not None and (lat < -90 or lat > 90):
            raise ValueError(f"Invalid country latitude for {c['name']}: {lat}")
        if lng is not None and (lng < -180 or lng > 180):
            raise ValueError(f"Invalid country longitude for {c['name']}: {lng}")

    logger.info(f"✓ Validated {len(countries_data)} countries (0 duplicates)")

    # Validate Cities
    city_keys = set()
    for ct in cities_data:
        if ct["country_iso_code"] not in iso_codes:
            raise ValueError(f"City '{ct['name']}' references unknown country ISO: {ct['country_iso_code']}")

        city_key = (ct["name"].lower(), ct["country_iso_code"])
        city_keys.add(city_key)

        cost_idx = ct.get("cost_index")
        if cost_idx is not None and cost_idx < 0:
            raise ValueError(f"Invalid negative cost_index for city '{ct['name']}': {cost_idx}")

    logger.info(f"✓ Validated {len(cities_data)} cities (All reference valid countries)")

    # Validate Activities
    for act in activities_data:
        c_key = (act["city_name"].lower(), act["country_iso_code"])
        if c_key not in city_keys:
            raise ValueError(f"Activity '{act['name']}' references unknown city/country key: {c_key}")

        cost = act.get("estimated_cost", 0)
        if cost < 0:
            raise ValueError(f"Invalid negative estimated_cost for activity '{act['name']}': {cost}")

        dur = act.get("duration_minutes")
        if dur is not None and dur <= 0:
            raise ValueError(f"Invalid non-positive duration_minutes for activity '{act['name']}': {dur}")

    logger.info(f"✓ Validated {len(activities_data)} activities (All reference valid cities)")


def seed_database(session=None):
    """Idempotently seed countries, cities, and activities from local static dataset files."""
    countries_data, cities_data, activities_data = load_json_data()
    validate_datasets(countries_data, cities_data, activities_data)

    own_session = False
    if session is None:
        own_session = True
        pg_engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
        try:
            conn = pg_engine.connect()
            conn.close()
            engine_to_use = pg_engine
            logger.info(f"Seeding target PostgreSQL database at: {settings.DATABASE_URL}")
        except OperationalError:
            logger.warning(f"Target PostgreSQL database at '{settings.DATABASE_URL}' is currently offline.")
            logger.info("Using in-memory test engine for seed validation...")
            engine_to_use = create_engine("sqlite:///:memory:", echo=False)
            Base.metadata.create_all(bind=engine_to_use)

        SeedSession = sessionmaker(autocommit=False, autoflush=False, bind=engine_to_use)
        session = SeedSession()

    try:
        logger.info("Starting database seeding process...")
        countries_inserted = 0
        cities_inserted = 0
        activities_inserted = 0

        # 1. Seed Countries
        country_id_map = {}  # iso_code -> country_id
        for c in countries_data:
            existing_country = session.query(Country).filter(Country.iso_code == c["iso_code"]).first()
            if not existing_country:
                country = Country(
                    name=c["name"],
                    iso_code=c["iso_code"],
                    iso3_code=c["iso3_code"],
                    region=c["region"],
                    subregion=c.get("subregion"),
                    capital=c.get("capital"),
                    currency_code=c.get("currency_code"),
                    latitude=Decimal(str(c["latitude"])) if c.get("latitude") is not None else None,
                    longitude=Decimal(str(c["longitude"])) if c.get("longitude") is not None else None,
                    flag_emoji=c.get("flag_emoji"),
                    description=c.get("description")
                )
                session.add(country)
                session.flush()
                country_id_map[c["iso_code"]] = country.id
                countries_inserted += 1
            else:
                country_id_map[c["iso_code"]] = existing_country.id

        session.commit()
        logger.info(f"Countries processing complete: {countries_inserted} newly inserted, {len(country_id_map)} total in map.")

        # 2. Seed Cities
        city_id_map = {}  # (city_name.lower(), country_iso_code) -> city_id
        for ct in cities_data:
            c_id = country_id_map[ct["country_iso_code"]]
            existing_city = session.query(City).filter(
                City.country_id == c_id,
                City.name == ct["name"]
            ).first()

            c_key = (ct["name"].lower(), ct["country_iso_code"])

            if not existing_city:
                city = City(
                    country_id=c_id,
                    name=ct["name"],
                    region=ct.get("region"),
                    description=ct.get("description"),
                    image_url=ct.get("image_url"),
                    cost_index=Decimal(str(ct["cost_index"])) if ct.get("cost_index") is not None else None,
                    popularity_score=Decimal(str(ct["popularity_score"])) if ct.get("popularity_score") is not None else None,
                    latitude=Decimal(str(ct["latitude"])) if ct.get("latitude") is not None else None,
                    longitude=Decimal(str(ct["longitude"])) if ct.get("longitude") is not None else None
                )
                session.add(city)
                session.flush()
                city_id_map[c_key] = city.id
                cities_inserted += 1
            else:
                city_id_map[c_key] = existing_city.id

        session.commit()
        logger.info(f"Cities processing complete: {cities_inserted} newly inserted, {len(city_id_map)} total in map.")

        # 3. Seed Activities
        for act in activities_data:
            c_key = (act["city_name"].lower(), act["country_iso_code"])
            city_id = city_id_map[c_key]

            existing_act = session.query(Activity).filter(
                Activity.city_id == city_id,
                Activity.name == act["name"]
            ).first()

            if not existing_act:
                activity = Activity(
                    city_id=city_id,
                    name=act["name"],
                    description=act.get("description"),
                    activity_type=act["activity_type"],
                    estimated_cost=Decimal(str(act["estimated_cost"])) if act.get("estimated_cost") is not None else Decimal("0"),
                    currency=act.get("currency", "USD"),
                    duration_minutes=act.get("duration_minutes"),
                    image_url=act.get("image_url"),
                    popularity_score=Decimal(str(act["popularity_score"])) if act.get("popularity_score") is not None else None
                )
                session.add(activity)
                activities_inserted += 1

        session.commit()
        logger.info(f"Activities processing complete: {activities_inserted} newly inserted.")

        total_countries = session.query(Country).count()
        total_cities = session.query(City).count()
        total_activities = session.query(Activity).count()

        logger.info("==================================================")
        logger.info(f"DATABASE SEEDING COMPLETE!")
        logger.info(f"  Countries in DB:  {total_countries}")
        logger.info(f"  Cities in DB:     {total_cities}")
        logger.info(f"  Activities in DB: {total_activities}")
        logger.info("==================================================")

    except Exception as e:
        session.rollback()
        logger.error(f"Seeding failed: {e}")
        raise
    finally:
        if own_session:
            session.close()

if __name__ == "__main__":
    seed_database()
