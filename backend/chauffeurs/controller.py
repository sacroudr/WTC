from datetime import datetime
from fastapi import HTTPException
from types import SimpleNamespace
from config.supabase import supabase

from .models import ChauffeurCreate
from .models import ChauffeurUpdate

from authentification.utils import get_current_user

import json


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
def create_chauffeur(data: ChauffeurCreate, current_user: dict):
    # 1️⃣ Créer l'utilisateur
    utilisateur_resp = supabase.table("utilisateur").insert({
        "nom": data.nom,
        "prenom": data.prenom,
        "carte_national": data.carte_national,
        "mail": data.mail,
        "mot_de_passe": None,
        "role": "chauffeur",
        "date_creation": datetime.now().isoformat()
    }).execute()

    if not utilisateur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")

    utilisateur_id = utilisateur_resp.data[0]["id_utilisateur"]

    # 2️⃣ Créer le chauffeur lié
    chauffeur_resp = supabase.table("chauffeur").insert({
        "id_utilisateur": utilisateur_id,
        "num_permis": data.num_permis,
        "telephone": data.telephone,
        "disponibilite": data.disponibilite
    }).execute()

    if not chauffeur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création du chauffeur")

    id_chauffeur = chauffeur_resp.data[0]["id_chauffeur"]

    # 3️⃣ Affecter le camion
    if not data.id_camion:
        raise HTTPException(status_code=400, detail="id_camion est requis pour l'affectation du camion")

    chauffeur_camion_resp = supabase.table("chauffeur_camion").insert({
        "id_chauffeur": id_chauffeur,
        "id_camion": data.id_camion
    }).execute()

    if not chauffeur_camion_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de l'affectation du camion au chauffeur")

    # 4️⃣ ➜ Log de l'action AVEC détail complet
    modifications = {
        "utilisateur": {
            "nom": data.nom,
            "prenom": data.prenom,
            "carte_national": data.carte_national,
            "mail": data.mail
        },
        "chauffeur": {
            "num_permis": data.num_permis,
            "telephone": data.telephone,
            "disponibilite": data.disponibilite
        },
        "camion_affecte": {
            "id_camion": data.id_camion
        }
    }

    supabase.table("historique_actions").insert({
        "id_utilisateur": current_user["id_utilisateur"],
        "action": "CREATION_CHAUFFEUR",
        "cible": json.dumps({
            "id_chauffeur": id_chauffeur,
            "id_utilisateur": utilisateur_id,
            "nom": data.nom,
            "prenom": data.prenom,
            "modifications": modifications
        }),
        "date_action": datetime.now().isoformat()
    }).execute()

    return {
        "message": "Chauffeur créé et camion affecté avec succès",
        "utilisateur": utilisateur_resp.data[0],
        "chauffeur": chauffeur_resp.data[0],
        "chauffeur_camion": chauffeur_camion_resp.data[0]
    }
    
    
