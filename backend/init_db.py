from app.db.database import init_db
from app.core.config import settings

if __name__ == "__main__":
    print("Database URI:", settings.SQLALCHEMY_DATABASE_URI)
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully!") 