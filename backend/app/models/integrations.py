from sqlalchemy import Column, String, TIMESTAMP, Text, JSON, Enum, ForeignKey, ARRAY, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
import uuid
from app.models.base import BaseModel

class IntegrationStatus(enum.Enum):
    active = "active"
    revoked = "revoked"
    expired = "expired"

class ServiceType(enum.Enum):
    GMAIL = "gmail"
    SLACK = "slack"
    OUTLOOK = "outlook"
    GOOGLE_CALENDAR = "google_calendar"
    GOOGLE_SHEETS = "google_sheets"
    TEAMS = "teams"
    NOTION = "notion"

class Integration(BaseModel):
    __tablename__ = "integrations"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # User relationship
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="integrations")
    
    # Service identification
    service_type = Column(Enum(ServiceType), nullable=False)
    external_user_id = Column(String, nullable=False)  # ID from the service
    
    # OAuth2 tokens
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text)
    token_type = Column(String, default="Bearer")
    expires_at = Column(TIMESTAMP)
    
    # Scopes and permissions
    scopes = Column(ARRAY(String))
    
    # Status and sync
    status = Column(Enum(IntegrationStatus), default=IntegrationStatus.active)
    last_synced_at = Column(TIMESTAMP)
    
    # Soft delete
    deleted_at = Column(TIMESTAMP)
    
    # Service specific data
    service_metadata = Column(JSON)  # For storing all service-specific data:
                            # Gmail: {email_address: "user@gmail.com", label_ids: [...], thread_ids: [...]}
                            # Slack: {workspace_id: "T123", channel_ids: [...], workspace_name: "..."}
                            # Outlook: {email_address: "user@outlook.com", folder_ids: [...], message_ids: [...]}
                            # Google Calendar: {calendar_ids: [...], event_ids: [...]}
                            # Google Sheets: {spreadsheet_ids: [...], sheet_ids: [...]}
                            # Teams: {team_id: "...", channel_ids: [...]}
                            # Notion: {workspace_id: "...", database_ids: [...], page_ids: [...]}

    # Unique constraint
    __table_args__ = (
        UniqueConstraint("user_id", "service_type", name="unique_user_service"),
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not isinstance(self.service_type, ServiceType):
            raise ValueError("Invalid service type")
