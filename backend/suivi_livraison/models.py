from pydantic import BaseModel


class SuiviCreate(BaseModel):
    id_livraison: int
    statut: str
    localisation: str
    latitude: float | None = None
    longitude: float | None = None
    commentaire: str = ""