"""Initial database foundation for GlobeTrotter (10 Core Tables)

Revision ID: 001_initial_db_foundation
Revises: 
Create Date: 2026-08-22 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_db_foundation'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Define Enum types
trip_visibility_enum = postgresql.ENUM('private', 'shared', 'public', name='trip_visibility_enum')
expense_category_enum = postgresql.ENUM('transport', 'accommodation', 'activities', 'meals', 'other', name='expense_category_enum')
share_permission_enum = postgresql.ENUM('view', 'copy', name='share_permission_enum')


def upgrade() -> None:
    # Create Enum types
    trip_visibility_enum.create(op.get_bind(), checkfirst=True)
    expense_category_enum.create(op.get_bind(), checkfirst=True)
    share_permission_enum.create(op.get_bind(), checkfirst=True)

    # 1. users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('profile_photo_url', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('is_admin', sa.Boolean(), server_default=sa.text('false'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email', name='uq_users_email')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # 2. user_preferences
    op.create_table(
        'user_preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('language', sa.String(length=10), server_default=sa.text("'en'"), nullable=False),
        sa.Column('currency', sa.String(length=3), server_default=sa.text("'INR'"), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', name='uq_user_preferences_user_id')
    )
    op.create_index('ix_user_preferences_user_id', 'user_preferences', ['user_id'], unique=True)

    # 3. cities
    op.create_table(
        'cities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('country', sa.String(length=100), nullable=False),
        sa.Column('country_code', sa.String(length=2), nullable=True),
        sa.Column('region', sa.String(length=100), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('cost_index', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('popularity_score', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('latitude', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('longitude', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('cost_index IS NULL OR cost_index >= 0', name='chk_city_cost_index_positive'),
        sa.CheckConstraint('popularity_score IS NULL OR popularity_score >= 0', name='chk_city_popularity_positive'),
        sa.CheckConstraint('latitude IS NULL OR (latitude >= -90 AND latitude <= 90)', name='chk_city_latitude_range'),
        sa.CheckConstraint('longitude IS NULL OR (longitude >= -180 AND longitude <= 180)', name='chk_city_longitude_range')
    )
    op.create_index('ix_cities_name', 'cities', ['name'])
    op.create_index('ix_cities_country', 'cities', ['country'])
    op.create_index('ix_cities_region', 'cities', ['region'])
    op.create_index('ix_cities_cost_index', 'cities', ['cost_index'])
    op.create_index('ix_cities_popularity_score', 'cities', ['popularity_score'])
    op.create_index('idx_city_country_region', 'cities', ['country', 'region'])
    op.create_index('idx_city_name_country', 'cities', ['name', 'country'])

    # 4. activities
    op.create_table(
        'activities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('city_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('activity_type', sa.String(length=50), nullable=False),
        sa.Column('estimated_cost', sa.Numeric(precision=12, scale=2), server_default=sa.text('0'), nullable=False),
        sa.Column('currency', sa.String(length=3), server_default=sa.text("'INR'"), nullable=False),
        sa.Column('duration_minutes', sa.Integer(), nullable=True),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('popularity_score', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['city_id'], ['cities.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('estimated_cost >= 0', name='chk_activity_estimated_cost_positive'),
        sa.CheckConstraint('duration_minutes IS NULL OR duration_minutes > 0', name='chk_activity_duration_positive'),
        sa.CheckConstraint('popularity_score IS NULL OR popularity_score >= 0', name='chk_activity_popularity_positive')
    )
    op.create_index('ix_activities_city_id', 'activities', ['city_id'])
    op.create_index('ix_activities_activity_type', 'activities', ['activity_type'])
    op.create_index('ix_activities_estimated_cost', 'activities', ['estimated_cost'])
    op.create_index('ix_activities_popularity_score', 'activities', ['popularity_score'])
    op.create_index('idx_activity_city_type', 'activities', ['city_id', 'activity_type'])

    # 5. trips
    op.create_table(
        'trips',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('cover_photo_url', sa.Text(), nullable=True),
        sa.Column('budget_limit', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('currency', sa.String(length=3), server_default=sa.text("'INR'"), nullable=False),
        sa.Column('visibility', trip_visibility_enum, server_default=sa.text("'private'"), nullable=False),
        sa.Column('share_token', sa.String(length=64), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('share_token', name='uq_trips_share_token'),
        sa.CheckConstraint('start_date <= end_date', name='chk_trip_date_range'),
        sa.CheckConstraint('budget_limit IS NULL OR budget_limit >= 0', name='chk_trip_budget_limit_positive')
    )
    op.create_index('ix_trips_user_id', 'trips', ['user_id'])
    op.create_index('ix_trips_start_date', 'trips', ['start_date'])
    op.create_index('ix_trips_visibility', 'trips', ['visibility'])
    op.create_index('ix_trips_share_token', 'trips', ['share_token'])

    # 6. trip_stops
    op.create_table(
        'trip_stops',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('trip_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('city_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('stop_order', sa.Integer(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['city_id'], ['cities.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('trip_id', 'stop_order', name='uq_trip_stop_order'),
        sa.CheckConstraint('start_date <= end_date', name='chk_stop_date_range'),
        sa.CheckConstraint('stop_order > 0', name='chk_stop_order_positive')
    )
    op.create_index('ix_trip_stops_trip_id', 'trip_stops', ['trip_id'])
    op.create_index('ix_trip_stops_city_id', 'trip_stops', ['city_id'])
    op.create_index('idx_trip_stop_trip_order', 'trip_stops', ['trip_id', 'stop_order'])

    # 7. itinerary_items
    op.create_table(
        'itinerary_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('trip_stop_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('activity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('scheduled_date', sa.Date(), nullable=False),
        sa.Column('start_time', sa.Time(), nullable=True),
        sa.Column('end_time', sa.Time(), nullable=True),
        sa.Column('item_order', sa.Integer(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('estimated_cost', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['trip_stop_id'], ['trip_stops.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('trip_stop_id', 'scheduled_date', 'item_order', name='uq_itinerary_item_order_per_day'),
        sa.CheckConstraint('item_order > 0', name='chk_itinerary_item_order_positive'),
        sa.CheckConstraint('estimated_cost IS NULL OR estimated_cost >= 0', name='chk_itinerary_cost_non_negative'),
        sa.CheckConstraint('start_time IS NULL OR end_time IS NULL OR start_time < end_time', name='chk_itinerary_time_range')
    )
    op.create_index('ix_itinerary_items_trip_stop_id', 'itinerary_items', ['trip_stop_id'])
    op.create_index('ix_itinerary_items_activity_id', 'itinerary_items', ['activity_id'])
    op.create_index('ix_itinerary_items_scheduled_date', 'itinerary_items', ['scheduled_date'])
    op.create_index('idx_itinerary_stop_date', 'itinerary_items', ['trip_stop_id', 'scheduled_date'])

    # 8. expenses
    op.create_table(
        'expenses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('trip_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('trip_stop_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('itinerary_item_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('category', expense_category_enum, nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('currency', sa.String(length=3), server_default=sa.text("'INR'"), nullable=False),
        sa.Column('expense_date', sa.Date(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['itinerary_item_id'], ['itinerary_items.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['trip_stop_id'], ['trip_stops.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('amount >= 0', name='chk_expense_amount_non_negative')
    )
    op.create_index('ix_expenses_trip_id', 'expenses', ['trip_id'])
    op.create_index('ix_expenses_trip_stop_id', 'expenses', ['trip_stop_id'])
    op.create_index('ix_expenses_itinerary_item_id', 'expenses', ['itinerary_item_id'])
    op.create_index('ix_expenses_category', 'expenses', ['category'])
    op.create_index('ix_expenses_expense_date', 'expenses', ['expense_date'])

    # 9. saved_destinations
    op.create_table(
        'saved_destinations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('city_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['city_id'], ['cities.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'city_id', name='uq_saved_destination_user_city')
    )
    op.create_index('ix_saved_destinations_user_id', 'saved_destinations', ['user_id'])
    op.create_index('ix_saved_destinations_city_id', 'saved_destinations', ['city_id'])

    # 10. trip_shares
    op.create_table(
        'trip_shares',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('trip_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('shared_with_user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('share_token', sa.String(length=64), nullable=False),
        sa.Column('permission', share_permission_enum, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['shared_with_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('share_token', name='uq_trip_shares_share_token'),
        sa.CheckConstraint('expires_at IS NULL OR expires_at > created_at', name='chk_share_expires_after_created')
    )
    op.create_index('ix_trip_shares_trip_id', 'trip_shares', ['trip_id'])
    op.create_index('ix_trip_shares_shared_with_user_id', 'trip_shares', ['shared_with_user_id'])
    op.create_index('ix_trip_shares_share_token', 'trip_shares', ['share_token'])


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('trip_shares')
    op.drop_table('saved_destinations')
    op.drop_table('expenses')
    op.drop_table('itinerary_items')
    op.drop_table('trip_stops')
    op.drop_table('trips')
    op.drop_table('activities')
    op.drop_table('cities')
    op.drop_table('user_preferences')
    op.drop_table('users')

    # Drop Enum types
    share_permission_enum.drop(op.get_bind(), checkfirst=True)
    expense_category_enum.drop(op.get_bind(), checkfirst=True)
    trip_visibility_enum.drop(op.get_bind(), checkfirst=True)
