from fastapi import APIRouter
from .controller import get_user_by_id, get_all_users

router = APIRouter(prefix="/utilisateurs", tags=["Utilisateurs"])

#route pour lister tous les utilisateurs
@router.get("/")
def list_users():
    return get_all_users()

#route pour lister les utilisateurs par id
@router.get("/{user_id}")
def get_user_id(user_id: int):
    return get_user_by_id(user_id)
