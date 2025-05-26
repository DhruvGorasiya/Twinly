from sqlalchemy import Column, String, Boolean, Integer, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel
from datetime import datetime


class User(BaseModel):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Use string reference for the relationship
    conversations = relationship("Conversation", back_populates="user", lazy="dynamic")
    integrations = relationship("Integration", back_populates="user", lazy="dynamic") 