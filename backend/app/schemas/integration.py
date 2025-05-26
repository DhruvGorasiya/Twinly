from pydantic import BaseModel, UUID4
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.integrations import ServiceType, IntegrationStatus

class IntegrationBase(BaseModel):
    user_id: str
    service_type: ServiceType
    external_user_id: str
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "Bearer"
    expires_at: Optional[datetime] = None
    scopes: List[str]
    service_metadata: Dict[str, Any]

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationResponse(IntegrationBase):
    id: UUID4
    status: IntegrationStatus
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    last_synced_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True
