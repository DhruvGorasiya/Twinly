from sqlalchemy import Column, String, ForeignKey, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import BaseModel

class Message(BaseModel):
    __tablename__ = "messages"

    # Override the id column from BaseModel to use UUID
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=False)
    sender = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Use string reference for the relationship
    conversation = relationship("Conversation", back_populates="messages")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Validate sender value
        if self.sender not in ['user', 'assistant']:
            raise ValueError("Sender must be either 'user' or 'assistant'") 