# # #permet de mettre à jour les informations d'un chauffeur
def update_chauffeur(id_chauffeur: int, data: ChauffeurUpdate, current_user: dict):
    # Récupérer les infos AVANT
    chauffeur_data = supabase.table("chauffeur").select("id_utilisateur, utilisateur(*), telephone, num_permis, disponibilite").eq("id_chauffeur", id_chauffeur).maybe_single().execute()
    if not chauffeur_data or not chauffeur_data.data:
        raise HTTPException(status_code=404, detail="Chauffeur non trouvé")

    utilisateur_id = chauffeur_data.data["id_utilisateur"]
    utilisateur_avant = chauffeur_data.data["utilisateur"]
    chauffeur_avant = {
        "telephone": chauffeur_data.data["telephone"],
        "num_permis": chauffeur_data.data["num_permis"],
        "disponibilite": chauffeur_data.data["disponibilite"]
    }

    # Préparer update utilisateur
    utilisateur_fields = {
        "nom": data.nom,
        "prenom": data.prenom,
        "mail": data.mail,
        "mot_de_passe": data.mot_de_passe,
        "carte_national": data.carte_national,
    }
    utilisateur_fields = {k: v for k, v in utilisateur_fields.items() if v is not None}

    utilisateur_update = SimpleNamespace(data=[{}])
    if utilisateur_fields:
        utilisateur_update = supabase.table("utilisateur").update(utilisateur_fields).eq("id_utilisateur", utilisateur_id).execute()
        if not utilisateur_update.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour de l'utilisateur")

    # Préparer update chauffeur
    chauffeur_fields = {
        "telephone": data.telephone,
        "num_permis": data.num_permis,
        "disponibilite": data.disponibilite
    }
    chauffeur_fields = {k: v for k, v in chauffeur_fields.items() if v is not None}

    chauffeur_update = SimpleNamespace(data=[{}])
    if chauffeur_fields:
        chauffeur_update = supabase.table("chauffeur").update(chauffeur_fields).eq("id_chauffeur", id_chauffeur).execute()
        if not chauffeur_update.data:
            raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du chauffeur")

    # Gestion camion
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

    # ➜ Générer le DIFF
    modifications = {}

    for k, v in utilisateur_fields.items():
        avant = utilisateur_avant.get(k)
        if v != avant:
            modifications[k] = {"avant": avant, "apres": v}

    for k, v in chauffeur_fields.items():
        avant = chauffeur_avant.get(k)
        if v != avant:
            modifications[k] = {"avant": avant, "apres": v}

    if data.id_camion is not None:
        avant_camion = affectation_existante.data[0]["id_camion"] if affectation_existante.data else None
        if data.id_camion != avant_camion:
            modifications["id_camion"] = {"avant": avant_camion, "apres": data.id_camion}

    # ➜ Insérer log complet
    supabase.table("historique_actions").insert({
        "id_utilisateur": current_user["id_utilisateur"],
        "action": "MISE_A_JOUR_CHAUFFEUR",
        "cible": json.dumps({
            "id_chauffeur": id_chauffeur,
            "nom": utilisateur_fields.get("nom", utilisateur_avant["nom"]),
            "prenom": utilisateur_fields.get("prenom", utilisateur_avant["prenom"]),
            "modifications": modifications
        }),
        "date_action": datetime.now().isoformat()
    }).execute()

    return {
        "message": "Chauffeur mis à jour avec succès",
        "utilisateur": utilisateur_update.data[0] if utilisateur_update.data else {},
        "chauffeur": chauffeur_update.data[0] if chauffeur_update.data else {},
        "chauffeur_camion": camion_update.data[0] if camion_update.data else {},
    }

#Permet de supprimer un chauffeur
#Pour l'instant elle marche mais à modifier
def delete_chauffeur(id_chauffeur: int, current_user: dict):
    # Vérifier si le chauffeur existe
    chauffeur_resp = supabase.table("chauffeur").select("id_chauffeur, id_utilisateur, utilisateur(nom, prenom)").eq("id_chauffeur", id_chauffeur).maybe_single().execute()
    if not chauffeur_resp or not chauffeur_resp.data:
        raise HTTPException(status_code=404, detail="Chauffeur non trouvé")

    chauffeur = chauffeur_resp.data
    utilisateur_id = chauffeur["id_utilisateur"]

    # Récupérer nom et prénom du chauffeur
    nom = chauffeur["utilisateur"]["nom"]
    prenom = chauffeur["utilisateur"]["prenom"]

    # Détacher les voyages du chauffeur avant suppression
    supabase.table("voyage").update({
        "id_chauffeur": None,
        "statut": "Livraison effectué, Chauffeur ou camion supprimé"  # si tu veux tracer la suppression
    }).eq("id_chauffeur", id_chauffeur).execute()

    # Supprimer le chauffeur
    supabase.table("chauffeur").delete().eq("id_chauffeur", id_chauffeur).execute()

    # Supprimer l'utilisateur associé
    supabase.table("utilisateur").delete().eq("id_utilisateur", utilisateur_id).execute()

    # 🔥 Log de l'action, avec nom et prénom du chauffeur dans cible
    supabase.table("historique_actions").insert({
        "id_utilisateur": current_user["id_utilisateur"],
        "action": "SUPPRESSION_CHAUFFEUR",
        "cible": json.dumps({
            "id_chauffeur": id_chauffeur,
            "nom": nom,
            "prenom": prenom
        }),
        "date_action": datetime.now().isoformat()
    }).execute()

    return {"message": "Chauffeur et utilisateur associé supprimés avec succès"}
