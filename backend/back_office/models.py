from pydantic import BaseModel, EmailStr
from typing import Optional

class BackOfficeCreate(BaseModel):
    nom: str
    prenom: str
    mail: EmailStr
    mot_de_passe: str
    carte_national: str

class BackOfficeUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    mail: Optional[EmailStr] = None
    carte_national: Optional[str] = None
    mot_de_passe: Optional[str] = None  # Peut être mis à jour si fourni
