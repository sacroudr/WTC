from datetime import datetime
from fastapi import HTTPException
from config.supabase import supabase
from typing import List

def add_suivi(id_livraison: int, statut: str, localisation: str, commentaire: str = ""):
    try:
        suivi_data = {
            "id_livraison": id_livraison,
            "statut": statut,
            "localisation": localisation,
            "date_maj": datetime.utcnow().isoformat(),
            "commentaire": commentaire
        }

        resp = supabase.table("historique_suivi").insert(suivi_data).execute()

        if not resp.data:
            raise HTTPException(status_code=500, detail="Erreur lors de l'ajout du suivi")

        # Mettre à jour le statut courant dans la table livraison
        supabase.table("livraison").update({
            "statut": statut,
            "localisation": localisation,
            "date_maj": datetime.utcnow().isoformat()
        }).eq("id_livraison", id_livraison).execute()

        return {"message": "Suivi ajouté", "suivi": resp.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# def get_livraisons_par_numero_voyage(numero_voyage: str):
#     try:
#         # Étape 1 : Récupérer l'id_voyage correspondant au numero_voyage
#         voyage_resp = (
#             supabase.table("voyage")
#             .select("id_voyage")
#             .eq("numero_voyage", numero_voyage)
#             .single()
#             .execute()
#         )

#         if not voyage_resp.data:
#             raise HTTPException(status_code=404, detail="Voyage non trouvé")

#         id_voyage = voyage_resp.data["id_voyage"]

#         # Étape 2 : Récupérer toutes les livraisons liées à cet id_voyage
#         livraisons_resp = (
#             supabase.table("livraison")
#             .select("*")
#             .eq("id_voyage", id_voyage)
#             .execute()
#         )

#         return {"livraisons": livraisons_resp.data}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
    
    
def get_livraisons_par_numero_voyage(numero_voyage: str):
    try:
        # Étape 1 : Récupérer l'id_voyage correspondant au numero_voyage
        voyage_resp = (
            supabase.table("voyage")
            .select("id_voyage")
            .eq("numero_voyage", numero_voyage)
            .single()
            .execute()
        )

        if not voyage_resp.data:
            raise HTTPException(status_code=404, detail="Voyage non trouvé")

        id_voyage = voyage_resp.data["id_voyage"]

        # Étape 2 : Récupérer toutes les livraisons liées à cet id_voyage
        livraisons_resp = (
            supabase.table("livraison")
            .select("*")
            .eq("id_voyage", id_voyage)
            .execute()
        )

        livraisons = livraisons_resp.data or []

        # Étape 3 : Ajouter les suivis pour chaque livraison
        for livraison in livraisons:
            suivi_resp = (
                supabase.table("historique_suivi")
                .select("*")
                .eq("id_livraison", livraison["id_livraison"])
                .order("date_maj", desc=False)
                .execute()
            )
            # ⚠️ Astuce : s'il n'y a pas de suivi, renvoyer une liste vide
            livraison["suivi"] = suivi_resp.data or []
            livraison["numero_voyage"] = numero_voyage 

        return {"livraisons": livraisons}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
    
def get_suivi_livraison(id_livraison: int):
    try:
        suivi_resp = (
            supabase.table("historique_suivi")
            .select("*")
            .eq("id_livraison", id_livraison)
            .order("date_maj", desc=False)
            .execute()
        )

        if not suivi_resp.data:
            raise HTTPException(status_code=404, detail="Aucun suivi trouvé pour cette livraison")

        return {"historique": suivi_resp.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#permet de récupérer l'historique de suivi d'une livraison par son numero de voyage
# from typing import List

# def get_suivi_par_numero_voyage(numero_voyage: str):
#     try:
#         # Étape 1 : Récupérer l'id_voyage à partir du numero_voyage
#         voyage_resp = supabase.table("voyage").select("id_voyage").eq("numero_voyage", numero_voyage).single().execute()

#         if not voyage_resp.data:
#             raise HTTPException(status_code=404, detail="Voyage non trouvé")

#         id_voyage = voyage_resp.data["id_voyage"]

#         # Étape 2 : Récupérer les livraisons liées à ce voyage
#         livraisons_resp = supabase.table("livraison").select("id_livraison").eq("id_voyage", id_voyage).execute()

#         id_livraisons: List[int] = [liv["id_livraison"] for liv in livraisons_resp.data]

#         if not id_livraisons:
#             return {"historique": []}

#         # Étape 3 : Récupérer l'historique pour toutes ces livraisons
#         historique_resp = (
#             supabase.table("historique_suivi")
#             .select("*")
#             .in_("id_livraison", id_livraisons)
#             .order("date_maj", desc=False)
#             .execute()
#         )

#         return {"historique": historique_resp.data}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
