from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class GmailMetadata(BaseModel):
    email_address: EmailStr
    label_ids: List[str] = []
    thread_ids: List[str] = []

class GmailIntegrationCreate(BaseModel):
    user_id: str
    external_user_id: str
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "Bearer"
    expires_at: Optional[datetime] = None
    scopes: List[str]
    service_metadata: GmailMetadata

class GmailIntegrationResponse(BaseModel):
    id: str
    user_id: str
    service_type: str = "gmail"
    external_user_id: str
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str
    expires_at: Optional[datetime] = None
    scopes: List[str]
    status: str
    service_metadata: GmailMetadata
    created_at: datetime
    updated_at: datetime
    last_synced_at: Optional[datetime] = None

    class Config:
        from_attributes = True
