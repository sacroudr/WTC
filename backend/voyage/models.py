from pydantic import BaseModel
from datetime import date
from typing import Optional

class VoyageCreate(BaseModel):
    id_client: int
    id_chauffeur: int
    id_camion: int
    numero_voyage: Optional[str] = None
    ice: str
    date_depart: date
    adresse_depart: str
    adresse_arrive: str
    statut: str = "en attente"