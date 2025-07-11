from fastapi import APIRouter

from .controller import get_livraisons_par_numero_voyage, add_suivi, get_suivi_livraison

from .models import SuiviCreate

router = APIRouter(prefix="/suivi", tags=["Suivi"])


#route pour récupérer l'historique de suivi d'une livraison
@router.get("/{numero_livraison}")
def list_suivi_livraison(numero_livraison: str):
    return get_livraisons_par_numero_voyage(numero_livraison)

#permet un historique de suivi 
@router.post("/")
def add_suivi_livraison(data: SuiviCreate):
    return add_suivi(
        id_livraison=data.id_livraison,
        statut=data.statut,
        localisation=data.localisation,
        commentaire=data.commentaire
    )
    
    
@router.get("/{id_livraison}/suivi")
def suivi_livraison(id_livraison: int):
    return get_suivi_livraison(id_livraison)

#route pour récupérer l'historique de suivi d'une livraison par son numero de voyage
# @router.get("/historique/{numero_livraison}")
# def list_suivi_livraison1(numero_livraison: str):
#     return get_suivi_par_numero_voyage(numero_livraison)