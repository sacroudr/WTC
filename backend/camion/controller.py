from fastapi import HTTPException
from config.supabase import supabase


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
# def get_camion_by_id(id_camion: int):
#     try:
#         response = supabase.table("camion").select("*").eq("id_camion", id_camion).execute()

#         if not response.data:
#             raise HTTPException(status_code=404, detail="Camion non trouvé")

#         return {"camion": response.data[0]}
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération du camion: {str(e)}")

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
def create_camion(data: CamionCreate):
    try:
        # Vérifier unicité du matricule (optionnel mais conseillé)
        existing = supabase.table("camion").select("*").eq("matricule", data.matricule).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Un camion avec ce matricule existe déjà.")

        # Insertion du nouveau camion
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

        response = supabase.table("camion").insert(camion_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la création du camion.")

        return {
            "message": "Camion créé avec succès",
            "camion": response.data[0]
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    
#permet de modifier un camion
def update_camion(id_camion: int, data: CamionUpdate):
    try:
        # Vérifier que le camion existe
        existing = supabase.table("camion").select("*").eq("id_camion", id_camion).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Camion non trouvé")

        # Préparer les champs à mettre à jour
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

        # Supprimer les valeurs nulles (non fournies)
        update_fields = {k: v for k, v in update_fields.items() if v is not None}

        if not update_fields:
            raise HTTPException(status_code=400, detail="Aucun champ à mettre à jour")

        # Mise à jour
        response = supabase.table("camion").update(update_fields).eq("id_camion", id_camion).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du camion")

        return {
            "message": "Camion mis à jour avec succès",
            "camion": response.data[0]
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")
    
#permet de supprimer un camion
def delete_camion(id_camion: int):
    try:
        # Vérifie que le camion existe
        existing = supabase.table("camion").select("id_camion").eq("id_camion", id_camion).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Camion non trouvé")

        # Supprime le camion
        delete_response = supabase.table("camion").delete().eq("id_camion", id_camion).execute()

        if not delete_response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la suppression du camion")

        return {
            "message": "Camion supprimé avec succès",
            "camion_supprimé": delete_response.data[0]
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
