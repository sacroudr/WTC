from fastapi import APIRouter

from .controller import create_chauffeur, get_chauffeur_by_id, get_all_chauffeurs, update_chauffeur, delete_chauffeur

from .models import ChauffeurCreate
from .models import ChauffeurUpdate

router = APIRouter(prefix="/chauffeurs", tags=["Chauffeurs"])

#route pour récupérer tous les chauffeurs
@router.get("/")
def recuperer_chauffeurs():
    return get_all_chauffeurs()

#route pour récupérer un chauffeur par son id
@router.get("/{id_chauffeur}")
def lister_chauffeur_par_id(id_chauffeur: int):
    return get_chauffeur_by_id(id_chauffeur)

#route pour créer un chauffeur
@router.post("/new")
def creer_chauffeur(data: ChauffeurCreate):
    return create_chauffeur(data)

#route pour modifier un chauffeur
@router.put("/update/{id_chauffeur}")
def modifier_chauffeur(id_chauffeur: int, data: ChauffeurUpdate):
    return update_chauffeur(id_chauffeur, data)

#route pour supprimer un chauffeur
@router.delete("/delete/{id_chauffeur}")
def supprimer_chauffeur(id_chauffeur: int):
    return delete_chauffeur(id_chauffeur)