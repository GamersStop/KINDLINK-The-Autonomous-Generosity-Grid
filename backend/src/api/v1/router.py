from fastapi import APIRouter
from src.api.v1.endpoints import decompose, missions,volunteers,sentinel,ngo,giver_auth,admin

api_router = APIRouter()
api_router.include_router(decompose.router, prefix="/aid", tags=["Decomposition"])
api_router.include_router(missions.router, prefix="/aid/missions", tags=["Missions"])
api_router.include_router(volunteers.router, prefix="/volunteers", tags=["Volunteers"])
api_router.include_router(sentinel.router, prefix="/sentinel", tags=["Sentinel"])
api_router.include_router(ngo.router, prefix="/ngo-auth", tags=["NGO Onboarding"])
api_router.include_router(giver_auth.router, prefix="/giver-auth", tags=["Giver Auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])