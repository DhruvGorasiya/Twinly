from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models import Base, User, Conversation, Message

# Create SQLAlchemy engine
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency for getting DB session"""
    db = SessionLocal()
    print("Database session created")  # Debug log
    try:
        yield db
    finally:
        print("Database session closed")  # Debug log
        db.close()

def init_db():
    """Initialize the database by creating all tables"""
    # Create schema if it doesn't exist
    with engine.connect() as conn:
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS public"))
        conn.commit()
    
    # Create all tables
    Base.metadata.create_all(bind=engine) 