"""Add reports table for content moderation

Revision ID: 006_add_reports_table
Revises: 005_enhance_user_profile_and_preferences
Create Date: 2026-08-22 14:58:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '006_add_reports_table'
down_revision = '005_enhance_user_profile_and_preferences'
branch_labels = None
depends_on = None

def upgrade():
    report_target_type = postgresql.ENUM('PUBLIC_TRIP', 'SHARED_LINK', 'USER', name='report_target_type_enum')
    report_target_type.create(op.get_bind(), checkfirst=True)

    report_status = postgresql.ENUM('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED', name='report_status_enum')
    report_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        'reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('reporter_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_type', sa.Enum('PUBLIC_TRIP', 'SHARED_LINK', 'USER', name='report_target_type_enum'), nullable=False),
        sa.Column('target_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reason', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED', name='report_status_enum'), nullable=False, server_default='PENDING'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('resolver_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
    )

    op.create_index('idx_report_status_target', 'reports', ['status', 'target_type', 'target_id'])

def downgrade():
    op.drop_index('idx_report_status_target', table_name='reports')
    op.drop_table('reports')
    op.execute("DROP TYPE IF EXISTS report_status_enum")
    op.execute("DROP TYPE IF EXISTS report_target_type_enum")
