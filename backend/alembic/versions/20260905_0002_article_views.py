"""add article view counters

Revision ID: 20260905_0002
Revises: 20260603_0001
Create Date: 2026-09-05
"""
from alembic import op
import sqlalchemy as sa


revision = "20260905_0002"
down_revision = "20260603_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("articles", sa.Column("views", sa.Integer(), server_default="0", nullable=False))
    op.alter_column("articles", "views", server_default=None)


def downgrade() -> None:
    op.drop_column("articles", "views")
