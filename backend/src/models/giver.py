from typing import Optional
from sqlmodel import SQLModel, Field

class GiverUser(SQLModel, table=True):
    __tablename__ = "giver_users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    created_at: str