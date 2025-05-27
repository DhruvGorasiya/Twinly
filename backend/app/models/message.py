from sqlalchemy import Column, String, ForeignKey, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.dialects.postgresql import FLOAT
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from datetime import datetime
from app.models.base import BaseModel

class Message(BaseModel):
    __tablename__ = "messages"

    # Core fields
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"))
    sender = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    
    # Timestamps
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Enhanced fields
    message_metadata = Column(JSON, nullable=True)  # Renamed from 'metadata' to 'message_metadata'
    embedding = Column(ARRAY(FLOAT), nullable=True)  # For vector embeddings
    source = Column(String, default="chat")  # 'chat', 'gmail', 'notion', 'slack', etc.

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Validate sender value
        if self.sender not in ['user', 'assistant']:
            raise ValueError("Sender must be either 'user' or 'assistant'")
        
        # Validate source if provided
        valid_sources = ['chat', 'gmail', 'notion', 'slack', 'calendar']
        if self.source and self.source not in valid_sources:
            raise ValueError(f"Source must be one of: {', '.join(valid_sources)}")

    def to_dict(self):
        """Convert message to dictionary for API responses"""
        return {
            "id": str(self.id),
            "conversation_id": str(self.conversation_id),
            "sender": self.sender,
            "content": self.content,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "metadata": self.message_metadata,  # Keep the API response field as 'metadata'
            "source": self.source
        } 