"""Enhance user profile and preferences schema

Revision ID: 005_enhance_user_profile_and_preferences
Revises: 004_add_notifications_and_user_activities
Create Date: 2026-08-22 14:54:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '005_enhance_user_profile_and_preferences'
down_revision = '004_add_notifications_and_user_activities'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('phone', sa.String(length=50), nullable=True))
    op.add_column('users', sa.Column('city', sa.String(length=100), nullable=True))
    op.add_column('users', sa.Column('country', sa.String(length=100), nullable=True))

    op.add_column('user_preferences', sa.Column('notifications_enabled', sa.Boolean(), server_default='true', nullable=False))
    op.add_column('user_preferences', sa.Column('budget_alerts_enabled', sa.Boolean(), server_default='true', nullable=False))
    op.add_column('user_preferences', sa.Column('theme', sa.String(length=20), server_default='light', nullable=False))

def downgrade():
    op.drop_column('user_preferences', 'theme')
    op.drop_column('user_preferences', 'budget_alerts_enabled')
    op.drop_column('user_preferences', 'notifications_enabled')

    op.drop_column('users', 'country')
    op.drop_column('users', 'city')
    op.drop_column('users', 'phone')
