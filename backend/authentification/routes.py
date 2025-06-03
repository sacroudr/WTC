from fastapi import APIRouter
from .models import UserCreate, UserLogin
from .controller import register_user
from .controller import login_user as login_user_controller  # alias

router = APIRouter(prefix="/utilisateurs", tags=["Utilisateurs"])

@router.post("/signup/")
def create_user(user: UserCreate):
    return register_user(user)

@router.post("/login/")
def login_user(user: UserLogin):
    return login_user_controller(user)