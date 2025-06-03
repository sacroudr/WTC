from fastapi import HTTPException
from config.supabase import supabase

#liste tous les utilisateurs
def get_all_users():
    response = supabase.table("utilisateur").select("*").execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Aucun utilisateur trouvé.")

    utilisateurs = response.data

    # Supprimer le mot de passe de chaque utilisateur
    for utilisateur in utilisateurs:
        utilisateur.pop("mot_de_passe", None)

    return {
        "message": "Liste des utilisateurs récupérée avec succès", "utilisateurs": utilisateurs
    }

#Liste des utilisateurs par id
def get_user_by_id(user_id: int):
    response = supabase.table("utilisateur").select("*").eq("id_utilisateur", user_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé.")
    
    utilisateur = response.data[0]
    
    # Supprimer le mot de passe avant de retourner les données
    utilisateur.pop("mot_de_passe", None)

    return {
        "message": "Utilisateur récupéré avec succès",
        "utilisateur": utilisateur
    }
