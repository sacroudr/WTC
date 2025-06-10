from fastapi import HTTPException
from config.supabase import supabase
from datetime import date

from .models import BackOfficeUpdate

from .utils import hash_password

# Récupère les utilisateurs du back-office
def get_all_backoffice():
    response = supabase.table("utilisateur").select("*").eq("role", "back-office").execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des utilisateurs")
    
    utilisateurs = response.data
    
    for utilisateur in utilisateurs:
        utilisateur.pop("mot_de_passe", None)
       
    return {
        "message": "Liste des back-office récupérée avec succès", "utilisateurs": utilisateurs
    }
    
# Récupère un utilisateur du back-office par son ID
def get_backoffice_by_id(user_id: int):
    response = supabase.table("utilisateur").select("*").eq("id_utilisateur", user_id).eq("role", "back-office").execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Utilisateur back-office non trouvé.")
    
    utilisateur = response.data[0]
    
    # Supprimer le mot de passe avant de retourner les données
    utilisateur.pop("mot_de_passe", None)
    
    return {
        "message": "Utilisateur back-office récupéré avec succès",
        "utilisateur": utilisateur
    }

#Modifier back-office
def update_backoffice(id_utilisateur: int, data: BackOfficeUpdate):
    # Vérifie que l'utilisateur existe et est bien un back-office
    utilisateur = supabase.table("utilisateur").select("*").eq("id_utilisateur", id_utilisateur).eq("role", "back-office").single().execute()

    if not utilisateur.data:
        raise HTTPException(status_code=404, detail="Utilisateur back-office non trouvé")

    fields_to_update = {}

    if data.nom:
        fields_to_update["nom"] = data.nom
    if data.prenom:
        fields_to_update["prenom"] = data.prenom
    if data.mail:
        fields_to_update["mail"] = data.mail
    if data.carte_national:
        fields_to_update["carte_national"] = data.carte_national
    if data.mot_de_passe:
        fields_to_update["mot_de_passe"] = hash_password(data.mot_de_passe)

    if not fields_to_update:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")

    update_response = supabase.table("utilisateur").update(fields_to_update).eq("id_utilisateur", id_utilisateur).execute()

    if not update_response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour")

    utilisateur_mis_a_jour = update_response.data[0]
    utilisateur_mis_a_jour.pop("mot_de_passe", None)

    return {
        "message": "Utilisateur back-office mis à jour avec succès",
        "utilisateur": utilisateur_mis_a_jour
    }
    
# Supprimer un back-office
def delete_backoffice(id_utilisateur: int):
    # Vérifie que l'utilisateur existe et est bien un back-office
    utilisateur = supabase.table("utilisateur").select("*").eq("id_utilisateur", id_utilisateur).eq("role", "back-office").single().execute()

    if not utilisateur.data:
        raise HTTPException(status_code=404, detail="Utilisateur back-office non trouvé")

    delete_response = supabase.table("utilisateur").delete().eq("id_utilisateur", id_utilisateur).execute()

    if not delete_response.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'utilisateur")

    return {
        "message": "Utilisateur back-office supprimé avec succès"
    }