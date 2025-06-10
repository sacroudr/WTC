from fastapi import APIRouter

from .controller import get_all_camions, get_camion_by_id, create_camion, update_camion, delete_camion

from .models import CamionCreate, CamionUpdate

router = APIRouter(prefix="/camions", tags=["Camions"])

# Route pour récupérer tous les camions
@router.get("/")
def list_camions():
    return get_all_camions()

# Route pour récupérer un camion par son id
@router.get("/{id_camion}")
def list_camion_by_id(id_camion: int):
    return get_camion_by_id(id_camion)

# Route pour créer un camion
@router.post("/new")
def creer_camion(data: CamionCreate):
    return create_camion(data)

#route pour modifier un camion
@router.put("/update/{id_camion}")
def modifier_camion(id_camion: int, data: CamionUpdate):
    return update_camion(id_camion, data)

# Route pour supprimer un camion
@router.delete("/delete/{id_camion}")
def supprimer_camion(id_camion: int):
    return delete_camion(id_camion)