from fastapi import HTTPException
from config.supabase import supabase

# Récupérer le nombre total de clients
def get_clients_count():
    response = supabase.table("utilisateur").select("id_utilisateur", count="exact").eq("role", "client").execute()

    if response.data is None:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération du nombre de clients")


    total_clients = response.count or 0

    return {
        "message": "Nombre total de clients récupéré avec succès",
        "total": total_clients
    }

def get_chauffeurs_count():
    response = supabase.table("utilisateur").select("id_utilisateur", count="exact").eq("role", "chauffeur").execute()

    if response.data is None:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération du nombre de chauffeurs")

    total_chauffeurs = response.count or 0

    return {
        "message": "Nombre total de chauffeurs récupéré avec succès",
        "total": total_chauffeurs
    }
    
def get_chauffeurs_count():
    try:
        # Total de chauffeurs
        total_resp = (
            supabase
            .table("chauffeur")
            .select("id_chauffeur", count="exact")
            .execute()
        )
        if total_resp.data is None:
            raise HTTPException(status_code=500, detail="Impossible de récupérer le total des chauffeurs")
        total = total_resp.count or 0

        # Chauffeurs disponibles (disponibilite = True)
        dispo_resp = (
            supabase
            .table("chauffeur")
            .select("id_chauffeur", count="exact")
            .eq("disponibilite", True)
            .execute()
        )
        if dispo_resp.data is None:
            raise HTTPException(status_code=500, detail="Impossible de récupérer les chauffeurs disponibles")
        disponibles = dispo_resp.count or 0

        # Chauffeurs indisponibles (disponibilite = False)
        indispo_resp = (
            supabase
            .table("chauffeur")
            .select("id_chauffeur", count="exact")
            .eq("disponibilite", False)
            .execute()
        )
        if indispo_resp.data is None:
            raise HTTPException(status_code=500, detail="Impossible de récupérer les chauffeurs indisponibles")
        indisponibles = indispo_resp.count or 0

        return {
            "message": "Statistiques des chauffeurs récupérées avec succès",
            "total": total,
            "disponibles": disponibles,
            "indisponibles": indisponibles
        }

    except HTTPException:
        # On ré-émet l'HTTPException que l'on a levée ci-dessus
        raise
    except Exception as e:
        # Cas imprévu
        raise HTTPException(status_code=500, detail=f"Erreur interne : {e}")
    
# Récupérer le nombre total de camions
def get_camions_count():
    try:
        resp = (
            supabase
            .table("camion")
            .select("id_camion", count="exact")
            .execute()
        )
        if resp.data is None:
            raise HTTPException(status_code=500, detail="Impossible de récupérer le nombre de camions")
        total_camions = resp.count or 0

        return {
            "message": "Nombre total de camions récupéré avec succès",
            "total": total_camions
        }

    except HTTPException:
        # On ré-émet l'HTTPException levée ci‑dessus
        raise
    except Exception as e:
        # Cas imprévu
        raise HTTPException(status_code=500, detail=f"Erreur interne : {e}")


# Récupérer le nombre de voyages à faire
def get_pending_voyages_count():
    try:
        # Sélectionne et compte tous les voyages dont le statut est différent de "Livraison effectuée"
        resp = (
            supabase
            .table("voyage")
            .select("id_voyage", count="exact")
            .neq("statut", "Livraison effectuée")
            .execute()
        )
        if resp.data is None:
            raise HTTPException(status_code=500, detail="Impossible de récupérer le nombre de voyages à faire")

        total_pending = resp.count or 0

        return {
            "message": "Nombre de voyages à faire récupéré avec succès",
            "total": total_pending
        }

    except HTTPException:
        # Ré-émet l'HTTPException pour les cas gérés
        raise
    except Exception as e:
        # Toute autre erreur inattendue
        raise HTTPException(status_code=500, detail=f"Erreur interne : {e}")

def get_historique_actions():
    resp = supabase.table("historique_actions").select("*").execute()
    return resp.data