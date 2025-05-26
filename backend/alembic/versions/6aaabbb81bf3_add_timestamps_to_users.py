"""add_timestamps_to_users

Revision ID: 6aaabbb81bf3
Revises: 6c76f4ce82cd
Create Date: 2025-05-26 00:40:24.589042

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision: str = '6aaabbb81bf3'
down_revision: Union[str, None] = '6c76f4ce82cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')))

def downgrade():
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'created_at')