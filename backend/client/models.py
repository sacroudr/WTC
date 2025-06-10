from pydantic import BaseModel
from typing import Optional

class ClientCreate(BaseModel):
    nom: str
    prenom: str
    mail: Optional[str] = None
    mot_de_passe: Optional[str] = None
    carte_national: str
    entreprise: str
    adresse: str
    telephone: str
    
class ClientUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    mail: Optional[str] = None
    carte_national: Optional[str] = None
    entreprise: Optional[str] = None
    adresse: Optional[str] = None
    telephone: Optional[str] = None