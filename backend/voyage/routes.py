from fastapi import APIRouter

from .controller import get_all_voyages, get_voyages_by_id, create_voyage, get_voyages_by_client, get_voyage_by_client_and_voyage_id

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

#nouvelle route : récupérer les voyages d’un client spécifique
@router.get("/client/{id_client}")
def list_voyages_by_client(id_client: int):
    return get_voyages_by_client(id_client)

# route pour récupérer un voyage d'un client
@router.get("/client/{id_client}/voyage/{id_voyage}")
def get_voyage_by_client(id_client: int, id_voyage: int):
    return get_voyage_by_client_and_voyage_id(id_client, id_voyage)

#route pour créer un voyage
@router.post("/new")
def creer_voyage(data: VoyageCreate):
    return create_voyage(data)