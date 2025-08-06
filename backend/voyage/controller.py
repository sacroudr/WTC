from datetime import datetime
import random
import string
from fastapi import HTTPException
from config.supabase import supabase
import json

from .models import VoyageCreate

# # Permet de récupérer tous les voyages
# def get_all_voyages():
#     try:
#         response = supabase.table("voyage").select("""
#             *,
#             client!voyage_id_client_fkey (
#                 id_client,
#                 entreprise,
#                 utilisateur (
#                     nom
#                 )
#             ),
#             chauffeur!voyage_id_chauffeur_fkey (
#                 id_chauffeur,
#                 utilisateur (
#                     nom
#                 )
#             ),
#             camion!voyage_id_camion_fkey (
#                 id_camion,
#                 matricule
#             )
#         """).execute()

#         if not response.data:
#             return {"voyages": []}

#         voyages = []
#         for v in response.data:
#             nom_client = (
#                 v.get("client", {})
#                  .get("utilisateur", {})
#                  .get("nom")
#             )
#             entreprise = (
#                 v.get("client", {})
#                  .get("entreprise")
#             )

#             nom_chauffeur = (
#                 v.get("chauffeur", {})
#                  .get("utilisateur", {})
#                  .get("nom")
#             )
#             matricule = (
#                 v.get("camion", {})
#                  .get("matricule")
#             )

#             voyages.append({
#                 "id_voyage": v["id_voyage"],
#                 "id_client": v["id_client"],
#                 "entreprise": entreprise,
#                 "nom_client": nom_client,
#                 "id_chauffeur": v["id_chauffeur"],
#                 "nom_chauffeur": nom_chauffeur,
#                 "id_camion": v["id_camion"],
#                 "matricule": matricule,
#                 "numero_voyage": v["numero_voyage"],
#                 "ice": v["ice"],
#                 "date_depart": v["date_depart"],
#                 "adresse_depart": v["adresse_depart"],
#                 "adresse_arrive": v["adresse_arrive"],
#                 "statut": v["statut"]
#             })

#         return {"voyages": voyages}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages : {str(e)}")


