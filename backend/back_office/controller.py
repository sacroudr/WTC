from fastapi import HTTPException
from config.supabase import supabase


# Récupère les utilisateurs du back-office
def get_backoffice_users_controller():
    response = supabase.table("utilisateur").select("*").eq("role", "back-office").execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des utilisateurs")
    
    utilisateurs = response.data
    
    return {
        "message": "Liste des back-office récupérée avec succès", "utilisateurs": utilisateurs
    }
