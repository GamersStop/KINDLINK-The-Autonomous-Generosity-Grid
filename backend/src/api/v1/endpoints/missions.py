from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session
from src.schemas.mission import MissionBroadcastRequest, MissionBroadcastResponse
from src.services.mission_service import mission_service
from src.core.database import get_session

router = APIRouter()

@router.post(
    "/broadcast",
    response_model=MissionBroadcastResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Publish decomposed plea and commit to PostgreSQL"
)
def broadcast_mission(
    payload: MissionBroadcastRequest, 
    session: Session = Depends(get_session)
):
    try:
        return mission_service.broadcast_mission(session, payload)
    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database commit failure: {str(exc)}"
        )

@router.get(
    "/feed",
    summary="Fetch all active missions from PostgreSQL"
)
def get_missions_feed(session: Session = Depends(get_session)):
    return mission_service.get_all_missions(session)