def get_all_voyages():
    try:
        response = supabase.table("voyage").select("""
            *,
            client!voyage_id_client_fkey (
                id_client,
                entreprise,
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
            client_data = v.get("client") or {}
            chauffeur_data = v.get("chauffeur") or {}
            camion_data = v.get("camion") or {}

            utilisateur_client = client_data.get("utilisateur") or {}
            utilisateur_chauffeur = chauffeur_data.get("utilisateur") or {}

            voyages.append({
                "id_voyage": v.get("id_voyage"),
                "id_client": v.get("id_client"),
                "entreprise": client_data.get("entreprise"),
                "nom_client": utilisateur_client.get("nom"),
                "id_chauffeur": v.get("id_chauffeur"),
                "nom_chauffeur": utilisateur_chauffeur.get("nom"),
                "id_camion": v.get("id_camion"),
                "matricule": camion_data.get("matricule"),
                "numero_voyage": v.get("numero_voyage"),
                "ice": v.get("ice"),
                "date_depart": v.get("date_depart"),
                "heure_depart": v.get("heure_depart"),
                "adresse_depart": v.get("adresse_depart"),
                "adresse_arrive": v.get("adresse_arrive"),
                "statut": v.get("statut")
            })

        return {"voyages": voyages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages : {str(e)}")

# # Permet de récupérer les voyages d'un client spécifique
# def get_voyages_by_client(id_client: int):
#     try:
#         response = supabase.table("voyage").select("""
#             *,
#             client!voyage_id_client_fkey (
#                 id_client,
#                 entreprise,
#                 utilisateur (
#                     nom
#                 )
#             ),
#             chauffeur!voyage_id_chauffeur_fkey (
#                 id_chauffeur,
#                 utilisateur (
#                     nom
#                 )
#             ),
#             camion!voyage_id_camion_fkey (
#                 id_camion,
#                 matricule
#             )
#         """).eq("id_client", id_client).execute()

#         if not response.data:
#             return {"voyages": []}

#         voyages = []
#         for v in response.data:
#             nom_client = (
#                 v.get("client", {})
#                  .get("utilisateur", {})
#                  .get("nom")
#             )
#             entreprise = (
#                 v.get("client", {})
#                  .get("entreprise")
#             )

#             nom_chauffeur = (
#                 v.get("chauffeur", {})
#                  .get("utilisateur", {})
#                  .get("nom")
#             )
#             matricule = (
#                 v.get("camion", {})
#                  .get("matricule")
#             )

#             voyages.append({
#                 "id_voyage": v["id_voyage"],
#                 "id_client": v["id_client"],
#                 "nom_entreprise": entreprise,
#                 "nom_client": nom_client,
#                 "id_chauffeur": v["id_chauffeur"],
#                 "nom_chauffeur": nom_chauffeur,
#                 "id_camion": v["id_camion"],
#                 "matricule": matricule,
#                 "numero_voyage": v["numero_voyage"],
#                 "ice": v["ice"],
#                 "date_depart": v["date_depart"],
#                 "adresse_depart": v["adresse_depart"],
#                 "adresse_arrive": v["adresse_arrive"],
#                 "statut": v["statut"]
#             })

#         return {"voyages": voyages}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages du client : {str(e)}")
def get_voyages_by_client(id_client: int):
    try:
        response = supabase.table("voyage").select("""
            *,
            client!voyage_id_client_fkey (
                id_client,
                entreprise,
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
        """).eq("id_client", id_client).execute()

        if not response.data:
            return {"voyages": []}

        voyages = []
        for v in response.data:
            client_data = v.get("client") or {}
            chauffeur_data = v.get("chauffeur") or {}
            camion_data = v.get("camion") or {}

            utilisateur_client = client_data.get("utilisateur") or {}
            utilisateur_chauffeur = chauffeur_data.get("utilisateur") or {}

            voyages.append({
                "id_voyage": v.get("id_voyage"),
                "id_client": v.get("id_client"),
                "nom_entreprise": client_data.get("entreprise"),
                "nom_client": utilisateur_client.get("nom"),
                "id_chauffeur": v.get("id_chauffeur"),
                "nom_chauffeur": utilisateur_chauffeur.get("nom"),
                "id_camion": v.get("id_camion"),
                "matricule": camion_data.get("matricule"),
                "numero_voyage": v.get("numero_voyage"),
                "ice": v.get("ice"),
                "heure_depart": v.get("heure_depart"),
                "date_depart": v.get("date_depart"),
                "adresse_depart": v.get("adresse_depart"),
                "adresse_arrive": v.get("adresse_arrive"),
                "statut": v.get("statut")
            })

        return {"voyages": voyages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages du client : {str(e)}")


# Récupérer un voyage spécifique d'un client
def get_voyage_by_client_and_voyage_id(id_client: int, id_voyage: int):
    try:
        response = supabase.table("voyage").select("""
            *,
            client!voyage_id_client_fkey (
                id_client,
                entreprise,
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
        """).eq("id_client", id_client).eq("id_voyage", id_voyage).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Voyage non trouvé pour ce client.")

        v = response.data[0]

        nom_client = (
            v.get("client", {})
             .get("utilisateur", {})
             .get("nom")
        )
        entreprise = (
            v.get("client", {})
             .get("entreprise")
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

        voyage = {
            "id_voyage": v["id_voyage"],
            "id_client": v["id_client"],
            "nom_entreprise": entreprise,
            "nom_client": nom_client,
            "id_chauffeur": v["id_chauffeur"],
            "nom_chauffeur": nom_chauffeur,
            "id_camion": v["id_camion"],
            "matricule": matricule,
            "numero_voyage": v["numero_voyage"],
            "ice": v["ice"],
            "date_depart": v["date_depart"],
            "heure_depart": v["heure_depart"],
            "adresse_depart": v["adresse_depart"],
            "adresse_arrive": v["adresse_arrive"],
            "statut": v["statut"]
        }

        return {"voyage": voyage}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération du voyage du client : {str(e)}")
    

# #permet de récupérer un voyage par son id
# def get_voyages_by_id(id_voyage: int):
#     try:
#         response = supabase.table("voyage").select("""
#             *,
#             client!voyage_id_client_fkey (
#                 id_client,
#                 entreprise,
#                 utilisateur (
#                     nom
#                 )
#             ),
#             chauffeur!voyage_id_chauffeur_fkey (
#                 id_chauffeur,
#                 utilisateur (
#                     nom
#                 )
#             ),
#             camion!voyage_id_camion_fkey (
#                 id_camion,
#                 matricule
#             )
#         """).eq("id_voyage", id_voyage).execute()

#         if not response.data:
#             raise HTTPException(status_code=404, detail="Camion non trouvé")

#         voyages = []
#         for v in response.data:
#             nom_client = (
#                 v.get("client", {})
#                  .get("utilisateur", {})
#                  .get("nom")
#             )
#             entreprise = (
#                 v.get("client", {})
#                  .get("entreprise")
#             )

#             nom_chauffeur = (
#                 v.get("chauffeur", {})
#                  .get("utilisateur", {})
#                  .get("nom")
#             )
#             matricule = (
#                 v.get("camion", {})
#                  .get("matricule")
#             )

#             voyages.append({
#                 "id_voyage": v["id_voyage"],
#                 "id_client": v["id_client"],
#                 "entreprise": entreprise,
#                 "nom_client": nom_client,
#                 "id_chauffeur": v["id_chauffeur"],
#                 "nom_chauffeur": nom_chauffeur,
#                 "id_camion": v["id_camion"],
#                 "matricule": matricule,
#                 "numero_voyage": v["numero_voyage"],
#                 "ice": v["ice"],
#                 "date_depart": v["date_depart"],
#                 "adresse_depart": v["adresse_depart"],
#                 "adresse_arrive": v["adresse_arrive"],
#                 "statut": v["statut"]
#             })

#         return {"voyages": voyages}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages : {str(e)}")
def get_voyages_by_id(id_voyage: int):
    try:
        response = supabase.table("voyage").select("""
            *,
            client!voyage_id_client_fkey (
                id_client,
                entreprise,
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
            raise HTTPException(status_code=404, detail="Voyage non trouvé")

        voyages = []
        for v in response.data:
            client_data = v.get("client") or {}
            chauffeur_data = v.get("chauffeur") or {}
            camion_data = v.get("camion") or {}

            utilisateur_client = client_data.get("utilisateur") or {}
            utilisateur_chauffeur = chauffeur_data.get("utilisateur") or {}

            voyages.append({
                "id_voyage": v.get("id_voyage"),
                "id_client": v.get("id_client"),
                "entreprise": client_data.get("entreprise"),
                "nom_client": utilisateur_client.get("nom"),
                "id_chauffeur": v.get("id_chauffeur"),
                "nom_chauffeur": utilisateur_chauffeur.get("nom"),
                "id_camion": v.get("id_camion"),
                "matricule": camion_data.get("matricule"),
                "numero_voyage": v.get("numero_voyage"),
                "ice": v.get("ice"),
                "date_depart": v.get("date_depart"),
                "heure_depart": v.get("heure_depart"),
                "adresse_depart": v.get("adresse_depart"),
                "adresse_arrive": v.get("adresse_arrive"),
                "statut": v.get("statut")
            })

        return {"voyages": voyages}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des voyages : {str(e)}")

#  Fonction qui permet de créer un nouveau voyage elle sera utilisé pour la plateforme client dans le futur proche
# def create_voyage(data: VoyageCreate, current_user: dict):
    # try:
    #     # 1️⃣ Insertion du voyage sans numero_voyage
    #     voyage_data = {
    #         "id_client": data.id_client,
    #         "id_chauffeur": data.id_chauffeur,
    #         "id_camion": data.id_camion,
    #         "ice": data.ice,
    #         "date_depart": data.date_depart.isoformat(),
    #         "adresse_depart": data.adresse_depart,
    #         "adresse_arrive": data.adresse_arrive,
    #         "statut": "Validé"
    #     }

    #     response = supabase.table("voyage").insert(voyage_data).execute()

    #     if not response.data:
    #         raise HTTPException(status_code=500, detail="Erreur lors de la création du voyage")

    #     voyage = response.data[0]
    #     id_voyage = voyage["id_voyage"]

    #     # Génération du numero_voyage
    #     date_creation = datetime.utcnow().strftime("%Y%m%d")
    #     numero_voyage = f"WTC-{date_creation}-{str(id_voyage).zfill(5)}"

    #     # 2️⃣ Mise à jour du numero_voyage
    #     supabase.table("voyage").update({
    #         "numero_voyage": numero_voyage
    #     }).eq("id_voyage", id_voyage).execute()

    #     # 3️⃣ Création de la livraison liée
    #     livraison_data = {
    #         "id_voyage": id_voyage,
    #         "statut": "préparation",
    #         "date_maj": datetime.utcnow().isoformat(),
    #         "localisation": data.adresse_depart,
    #     }

    #     livraison_resp = supabase.table("livraison").insert(livraison_data).execute()

    #     if not livraison_resp.data:
    #         raise HTTPException(status_code=500, detail="Voyage créé, mais erreur lors de la création de la livraison")

    #     # 4️⃣ Mise à jour de la disponibilité du chauffeur
    #     supabase.table("chauffeur").update({
    #         "disponibilite": False
    #     }).eq("id_chauffeur", data.id_chauffeur).execute()

    #     # 5️⃣ Log dans historique_actions
    #     supabase.table("historique_actions").insert({
    #         "id_utilisateur": current_user["id_utilisateur"],
    #         "action": "CREATION_VOYAGE",
    #         "cible": json.dumps({
    #             "id_voyage": id_voyage,
    #             "numero_voyage": numero_voyage,
    #             "id_client": data.id_client,
    #             "id_chauffeur": data.id_chauffeur,
    #             "id_camion": data.id_camion
    #         }),
    #         "date_action": datetime.utcnow().isoformat()
    #     }).execute()

    #     return {
    #         "message": "Voyage et livraison créés avec succès",
    #         "numero_voyage": numero_voyage,
    #         "voyage": {**voyage, "numero_voyage": numero_voyage},
    #         "livraison": livraison_resp.data[0]
    #     }

    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Erreur lors de la création du voyage : {str(e)}")
    
    

# Fonction qui permet de créer un nouveau voyage par le backoffice utilisable pour l'instant
def create_voyage(data: VoyageCreate, current_user: dict):
    try:
        # 1️⃣ Insertion du voyage sans numero_voyage
        voyage_data = {
            "id_client": data.id_client,
            "id_chauffeur": data.id_chauffeur,
            "id_camion": data.id_camion,
            "ice": data.ice,
            "date_depart": data.date_depart.isoformat(),
            "heure_depart": data.heure_depart.isoformat(),
            "adresse_depart": data.adresse_depart,            
            "adresse_arrive": data.adresse_arrive,
            "statut": "Validé"
        }

        response = supabase.table("voyage").insert(voyage_data).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la création du voyage")

        voyage = response.data[0]
        id_voyage = voyage["id_voyage"]

        # Génération du numero_voyage
        date_creation = datetime.utcnow().strftime("%Y%m%d")
        numero_voyage = f"WTC-{date_creation}-{str(id_voyage).zfill(5)}"

        # 2️⃣ Mise à jour du numero_voyage
        supabase.table("voyage").update({
            "numero_voyage": numero_voyage
        }).eq("id_voyage", id_voyage).execute()

        # 3️⃣ Création de la livraison liée
        livraison_data = {
            "id_voyage": id_voyage,
            "statut": "Validé",
            "date_maj": datetime.utcnow().isoformat(),
            "localisation": data.adresse_depart,
        }

        livraison_resp = supabase.table("livraison").insert(livraison_data).execute()

        if not livraison_resp.data:
            raise HTTPException(status_code=500, detail="Voyage créé, mais erreur lors de la création de la livraison")

        livraison = livraison_resp.data[0]
        id_livraison = livraison["id_livraison"]

        # 🆕 4️⃣ Ajout dans historique_suivi
        supabase.table("historique_suivi").insert({
            "id_livraison": id_livraison,
            "statut": "Validé",
            "localisation": data.adresse_depart,
            "commentaire": "Nous avons validé votre voyage",
            "date_maj": datetime.utcnow().isoformat()
        }).execute()

        # 5️⃣ Mise à jour de la disponibilité du chauffeur
        supabase.table("chauffeur").update({
            "disponibilite": False
        }).eq("id_chauffeur", data.id_chauffeur).execute()

        # 6️⃣ Log dans historique_actions
        supabase.table("historique_actions").insert({
            "id_utilisateur": current_user["id_utilisateur"],
            "action": "CREATION_VOYAGE",
            "cible": json.dumps({
                "id_voyage": id_voyage,
                "numero_voyage": numero_voyage,
                "id_client": data.id_client,
                "id_chauffeur": data.id_chauffeur,
                "id_camion": data.id_camion
            }),
            "date_action": datetime.utcnow().isoformat()
        }).execute()

        return {
            "message": "Voyage et livraison créés avec succès",
            "numero_voyage": numero_voyage,
            "voyage": {**voyage, "numero_voyage": numero_voyage},
            "livraison": livraison
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du voyage : {str(e)}")
