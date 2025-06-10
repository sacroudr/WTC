from fastapi import APIRouter

from .controller import get_all_voyages, get_voyages_by_id, create_voyage

from .models import VoyageCreate

router = APIRouter(prefix="/voyages", tags=["Voyages"])

#route pour récupérer tous les voyages
@router.get("/")
def list_voyages():
    return get_all_voyages()

#route pour récupérer un voyage par son id
@router.get("/{id_voyage}")
def list_voyage_by_id(id_voyage: int):
    return get_voyages_by_id(id_voyage)

#route pour créer un voyage
@router.post("/new")
def creer_voyage(data: VoyageCreate):
    return create_voyage(data)