from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.models.base import BaseModel

class Conversation(BaseModel):
    __tablename__ = "conversations"

    # Override the id column from BaseModel to use UUID
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=True)

    # Use string reference for the relationship
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", lazy="dynamic")