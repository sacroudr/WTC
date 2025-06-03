from fastapi import APIRouter

from .controller import get_backoffice_users_controller

router = APIRouter(prefix="/backoffice", tags=["Backoffice"])

@router.get("/")
def get_backoffice_users():
    return {"backoffice_users": get_backoffice_users_controller()}