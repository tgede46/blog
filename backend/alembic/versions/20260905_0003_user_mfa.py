"""add multi-factor authentication fields

Revision ID: 20260905_0003
Revises: 20260905_0002
Create Date: 2026-09-05
"""

import sqlalchemy as sa

from alembic import op

revision = "20260905_0003"
down_revision = "20260905_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("totp_secret_encrypted", sa.Text(), nullable=True))
    op.add_column("users", sa.Column("totp_pending_secret_encrypted", sa.Text(), nullable=True))
    op.add_column("users", sa.Column("totp_enabled", sa.Boolean(), server_default=sa.false(), nullable=False))
    op.add_column("users", sa.Column("totp_last_used_step", sa.Integer(), nullable=True))
    op.add_column("users", sa.Column("email_mfa_enabled", sa.Boolean(), server_default=sa.false(), nullable=False))
    op.add_column("users", sa.Column("email_otp_hash", sa.String(length=64), nullable=True))
    op.add_column("users", sa.Column("email_otp_expires_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("users", sa.Column("email_otp_sent_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("users", sa.Column("email_otp_attempts", sa.Integer(), server_default="0", nullable=False))
    op.add_column("users", sa.Column("recovery_code_hashes", sa.Text(), nullable=True))
    op.alter_column("users", "totp_enabled", server_default=None)
    op.alter_column("users", "email_mfa_enabled", server_default=None)
    op.alter_column("users", "email_otp_attempts", server_default=None)


def downgrade() -> None:
    op.drop_column("users", "recovery_code_hashes")
    op.drop_column("users", "email_otp_attempts")
    op.drop_column("users", "email_otp_sent_at")
    op.drop_column("users", "email_otp_expires_at")
    op.drop_column("users", "email_otp_hash")
    op.drop_column("users", "email_mfa_enabled")
    op.drop_column("users", "totp_enabled")
    op.drop_column("users", "totp_last_used_step")
    op.drop_column("users", "totp_pending_secret_encrypted")
    op.drop_column("users", "totp_secret_encrypted")
