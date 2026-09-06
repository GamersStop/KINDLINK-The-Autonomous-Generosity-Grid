import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://kindlink:kindlink_secret_password@db:5432/kindlink_db"
)

# Standard synchronous engine with connection pooling and stale socket check
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,  # Re-connects if the DB dropped the connection
    pool_size=10,
    max_overflow=20
)

def init_db():
    """Initializes tables on container startup"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency injecting DB sessions into route handlers"""
    with Session(engine) as session:
        yield session