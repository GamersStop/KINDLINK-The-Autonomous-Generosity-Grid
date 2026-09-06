import uuid
import hashlib
import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from src.core.database import get_session
from src.models.giver import GiverUser

router = APIRouter()

ACTIVE_GIVER_SESSIONS = {}

def hash_password(password: str) -> str:
    salt = os.getenv("AUTH_SALT", "kindlink_secure_salt_")
    return hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()

class GiverAuthRequest(BaseModel):
    email: str
    password: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup_giver(payload: GiverAuthRequest, session: Session = Depends(get_session)):
    clean_email = payload.email.strip().lower()
    
    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    existing = session.exec(select(GiverUser).where(GiverUser.email == clean_email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please log in."
        )

    try:
        new_giver = GiverUser(
            email=clean_email,
            password_hash=hash_password(payload.password),
            created_at=datetime.utcnow().isoformat() + "Z"
        )
        session.add(new_giver)
        session.commit()
        session.refresh(new_giver)

        token = f"giver_tok_{uuid.uuid4().hex}"
        ACTIVE_GIVER_SESSIONS[token] = {"id": new_giver.id, "email": new_giver.email}

        return {
            "status": "REGISTERED",
            "token": token,
            "email": new_giver.email
        }
    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register user: {str(exc)}"
        )

@router.post("/login")
def login_giver(payload: GiverAuthRequest, session: Session = Depends(get_session)):
    clean_email = payload.email.strip().lower()
    giver = session.exec(select(GiverUser).where(GiverUser.email == clean_email)).first()

    if not giver or giver.password_hash != hash_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = f"giver_tok_{uuid.uuid4().hex}"
    ACTIVE_GIVER_SESSIONS[token] = {"id": giver.id, "email": giver.email}

    return {
        "status": "AUTHENTICATED",
        "token": token,
        "email": giver.email
    }

@router.get("/verify-session")
def verify_session(token: str):
    if token not in ACTIVE_GIVER_SESSIONS:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session token.")
    return {"authenticated": True, "giver": ACTIVE_GIVER_SESSIONS[token]}