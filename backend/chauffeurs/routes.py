from fastapi import APIRouter, Depends

from .controller import create_chauffeur, get_chauffeur_by_id, get_all_chauffeurs, get_itineraire_chauffeur, get_voyages_par_chauffeur, update_chauffeur, delete_chauffeur

from .models import ChauffeurCreate
from .models import ChauffeurUpdate

from authentification.utils import get_current_user

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
def creer_chauffeur(data: ChauffeurCreate, current_user: dict = Depends(get_current_user)):
    return create_chauffeur(data, current_user)

#route pour modifier un chauffeur
@router.put("/update/{id_chauffeur}")
def modifier_chauffeur(id_chauffeur: int, data: ChauffeurUpdate, current_user: dict = Depends(get_current_user)):
    return update_chauffeur(id_chauffeur, data, current_user)

# #route pour supprimer un chauffeur
@router.delete("/delete/{id_chauffeur}")
def supprimer_chauffeur(id_chauffeur: int, current_user: dict = Depends(get_current_user)):
    return delete_chauffeur(id_chauffeur, current_user)

@router.get("/{id_utilisateur}/voyages")
def get_chauffeur_voyages(id_utilisateur: int):
    return get_voyages_par_chauffeur(id_utilisateur)

@router.get("/{id_utilisateur}/itineraire")
def get_chauffeur_itineraire(id_utilisateur: int):
    return get_itineraire_chauffeur(id_utilisateur)