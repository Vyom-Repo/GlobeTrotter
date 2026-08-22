"""Add countries table and link cities with country_id foreign key

Revision ID: 002_add_countries_and_link_cities
Revises: 001_initial_db_foundation
Create Date: 2026-08-22 10:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_add_countries_and_link_cities'
down_revision: Union[str, None] = '001_initial_db_foundation'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create countries table
    op.create_table(
        'countries',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('iso_code', sa.String(length=2), nullable=False),
        sa.Column('iso3_code', sa.String(length=3), nullable=False),
        sa.Column('region', sa.String(length=50), nullable=False),
        sa.Column('subregion', sa.String(length=50), nullable=True),
        sa.Column('capital', sa.String(length=100), nullable=True),
        sa.Column('currency_code', sa.String(length=3), nullable=True),
        sa.Column('latitude', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('longitude', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('flag_emoji', sa.String(length=10), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name', name='uq_countries_name'),
        sa.UniqueConstraint('iso_code', name='uq_countries_iso_code'),
        sa.UniqueConstraint('iso3_code', name='uq_countries_iso3_code'),
        sa.CheckConstraint('latitude IS NULL OR (latitude >= -90 AND latitude <= 90)', name='chk_country_latitude_range'),
        sa.CheckConstraint('longitude IS NULL OR (longitude >= -180 AND longitude <= 180)', name='chk_country_longitude_range')
    )
    op.create_index('ix_countries_name', 'countries', ['name'], unique=True)
    op.create_index('ix_countries_iso_code', 'countries', ['iso_code'], unique=True)
    op.create_index('ix_countries_iso3_code', 'countries', ['iso3_code'], unique=True)
    op.create_index('ix_countries_region', 'countries', ['region'])
    op.create_index('ix_countries_subregion', 'countries', ['subregion'])
    op.create_index('idx_country_region_subregion', 'countries', ['region', 'subregion'])

    # 2. Modify cities table: add country_id column and foreign key
    op.add_column('cities', sa.Column('country_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index('ix_cities_country_id', 'cities', ['country_id'])

    # Drop old text column index if existing
    try:
        op.drop_index('ix_cities_country', table_name='cities')
        op.drop_index('idx_city_country_region', table_name='cities')
        op.drop_index('idx_city_name_country', table_name='cities')
    except Exception:
        pass

    # Drop old country column
    op.drop_column('cities', 'country')

    # Add foreign key constraint
    op.create_foreign_key('fk_cities_country_id_countries', 'cities', 'countries', ['country_id'], ['id'], ondelete='CASCADE')
    
    # Re-create composite indexes on country_id
    op.create_index('idx_city_country_region', 'cities', ['country_id', 'region'])
    op.create_index('idx_city_name_country', 'cities', ['name', 'country_id'])


def downgrade() -> None:
    # Drop composite indexes
    op.drop_index('idx_city_name_country', table_name='cities')
    op.drop_index('idx_city_country_region', table_name='cities')
    
    # Drop foreign key constraint
    op.drop_constraint('fk_cities_country_id_countries', 'cities', type_='foreignkey')

    # Re-add country text column
    op.add_column('cities', sa.Column('country', sa.String(length=100), nullable=True))
    op.create_index('ix_cities_country', 'cities', ['country'])

    # Drop country_id
    op.drop_index('ix_cities_country_id', table_name='cities')
    op.drop_column('cities', 'country_id')

    # Drop countries table
    op.drop_table('countries')
