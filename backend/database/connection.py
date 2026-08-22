import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.core.config import settings
from backend.database.base import Base

logger = logging.getLogger(__name__)

# Authoritative production PostgreSQL database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=False
)

# Ensure all database tables exist
Base.metadata.create_all(bind=engine)

# Auto-seed datasets if countries/cities tables are empty
try:
    from backend.scripts.seed_data import seed_database
    SessionTemp = sessionmaker(bind=engine)
    temp_db = SessionTemp()
    from backend.models.country import Country
    if temp_db.query(Country).count() == 0:
        logger.info("Seeding offline datasets (countries, cities, activities)...")
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
