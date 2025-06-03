from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class UserOut(BaseModel):
    id: int
    nom: str
    prenom: str
    carte_national: str
    mail: EmailStr
    role: str
    date_creation: Optional[date]