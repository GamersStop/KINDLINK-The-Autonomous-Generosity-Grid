from fastapi import APIRouter
from src.api.v1.endpoints import decompose, missions

api_router = APIRouter()
api_router.include_router(decompose.router, prefix="/aid", tags=["Decomposition"])
api_router.include_router(missions.router, prefix="/aid/missions", tags=["Missions"])