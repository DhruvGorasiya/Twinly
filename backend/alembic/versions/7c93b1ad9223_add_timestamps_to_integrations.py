"""add_timestamps_to_integrations

Revision ID: 7c93b1ad9223
Revises: 6aaabbb81bf3
Create Date: 2025-05-26 00:43:17.826724

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision: str = '7c93b1ad9223'
down_revision: Union[str, None] = '6aaabbb81bf3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add created_at and updated_at columns to integrations table
    op.add_column('integrations', sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')))
    op.add_column('integrations', sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')))


def downgrade() -> None:
    # Remove the columns if needed to rollback
    op.drop_column('integrations', 'updated_at')
    op.drop_column('integrations', 'created_at')
