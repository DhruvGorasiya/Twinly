from app.models.base import BaseModel
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message

# This ensures all models are imported and available when SQLAlchemy initializes
__all__ = ['BaseModel', 'User', 'Conversation', 'Message'] 