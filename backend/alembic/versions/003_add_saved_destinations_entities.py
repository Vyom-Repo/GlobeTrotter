"""Add countries and activities support to saved_destinations table

Revision ID: 003_saved_destinations_entities
Revises: 002_add_countries_and_link_cities
Create Date: 2026-08-22 13:25:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '003_saved_destinations_entities'
down_revision = '002_add_countries_and_link_cities'
branch_labels = None
depends_on = None

saved_entity_type_enum = postgresql.ENUM('country', 'city', 'activity', name='saved_entity_type_enum')

def upgrade():
    saved_entity_type_enum.create(op.get_bind(), checkfirst=True)

    op.add_column('saved_destinations', sa.Column('entity_type', saved_entity_type_enum, server_default='city', nullable=False))
    op.add_column('saved_destinations', sa.Column('country_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column('saved_destinations', sa.Column('activity_id', postgresql.UUID(as_uuid=True), nullable=True))

    op.alter_column('saved_destinations', 'city_id', existing_type=postgresql.UUID(as_uuid=True), nullable=True)

    op.create_foreign_key('fk_saved_destinations_country_id', 'saved_destinations', 'countries', ['country_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('fk_saved_destinations_activity_id', 'saved_destinations', 'activities', ['activity_id'], ['id'], ondelete='CASCADE')

    op.create_index('ix_saved_destinations_entity_type', 'saved_destinations', ['entity_type'])
    op.create_index('ix_saved_destinations_country_id', 'saved_destinations', ['country_id'])
    op.create_index('ix_saved_destinations_activity_id', 'saved_destinations', ['activity_id'])

    op.create_unique_constraint('uq_saved_destination_user_country', 'saved_destinations', ['user_id', 'country_id'])
    op.create_unique_constraint('uq_saved_destination_user_activity', 'saved_destinations', ['user_id', 'activity_id'])

def downgrade():
    op.drop_constraint('uq_saved_destination_user_activity', 'saved_destinations', type_='unique')
    op.drop_constraint('uq_saved_destination_user_country', 'saved_destinations', type_='unique')

    op.drop_index('ix_saved_destinations_activity_id', table_name='saved_destinations')
    op.drop_index('ix_saved_destinations_country_id', table_name='saved_destinations')
    op.drop_index('ix_saved_destinations_entity_type', table_name='saved_destinations')

    op.drop_constraint('fk_saved_destinations_activity_id', 'saved_destinations', type_='foreignkey')
    op.drop_constraint('fk_saved_destinations_country_id', 'saved_destinations', type_='foreignkey')

    op.alter_column('saved_destinations', 'city_id', existing_type=postgresql.UUID(as_uuid=True), nullable=False)

    op.drop_column('saved_destinations', 'activity_id')
    op.drop_column('saved_destinations', 'country_id')
    op.drop_column('saved_destinations', 'entity_type')

    saved_entity_type_enum.drop(op.get_bind(), checkfirst=True)
