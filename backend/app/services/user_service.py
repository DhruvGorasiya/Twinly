from typing import Optional
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate, UserData
from app.core.security import get_password_hash
from app.models.user import User

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    # def create_user(self, user_data: UserCreate):
    #     hashed_password = get_password_hash(user_data.password)
    #     user_dict = user_data.dict()
    #     user_dict["password"] = hashed_password
    #     return self.user_repository.create(user_dict)
    
    def create_user(self, user_data: UserData) -> User:
        user_dict = user_data.dict()
        return self.user_repository.create(user_dict)

    def get_user(self, user_id: int):
        return self.user_repository.get(user_id)

    def get_user_by_email(self, email: str):
        return self.user_repository.get_by_email(email)

    def update_user(self, user_id: int, user_data: UserUpdate):
        update_data = user_data.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["password"] = get_password_hash(update_data["password"])
        return self.user_repository.update(user_id, update_data)
    
    def delete_user(self, user_id: int):
        return self.user_repository.delete(user_id)
