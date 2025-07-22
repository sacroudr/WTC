from datetime import datetime
from fastapi import HTTPException
from config.supabase import supabase
import json

from .models import CamionCreate, CamionUpdate, ChauffeurCamionCreate

#permet de récupérer tous les camions
def get_all_camions():
    try:
        response = supabase.table("camion").select(
            """
            *,
            chauffeur_camion (
                *,
                chauffeur (
                    *,
                    utilisateur (
                        nom,
                        prenom
                    )
                )
            )
            """
        ).execute()

        if not response.data:
            return {"message": "Aucun camion trouvé", "camions": []}

        return {"camions": response.data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des camions: {str(e)}")

#permet de récupérer tous les camions sans chauffeurs
def get_camions_sans_chauffeurs():
    try:
        # Récupérer tous les camions avec leurs relations chauffeur_camion
        response = supabase.table("camion").select(
            """
            *,
            chauffeur_camion (
                *
            )
            """
        ).execute()

        if not response.data:
            return {"message": "Aucun camion trouvé", "camions": []}

        # Filtrer ceux qui n'ont aucun chauffeur_camion
        camions_sans_chauffeur = [camion for camion in response.data if not camion.get("chauffeur_camion")]

        return {"camions_sans_chauffeur": camions_sans_chauffeur}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des camions sans chauffeurs: {str(e)}")

#permet de récupérer un camion par son id
def get_camion_by_id(id_camion: int):
    try:
        response = supabase.table("camion").select(
            """
            *,
            chauffeur_camion (
                *,
                chauffeur (
                    *,
                    utilisateur (
                        nom,
                        prenom
                    )
                )
            )
            """
        ).eq("id_camion", id_camion).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Camion non trouvé")

        return {"camion": response.data[0]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération du camion: {str(e)}")
    
#permet de créer un camion

def create_camion(data: CamionCreate, current_user: dict):
    try:
        # Vérifier unicité du matricule
        existing = supabase.table("camion").select("*").eq("matricule", data.matricule).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Un camion avec ce matricule existe déjà.")

        # Préparer les données à insérer (dates en isoformat)
        camion_data = {
            "matricule": data.matricule,
            "modele": data.modele,
            "assurance": data.assurance,
            "fin_validite_assurance": data.fin_validite_assurance.isoformat(),
            "visite_technique": data.visite_technique,
            "fin_visite_technique": data.fin_visite_technique.isoformat(),
            "carte_grise": data.carte_grise,
            "fin_carte_grise": data.fin_carte_grise.isoformat(),
            "extincteur": data.extincteur,
            "fin_extincteur": data.fin_extincteur.isoformat()
        }

        # Insertion du camion
        response = supabase.table("camion").insert(camion_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la création du camion.")

        created_camion = response.data[0]

        # Log de la création
        supabase.table("historique_actions").insert({
            "id_utilisateur": current_user["id_utilisateur"],
            "action": "CREATION_CAMION",
            "cible": json.dumps(created_camion),
            "date_action": datetime.now().isoformat()
        }).execute()

        return {
            "message": "Camion créé avec succès",
            "camion": created_camion
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    
#permet de modifier un camion
def update_camion(id_camion: int, data: CamionUpdate, current_user: dict):
    try:
        # Récupérer les données existantes du camion avant modification
        existing_resp = supabase.table("camion").select("*").eq("id_camion", id_camion).single().execute()
        if not existing_resp.data:
            raise HTTPException(status_code=404, detail="Camion non trouvé")

        existing = existing_resp.data

        # Préparer les champs à mettre à jour (en convertissant les dates)
        update_fields = {
            "matricule": data.matricule,
            "modele": data.modele,
            "assurance": data.assurance,
            "fin_validite_assurance": data.fin_validite_assurance.isoformat() if data.fin_validite_assurance else None,
            "visite_technique": data.visite_technique,
            "fin_visite_technique": data.fin_visite_technique.isoformat() if data.fin_visite_technique else None,
            "carte_grise": data.carte_grise,
            "fin_carte_grise": data.fin_carte_grise.isoformat() if data.fin_carte_grise else None,
            "extincteur": data.extincteur,
            "fin_extincteur": data.fin_extincteur.isoformat() if data.fin_extincteur else None
        }

        # Supprimer les champs non modifiés (None)
        update_fields = {k: v for k, v in update_fields.items() if v is not None}

        if not update_fields:
            raise HTTPException(status_code=400, detail="Aucun champ à mettre à jour")

        # Calculer les différences (modifications réelles)
        modifications = {}
        for key, new_value in update_fields.items():
            old_value = existing.get(key)
            if old_value != new_value:
                modifications[key] = {"avant": old_value, "apres": new_value}

        if not modifications:
            # Rien à modifier effectivement
            return {
                "message": "Aucune modification détectée",
                "camion": existing
            }

        # Mise à jour dans la base
        update_resp = supabase.table("camion").update(update_fields).eq("id_camion", id_camion).execute()

        if not update_resp.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du camion")

        updated_camion = update_resp.data[0]

        # Log de l'action
        supabase.table("historique_actions").insert({
            "id_utilisateur": current_user["id_utilisateur"],
            "action": "MISE_A_JOUR_CAMION",
            "cible": json.dumps({
                "id_camion": id_camion,
                "matricule": existing.get("matricule"),
                "modifications": modifications
            }),
            "date_action": datetime.now().isoformat()
        }).execute()

        return {
            "message": "Camion mis à jour avec succès",
            "camion": updated_camion
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    
#permet de supprimer un camion
def delete_camion(id_camion: int, current_user: dict):
    try:
        # 🔍 Vérifier que le camion existe et récupérer ses infos pour log
        existing = supabase.table("camion").select("*").eq("id_camion", id_camion).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Camion non trouvé")

        camion_supprime = existing.data
        
        # Détacher les voyages du chauffeur avant suppression
        supabase.table("voyage").update({
            "id_camion": None,
            "statut": "Livraison effectué, Chauffeur ou camion supprimé"  # si tu veux tracer la suppression
        }).eq("id_camion", id_camion).execute()


        # 🗑️ Supprimer le camion
        delete_response = supabase.table("camion").delete().eq("id_camion", id_camion).execute()

        if not delete_response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la suppression du camion")

        # 📝 Log de l'action dans historique
        supabase.table("historique_actions").insert({
            "id_utilisateur": current_user["id_utilisateur"],
            "action": "SUPPRESSION_CAMION",
            "cible": json.dumps({
                "id_camion": id_camion,
                "details": camion_supprime
            }),
            "date_action": datetime.now().isoformat()
        }).execute()

        return {
            "message": "Camion supprimé avec succès",
            "camion_supprimé": camion_supprime
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    
#permet d'affecter un camion à un chauffeur
def affecter_camion_au_chauffeur(data: ChauffeurCamionCreate):
    try:
        # Vérifie si l'affectation existe déjà
        existing = supabase.table("chauffeur_camion") \
            .select("*") \
            .eq("id_chauffeur", data.id_chauffeur) \
            .eq("id_camion", data.id_camion) \
            .execute()
        
        if existing.data:
            raise HTTPException(status_code=400, detail="Ce camion est déjà affecté à ce chauffeur.")

        # Ajoute l'affectation
        response = supabase.table("chauffeur_camion").insert({
            "id_chauffeur": data.id_chauffeur,
            "id_camion": data.id_camion
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de l'affectation du camion.")

        return {
            "message": "Camion affecté au chauffeur avec succès",
            "liaison": response.data[0]
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
