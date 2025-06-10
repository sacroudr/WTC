from fastapi import APIRouter

from .controller import get_all_clients, get_client_by_id, create_client, update_client, delete_client

from .models import ClientCreate, ClientUpdate

router = APIRouter(prefix="/client", tags=["Client"])

#route pour lister tous les clients
@router.get("/")
def recuperer_client():
    return get_all_clients()

#route pour lister un client par son id
@router.get("/{id_client}")
def lister_client_par_id(id_client: int):
    return get_client_by_id(id_client)

#route pour créer un client
@router.post("/new")
def creer_client(data: ClientCreate):
    return create_client(data)

#route pour modifier un client
@router.put("/update/{id_client}")
def modifier_client(id_client: int, data: ClientUpdate):
    return update_client(id_client, data)

#route pour supprimer un client
@router.delete("/delete/{id_client}")
def supprimer_client(id_client: int):
    return delete_client(id_client)