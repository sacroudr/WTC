from fastapi import APIRouter

from .controller import get_all_backoffice, get_backoffice_by_id, update_backoffice, delete_backoffice, create_backoffice

from .models import BackOfficeUpdate, BackOfficeCreate

router = APIRouter(prefix="/backoffice", tags=["Backoffice"])

# route pour créer un nouveau back-office
@router.post("/new")
def creer_backoffice(data: BackOfficeCreate):
    return create_backoffice(data)
#route pour lister tous les utilisateurs
@router.get("/")
def list_backoffice():
    return {"backoffice_users": get_all_backoffice()}

#route pour lister les utilisateurs par id
@router.get("/{user_id}")
def get_backoffice_id(user_id: int):
    return {"backoffice_user": get_backoffice_by_id(user_id)}

#route pour modifier les info du back-office
@router.put("/update/{id_utilisateur}")
def modifier_backoffice(id_utilisateur: int, data: BackOfficeUpdate):
    return update_backoffice(id_utilisateur, data)

#route pour supprimer le back-office
@router.delete("/delete/{id_utilisateur}")
def supprimer_backoffice(id_utilisateur: int):
    return delete_backoffice(id_utilisateur)
