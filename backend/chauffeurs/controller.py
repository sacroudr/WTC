from datetime import date
from fastapi import HTTPException
from types import SimpleNamespace
from config.supabase import supabase

from .models import ChauffeurCreate
from .models import ChauffeurUpdate


#permet de récupérer tous les chauffeurs
def get_all_chauffeurs():
    # Récupérer tous les chauffeurs
    chauffeurs_resp = supabase.table("chauffeur").select("*").execute()
    chauffeurs = chauffeurs_resp.data

    result = []
    for ch in chauffeurs:
        # Récupérer l'utilisateur lié
        utilisateur_resp = supabase.table("utilisateur").select("nom, prenom, carte_national, mail").eq("id_utilisateur", ch["id_utilisateur"]).execute()
        utilisateur = utilisateur_resp.data[0] if utilisateur_resp.data else {}

        # Récupérer les id_camion liés dans chauffeur_camion
        chauffeur_camion_resp = supabase.table("chauffeur_camion").select("id_camion").eq("id_chauffeur", ch["id_chauffeur"]).execute()
        id_camions = [item["id_camion"] for item in chauffeur_camion_resp.data] if chauffeur_camion_resp.data else []

        # Récupérer les camions associés (matricule uniquement ici)
        camions = []
        for id_camion in id_camions:
            camion_resp = supabase.table("camion").select("id_camion,matricule").eq("id_camion", id_camion).execute()
            if camion_resp.data:
                camions.append(camion_resp.data[0])

        # Ajouter dans le résultat
        result.append({
            "id_chauffeur": ch["id_chauffeur"],
            "num_permis": ch["num_permis"],
            "telephone": ch["telephone"],
            "disponibilite": ch["disponibilite"],
            "utilisateur": utilisateur,
            "camions": camions
        })

    return result

#permet de récupérer un chauffeur par son id
def get_chauffeur_by_id(id_chauffeur: int):
    # Rechercher le chauffeur
    chauffeur_resp = supabase.table("chauffeur").select("*").eq("id_chauffeur", id_chauffeur).execute()
    if not chauffeur_resp.data:
        raise HTTPException(status_code=404, detail="Chauffeur non trouvé")

    chauffeur = chauffeur_resp.data[0]

    # Rechercher l'utilisateur lié
    utilisateur_resp = supabase.table("utilisateur").select("nom, prenom, carte_national,mail").eq("id_utilisateur", chauffeur["id_utilisateur"]).execute()
    utilisateur = utilisateur_resp.data[0] if utilisateur_resp.data else {}

    # Récupérer les id_camion liés dans chauffeur_camion
    chauffeur_camion_resp = supabase.table("chauffeur_camion").select("id_camion").eq("id_chauffeur", id_chauffeur).execute()
    id_camions = [item["id_camion"] for item in chauffeur_camion_resp.data] if chauffeur_camion_resp.data else []

    # Récupérer les camions associés (matricule uniquement ici)
    camions = []
    for id_camion in id_camions:
        camion_resp = supabase.table("camion").select("matricule").eq("id_camion", id_camion).execute()
        if camion_resp.data:
            camions.append(camion_resp.data[0])
            
    return {
        "id_chauffeur": chauffeur["id_chauffeur"],
        "num_permis": chauffeur["num_permis"],
        "telephone": chauffeur["telephone"],
        "disponibilite": chauffeur["disponibilite"],
        "utilisateur": utilisateur,
        "camions": camions
    }

#Permet de créer un chauffeur et son utilisateur associé dans la base de données
def create_chauffeur(data: ChauffeurCreate):
    # 1. Création de l'utilisateur (mail et mot_de_passe laissés vides)
    utilisateur_resp = supabase.table("utilisateur").insert({
        "nom": data.nom,
        "prenom": data.prenom,
        "carte_national": data.carte_national,
        "mail": data.mail,  # volontairement vide
        "mot_de_passe": None,  # volontairement vide
        "role": "chauffeur",
        "date_creation": date.today().isoformat()
    }).execute()

    if not utilisateur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")

    utilisateur_id = utilisateur_resp.data[0]["id_utilisateur"]

    # 2. Création du chauffeur lié
    chauffeur_resp = supabase.table("chauffeur").insert({
        "id_utilisateur": utilisateur_id,
        "num_permis": data.num_permis,
        "telephone": data.telephone,
        "disponibilite": data.disponibilite
    }).execute()

    if not chauffeur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création du chauffeur")

    id_chauffeur = chauffeur_resp.data[0]["id_chauffeur"]

    # 3. Affectation du camion au chauffeur (insertion dans chauffeur_camion)
    if not data.id_camion:
        raise HTTPException(status_code=400, detail="id_camion est requis pour l'affectation du camion")

    chauffeur_camion_resp = supabase.table("chauffeur_camion").insert({
        "id_chauffeur": id_chauffeur,
        "id_camion": data.id_camion
    }).execute()

    if not chauffeur_camion_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de l'affectation du camion au chauffeur")

    return {
        "message": "Chauffeur créé et camion affecté avec succès",
        "utilisateur": utilisateur_resp.data[0],
        "chauffeur": chauffeur_resp.data[0],
        "chauffeur_camion": chauffeur_camion_resp.data[0]
    }

