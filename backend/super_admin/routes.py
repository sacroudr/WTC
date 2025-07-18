from fastapi import APIRouter

from .controller import get_clients_count, get_chauffeurs_count, get_camions_count, get_pending_voyages_count, get_historique_actions


router = APIRouter(prefix="/superadmin", tags=["Superadmin"])


# Récupérer le nombre total de clients
@router.get("/client/count")
def clients_count():
    return get_clients_count()

# Récupérer le nombre total des chauffeurs disponible et indisponible
@router.get("/chauffeur/count")
def chauffeurs_count():
    return get_chauffeurs_count()

# Récupérer le nombre total des camions
@router.get("/camion/count")
def camion_count():
    return get_camions_count()

# Récupérer le nombre de voyages à faire
@router.get("/voyage/count")
def voyage_count():
    return get_pending_voyages_count()

@router.get("/historique-actions")
def historique_actions():
    return get_historique_actions()