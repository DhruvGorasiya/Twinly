from typing import Optional, List
from sqlalchemy.orm import Session
from app.repositories.integration_repository import IntegrationRepository
from app.schemas.integration import IntegrationCreate, IntegrationResponse
from app.models.integrations import ServiceType, IntegrationStatus
from datetime import datetime

class IntegrationService:
    def __init__(self, db: Session):
        self.repository = IntegrationRepository(db)

    def create_integration(self, integration: IntegrationCreate) -> IntegrationResponse:
        # Check if integration already exists
        existing = self.repository.get_by_user_and_service(
            integration.user_id, 
            integration.service_type
        )
        if existing:
            raise ValueError(f"Integration already exists for user {integration.user_id} and service {integration.service_type}")

        # Create the integration
        db_integration = self.repository.create(integration.dict())
        return IntegrationResponse.model_validate(db_integration)

    def get_integration(self, user_id: str, service_type: str) -> Optional[IntegrationResponse]:
        integration = self.repository.get_by_user_and_service(user_id, service_type)
        if not integration:
            return None
        return IntegrationResponse.model_validate(integration)

    def update_integration(self, integration_id: str, update_data: dict) -> Optional[IntegrationResponse]:
        integration = self.repository.update(integration_id, update_data)
        if not integration:
            return None
        return IntegrationResponse.model_validate(integration)

    def delete_integration(self, integration_id: str) -> bool:
        return self.repository.delete(integration_id)

    def list_user_integrations(self, user_id: str) -> List[IntegrationResponse]:
        integrations = self.repository.list_by_user(user_id)
        return [IntegrationResponse.model_validate(integration) for integration in integrations]

    def update_integration_status(self, integration_id: str, status: IntegrationStatus) -> Optional[IntegrationResponse]:
        return self.update_integration(integration_id, {"status": status})

    def update_last_synced(self, integration_id: str) -> Optional[IntegrationResponse]:
        return self.update_integration(integration_id, {"last_synced_at": datetime.utcnow()})