# # #permet de mettre à jour les informations d'un chauffeur
def update_chauffeur(id_chauffeur: int, data: ChauffeurUpdate):
    chauffeur_data = supabase.table("chauffeur").select("id_utilisateur").eq("id_chauffeur", id_chauffeur).single().execute()
    if not chauffeur_data.data:
        raise HTTPException(status_code=404, detail="Chauffeur non trouvé")
    
    utilisateur_id = chauffeur_data.data["id_utilisateur"]

    utilisateur_fields = {
        "nom": data.nom,
        "prenom": data.prenom,
        "mail": data.mail,
        "mot_de_passe": data.mot_de_passe,
        "carte_national": data.carte_national,
    }
    utilisateur_fields = {k: v for k, v in utilisateur_fields.items() if v is not None}

    if utilisateur_fields:
        utilisateur_update = supabase.table("utilisateur").update(utilisateur_fields).eq("id_utilisateur", utilisateur_id).execute()
        if not utilisateur_update.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour de l'utilisateur")
    else:
        utilisateur_update = SimpleNamespace(data=[{}])

    chauffeur_fields = {
        "telephone": data.telephone,
        "num_permis": data.num_permis,
        "disponibilite": data.disponibilite
    }
    chauffeur_fields = {k: v for k, v in chauffeur_fields.items() if v is not None}

    if chauffeur_fields:
        chauffeur_update = supabase.table("chauffeur").update(chauffeur_fields).eq("id_chauffeur", id_chauffeur).execute()
        if not chauffeur_update.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du chauffeur")
    else:
        chauffeur_update = SimpleNamespace(data=[{}])

    camion_update = SimpleNamespace(data=[{}])
    if data.id_camion is not None:
        affectation_existante = supabase.table("chauffeur_camion").select("*").eq("id_chauffeur", id_chauffeur).execute()

        if affectation_existante.data:
            camion_update = supabase.table("chauffeur_camion").update({
                "id_camion": data.id_camion
            }).eq("id_chauffeur", id_chauffeur).execute()
        else:
            camion_update = supabase.table("chauffeur_camion").insert({
                "id_chauffeur": id_chauffeur,
                "id_camion": data.id_camion
            }).execute()

        if not camion_update.data:
            raise HTTPException(status_code=500, detail="Erreur lors de l'affectation du camion")

    return {
        "message": "Chauffeur mis à jour avec succès",
        "utilisateur": utilisateur_update.data[0] if utilisateur_update.data else {},
        "chauffeur": chauffeur_update.data[0] if chauffeur_update.data else {},
        "chauffeur_camion": camion_update.data[0] if camion_update.data else {},
    }

#Permet de supprimer un chauffeur
#Pour l'instant elle marche mais à changer
def delete_chauffeur(id_chauffeur: int):
    # Vérifier si le chauffeur existe
    chauffeur_resp = supabase.table("chauffeur").select("*").eq("id_chauffeur", id_chauffeur).execute()
    if not chauffeur_resp.data:
        raise HTTPException(status_code=404, detail="Chauffeur non trouvé")

    chauffeur = chauffeur_resp.data[0]
    utilisateur_id = chauffeur["id_utilisateur"]
    
    # 🔁 Supprimer les voyages liés à ce chauffeur
    supabase.table("voyage").delete().eq("id_chauffeur", id_chauffeur).execute()

    # Supprimer le chauffeur
    supabase.table("chauffeur").delete().eq("id_chauffeur", id_chauffeur).execute()

    # Supprimer l'utilisateur associé
    supabase.table("utilisateur").delete().eq("id_utilisateur", utilisateur_id).execute()

    return {"message": "Chauffeur et utilisateur associé supprimés avec succès"}