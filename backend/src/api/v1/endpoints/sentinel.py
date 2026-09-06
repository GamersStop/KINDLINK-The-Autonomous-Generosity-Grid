from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from src.core.database import get_session
from src.schemas.sentinel import SentinelAuditRequest, SentinelAuditResponse
from src.services.sentinel_service import sentinel_service

router = APIRouter()

@router.get("/calm-audio")
async def get_calm_audio(prompt_type: str = "request_camera"):
    """Returns pre-recorded/generated voice bytes for immediate feedback."""
    text = (
        "We are here to help. Please enable your camera feed so we can assess your situation."
        if prompt_type == "request_camera"
        else "Please stay calm. Our AI is analyzing the footage and dispatching immediate aid."
    )
    audio_b64 = await sentinel_service.generate_speech(text)
    return {"audioBase64": audio_b64, "text": text}

@router.post(
    "/audit-broadcast",
    response_model=SentinelAuditResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Audit 10-second camera frames, broadcast to DB, and return safety directives"
)
async def audit_and_broadcast(
    payload: SentinelAuditRequest,
    session: Session = Depends(get_session)
):
    try:
        return await sentinel_service.audit_and_broadcast(session, payload)
    except Exception as exc:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sentinel audit failed: {str(exc)}"
        )