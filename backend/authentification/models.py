from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    nom: str
    prenom: str
    carte_national: str
    mail: EmailStr
    mot_de_passe: str
    role: str = 'back-office'  # Default role can be set here

class UserLogin(BaseModel):
    mail: EmailStr
    mot_de_passe: str

class ChangePasswordRequest(BaseModel):
    mail: str
    ancien_mot_de_passe: str
    nouveau_mot_de_passe: str
