import logging
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings
from backend.database.base import Base

logger = logging.getLogger(__name__)

def create_db_engine():
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            echo=False
        )
        with engine.connect() as conn:
            pass
        logger.info(f"Connected to primary database at {settings.DATABASE_URL}")
        return engine
    except Exception as e:
        db_path = Path(__file__).resolve().parents[1] / "globetrotter.db"
        sqlite_url = f"sqlite:///{db_path}"
        logger.warning(f"Primary database offline ({e}). Falling back to local SQLite database at {sqlite_url}")
        engine = create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},
            echo=False
        )
        Base.metadata.create_all(bind=engine)
        return engine

engine = create_db_engine()

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
