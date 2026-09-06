from fastapi import APIRouter, HTTPException, status
from src.schemas.decomposition import PleaRequest, DecompositionResponse
from src.services.gemini_service import gemini_service

router = APIRouter()

@router.post(
    "/decompose", 
    response_model=DecompositionResponse, 
    status_code=status.HTTP_200_OK
)
async def decompose_distress_plea(payload: PleaRequest):
    try:
        result = await gemini_service.decompose_text(payload.rawPlea)
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Decomposition failed: {str(exc)}"
        )