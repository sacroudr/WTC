from pydantic import BaseModel
from typing import Optional

class ChauffeurCreate(BaseModel):
    nom: str
    prenom: str
    mail: Optional[str] = None
    telephone: str
    mot_de_passe: Optional[str] = None
    carte_national: str
    num_permis: str
    disponibilite: bool
    id_camion: int
    
class ChauffeurUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    mail: Optional[str] = None
    telephone: Optional[str] = None
    mot_de_passe: Optional[str] = None
    carte_national: Optional[str] = None
    num_permis: Optional[str] = None
    disponibilite: Optional[bool] = None
    id_camion: Optional[int] = None
