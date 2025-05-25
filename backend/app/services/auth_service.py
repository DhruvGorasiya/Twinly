from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.core.config import settings
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password
from app.schemas.user import UserData
from app.models.user import User

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def authenticate_user(self, email: str, password: str):
        user = self.user_repository.get_by_email(email)
        if not user:
            return False
        if not verify_password(password, user.password):
            return False
        return user

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    # def create_user(self, user_data: UserData) -> User:
    #     user_dict = user_data.dict()
    #     return self.user_repository.create(user_dict)
