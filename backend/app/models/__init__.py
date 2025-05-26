from app.models.base import Base, BaseModel
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.integrations import Integration, ServiceType, IntegrationStatus

# This ensures all models are imported and available when SQLAlchemy initializes
__all__ = ['Base', 'BaseModel', 'User', 'Conversation', 'Message', 'Integration', 'ServiceType', 'IntegrationStatus'] 