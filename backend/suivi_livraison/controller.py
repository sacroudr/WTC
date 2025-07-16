from datetime import datetime
from fastapi import HTTPException
from config.supabase import supabase
from typing import List
from datetime import datetime


def add_suivi(id_livraison: int, statut: str, localisation: str, commentaire: str = ""):
    try:
        suivi_data = {
            "id_livraison": id_livraison,
            "statut": statut,
            "localisation": localisation,
            "date_maj": datetime.utcnow().isoformat(),
            "commentaire": commentaire
        }

        # Insertion du suivi dans historique_suivi
        resp = supabase.table("historique_suivi").insert(suivi_data).execute()

        if not resp.data:
            raise HTTPException(status_code=500, detail="Erreur lors de l'ajout du suivi")

        # Mise à jour du statut et localisation dans livraison
        supabase.table("livraison").update({
            "statut": statut,
            "localisation": localisation,
            "date_maj": datetime.utcnow().isoformat()
        }).eq("id_livraison", id_livraison).execute()

        # Récupérer l'id_voyage correspondant à cette livraison
        livraison_resp = supabase.table("livraison").select("id_voyage").eq("id_livraison", id_livraison).single().execute()

        if not livraison_resp.data:
            raise HTTPException(status_code=404, detail="Livraison non trouvée")

        id_voyage = livraison_resp.data["id_voyage"]

        # Mise à jour du statut dans la table voyage
        supabase.table("voyage").update({
            "statut": statut,
            
        }).eq("id_voyage", id_voyage).execute()

        return {"message": "Suivi ajouté et statut voyage mis à jour", "suivi": resp.data[0]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
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
