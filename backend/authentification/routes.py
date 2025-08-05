from fastapi import APIRouter

from .models import ChangePasswordRequest, UserCreate, UserLogin

from .controller import change_password, register_user, login_chauffeur
from .controller import login_user as login_user_controller  # alias

router = APIRouter(prefix="/utilisateurs", tags=["Utilisateurs"])

@router.post("/signup/")
def create_user(user: UserCreate):
    return register_user(user)

@router.post("/login/")
def login_user(user: UserLogin):
    return login_user_controller(user)

@router.post("/login/chauffeur/")
def login_pour_chauffeur(user: UserLogin):
    return login_chauffeur(user)

@router.post("/auth/change-password")
def route_change_password(data: ChangePasswordRequest):
    return change_password(data)