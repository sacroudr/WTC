from pydantic import BaseModel
from datetime import date

class VoyageCreate(BaseModel):
    id_client: int
    id_chauffeur: int
    id_camion: int
    ice: str
    date_depart: date
    adresse_depart: str
    adresse_arrive: str
    statut: str = "en attente"