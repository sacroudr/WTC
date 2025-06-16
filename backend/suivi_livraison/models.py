from pydantic import BaseModel


class SuiviCreate(BaseModel):
    id_livraison: int
    statut: str
    localisation: str
    commentaire: str = ""