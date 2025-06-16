from datetime import datetime
import random
import string
from fastapi import HTTPException
from config.supabase import supabase

from .models import VoyageCreate

# Permet de récupérer tous les voyages
def get_all_voyages():
    try:
        response = supabase.table("voyage").select("""
            *,
            client!voyage_id_client_fkey (
                id_client,
                utilisateur (
                    nom
                )
            ),
            chauffeur!voyage_id_chauffeur_fkey (
                id_chauffeur,
                utilisateur (
                    nom
                )
            ),
            camion!voyage_id_camion_fkey (
                id_camion,
                matricule
            )
        """).execute()

        if not response.data:
            return {"voyages": []}

        voyages = []
        for v in response.data:
            nom_client = (
                v.get("client", {})
                 .get("utilisateur", {})
                 .get("nom")
            )

            nom_chauffeur = (
                v.get("chauffeur", {})
                 .get("utilisateur", {})
                 .get("nom")
            )
            matricule = (
                v.get("camion", {})
                 .get("matricule")
            )

            voyages.append({
                "id_voyage": v["id_voyage"],
                "id_client": v["id_client"],
                "nom_client": nom_client,
                "id_chauffeur": v["id_chauffeur"],
                "nom_chauffeur": nom_chauffeur,
                "id_camion": v["id_camion"],
                "matricule": matricule,
                "numero_voyage": v["numero_voyage"],
                "ice": v["ice"],
                "date_depart": v["date_depart"],
                "adresse_depart": v["adresse_depart"],
                "adresse_arrive": v["adresse_arrive"],
                "statut": v["statut"]
            })

        return {"voyages": voyages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages : {str(e)}")

#permet de récupérer un voyage par son id
def get_voyages_by_id(id_voyage: int):
    try:
        response = supabase.table("voyage").select("""
            *,
            client!voyage_id_client_fkey (
                id_client,
                utilisateur (
                    nom
                )
            ),
            chauffeur!voyage_id_chauffeur_fkey (
                id_chauffeur,
                utilisateur (
                    nom
                )
            ),
            camion!voyage_id_camion_fkey (
                id_camion,
                matricule
            )
        """).eq("id_voyage", id_voyage).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Camion non trouvé")

        voyages = []
        for v in response.data:
            nom_client = (
                v.get("client", {})
                 .get("utilisateur", {})
                 .get("nom")
            )

            nom_chauffeur = (
                v.get("chauffeur", {})
                 .get("utilisateur", {})
                 .get("nom")
            )
            matricule = (
                v.get("camion", {})
                 .get("matricule")
            )

            voyages.append({
                "id_voyage": v["id_voyage"],
                "id_client": v["id_client"],
                "nom_client": nom_client,
                "id_chauffeur": v["id_chauffeur"],
                "nom_chauffeur": nom_chauffeur,
                "id_camion": v["id_camion"],
                "matricule": matricule,
                "numero_voyage": v["numero_voyage"],
                "ice": v["ice"],
                "date_depart": v["date_depart"],
                "adresse_depart": v["adresse_depart"],
                "adresse_arrive": v["adresse_arrive"],
                "statut": v["statut"]
            })

        return {"voyages": voyages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages : {str(e)}")

# #pertmet de créer un voyage
# def create_voyage(data: VoyageCreate):
#     try:
#         voyage_data = {
#             "id_client": data.id_client,
#             "id_chauffeur": data.id_chauffeur,
#             "id_camion": data.id_camion,
#             "ice": data.ice,
#             "date_depart": data.date_depart.isoformat(),
#             "adresse_depart": data.adresse_depart,
#             "adresse_arrive": data.adresse_arrive,
#             "statut": "en attente"
#         }

#         response = supabase.table("voyage").insert(voyage_data).execute()

#         if not response.data:
#             raise HTTPException(status_code=500, detail="Erreur lors de la création du voyage")

#         return {
#             "message": "Voyage créé avec succès",
#             "voyage": response.data[0]
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erreur lors de la création du voyage : {str(e)}")
    


# def create_voyage(data: VoyageCreate):
#     try:
#         voyage_data = {
#             "id_client": data.id_client,
#             "id_chauffeur": data.id_chauffeur,
#             "id_camion": data.id_camion,
#             "ice": data.ice,
#             "date_depart": data.date_depart.isoformat(),
#             "adresse_depart": data.adresse_depart,
#             "adresse_arrive": data.adresse_arrive,
#             "statut": "Validé"
#         }

#         response = supabase.table("voyage").insert(voyage_data).execute()

#         if not response.data:
#             raise HTTPException(status_code=500, detail="Erreur lors de la création du voyage")

#         voyage = response.data[0]

#         # Création automatique d'une livraison liée à ce voyage
#         livraison_data = {
#             "id_voyage": voyage["id_voyage"],
#             "statut": "préparation",
#             "date_maj": datetime.utcnow().isoformat(),
#             "localisation": data.adresse_depart,
#         }

#         livraison_resp = supabase.table("livraison").insert(livraison_data).execute()

#         if not livraison_resp.data:
#             raise HTTPException(status_code=500, detail="Voyage créé, mais erreur lors de la création de la livraison")

#         return {
#             "message": "Voyage et livraison créés avec succès",
#             "voyage": voyage,
#             "livraison": livraison_resp.data[0]
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erreur lors de la création du voyage : {str(e)}")


def create_voyage(data: VoyageCreate):
    try:
        # Étape 1 : insertion du voyage sans numero_suivi
        voyage_data = {
            "id_client": data.id_client,
            "id_chauffeur": data.id_chauffeur,
            "id_camion": data.id_camion,
            "ice": data.ice,
            "date_depart": data.date_depart.isoformat(),
            "adresse_depart": data.adresse_depart,
            "adresse_arrive": data.adresse_arrive,
            "statut": "Validé"
        }

        response = supabase.table("voyage").insert(voyage_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la création du voyage")

        voyage = response.data[0]
        id_voyage = voyage["id_voyage"]
        date_creation = datetime.utcnow().strftime("%Y%m%d")
        numero_voyage = f"WTC-{date_creation}-{str(id_voyage).zfill(5)}"

        # Étape 2 : mise à jour du numero_suivi
        supabase.table("voyage").update({
            "numero_voyage": numero_voyage
        }).eq("id_voyage", id_voyage).execute()

        # Étape 3 : création de la livraison liée
        livraison_data = {
            "id_voyage": id_voyage,
            "statut": "préparation",
            "date_maj": datetime.utcnow().isoformat(),
            "localisation": data.adresse_depart,
        }

        livraison_resp = supabase.table("livraison").insert(livraison_data).execute()

        if not livraison_resp.data:
            raise HTTPException(status_code=500, detail="Voyage créé, mais erreur lors de la création de la livraison")

        return {
            "message": "Voyage et livraison créés avec succès",
            "numero_voyage": numero_voyage,
            "voyage": {**voyage, "numero_voyage": numero_voyage},
            "livraison": livraison_resp.data[0]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du voyage : {str(e)}")
