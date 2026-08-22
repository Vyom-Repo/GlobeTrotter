from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """Base declarative class for all SQLAlchemy models in GlobeTrotter."""
    pass

# Import models so Base.metadata is fully populated for Alembic migrations
import backend.models  # noqa
