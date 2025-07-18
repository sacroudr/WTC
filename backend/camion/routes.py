from fastapi import APIRouter, Depends

from .controller import get_all_camions,get_camions_sans_chauffeurs, get_camion_by_id, create_camion, update_camion, delete_camion, affecter_camion_au_chauffeur

from .models import CamionCreate, CamionUpdate, ChauffeurCamionCreate

from authentification.utils import get_current_user

router = APIRouter(prefix="/camions", tags=["Camions"])

# Route pour récupérer tous les camions
@router.get("/")
def list_camions():
    return get_all_camions()

@router.get("/disponible")
def list_camions_sans_chauffeur():
    return get_camions_sans_chauffeurs()

# Route pour récupérer un camion par son id
@router.get("/{id_camion}")
def list_camion_by_id(id_camion: int):
    return get_camion_by_id(id_camion)

# Route pour créer un camion
@router.post("/new")
def creer_camion(data: CamionCreate, current_user: dict = Depends(get_current_user)):
    return create_camion(data, current_user)

#route pour modifier un camion
@router.put("/update/{id_camion}")
def modifier_camion(id_camion: int, data: CamionUpdate, current_user: dict = Depends(get_current_user)):
    return update_camion(id_camion, data, current_user)

# Route pour supprimer un camion
@router.delete("/delete/{id_camion}")
def supprimer_camion(id_camion: int, current_user: dict = Depends(get_current_user)):
    return delete_camion(id_camion, current_user)

# Route pour lier un chauffeur à un camion
@router.post("/affecter_camion")
def lier_chauffeur_camion(data: ChauffeurCamionCreate):
    return affecter_camion_au_chauffeur(data)