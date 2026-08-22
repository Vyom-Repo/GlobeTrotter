import logging
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

from backend.core.config import settings
from backend.database.base import Base

logger = logging.getLogger(__name__)

def get_engine():
    pg_url = settings.DATABASE_URL
    try:
        engine = create_engine(pg_url, pool_pre_ping=True, echo=False)
        conn = engine.connect()
        conn.close()
        logger.info(f"Successfully connected to primary database at: {pg_url}")
        return engine
    except Exception as e:
        logger.warning(f"Could not connect to primary database ({pg_url}): {e}")
        logger.info("Falling back to local SQLite database (sqlite:///./globe_trotter.db)...")
        sqlite_url = "sqlite:///./globe_trotter.db"
        sqlite_engine = create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},
            echo=False
        )
        return sqlite_engine

engine = get_engine()

# Ensure all database tables exist
Base.metadata.create_all(bind=engine)

# Auto-seed datasets if countries/cities tables are empty
try:
    from backend.scripts.seed_data import seed_database
    SessionTemp = sessionmaker(bind=engine)
    temp_db = SessionTemp()
    from backend.models.country import Country
    if temp_db.query(Country).count() == 0:
        logger.info("Seeding offline datasets (countries, cities, activities) into SQLite...")
        seed_database(session=temp_db)
    temp_db.close()
except Exception as seed_err:
    logger.warning(f"Auto-seed check note: {seed_err}")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    """Dependency that yields a database session and ensures clean closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
