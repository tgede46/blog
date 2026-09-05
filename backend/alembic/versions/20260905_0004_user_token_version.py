"""add user token version

Revision ID: 20260905_0004
Revises: 20260905_0003
Create Date: 2026-09-05
"""

import sqlalchemy as sa

from alembic import op

revision = "20260905_0004"
down_revision = "20260905_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("token_version", sa.Integer(), server_default="0", nullable=False))
    op.alter_column("users", "token_version", server_default=None)


def downgrade() -> None:
    op.drop_column("users", "token_version")
