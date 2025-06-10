from pydantic import BaseModel
from typing import Optional
from datetime import date

class CamionCreate(BaseModel):
    matricule: str
    modele: str
    assurance: str
    fin_validite_assurance: date
    visite_technique: str
    fin_visite_technique: date
    extincteur: bool
    fin_extincteur: date
    
class CamionUpdate(BaseModel):
    matricule: Optional[str] = None
    modele: Optional[str] = None
    assurance: Optional[str] = None
    fin_validite_assurance: Optional[date] = None
    visite_technique: Optional[str] = None
    fin_visite_technique: Optional[date] = None
    extincteur: Optional[bool] = None
    fin_extincteur: Optional[date] = None
