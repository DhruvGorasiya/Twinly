from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.integrations import Integration, ServiceType
from datetime import datetime

class IntegrationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, integration_data: dict) -> Integration:
        db_integration = Integration(**integration_data)
        self.db.add(db_integration)
        self.db.commit()
        self.db.refresh(db_integration)
        return db_integration

    def get_by_id(self, integration_id: str) -> Optional[Integration]:
        return self.db.query(Integration).filter(Integration.id == integration_id).first()

    def get_by_user_and_service(self, user_id: str, service_type: ServiceType) -> Optional[Integration]:

        return self.db.query(Integration).filter(
            Integration.user_id == user_id,
            Integration.service_type == service_type,
            Integration.deleted_at.is_(None)
        ).first()

    def update(self, integration_id: str, update_data: dict) -> Optional[Integration]:
        integration = self.get_by_id(integration_id)
        if integration:
            for key, value in update_data.items():
                setattr(integration, key, value)
            integration.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(integration)
        return integration

    def delete(self, integration_id: str) -> bool:
        integration = self.get_by_id(integration_id)
        if integration:
            integration.deleted_at = datetime.utcnow()
            self.db.commit()
            return True
        return False

    def list_by_user(self, user_id: str) -> List[Integration]:
        return self.db.query(Integration).filter(
            Integration.user_id == user_id,
            Integration.deleted_at.is_(None)
        ).all()
