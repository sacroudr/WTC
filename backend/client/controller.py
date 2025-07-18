from fastapi import HTTPException
from config.supabase import supabase
from datetime import date, datetime
import json

from .models import ClientCreate, ClientUpdate

#Permet de récupérer tous les clients
def get_all_clients():
    # 1. Requête combinée avec jointure manuelle (pas de vrai JOIN dans Supabase via Python)
    clients = supabase.table("client").select("*, utilisateur(*)").execute()

    if not clients.data:
        raise HTTPException(status_code=404, detail="Aucun client trouvé.")

    # 2. Traitement des données : fusionner et retirer le mot de passe
    result = []
    for client in clients.data:
        utilisateur = client.get("utilisateur", {})

        utilisateur.pop("mot_de_passe", None)  # sécurité

        client_data = {
            "id_client": client.get("id_client"),
            "entreprise": client.get("entreprise"),
            "adresse": client.get("adresse"),
            "telephone": client.get("telephone"),
            "utilisateur": utilisateur
        }
        result.append(client_data)

    return {
        "message": "Liste des clients récupérée avec succès",
        "clients": result
    }

#Permet de récupérer un client par son id
def get_client_by_id(id_client: int):
    # 1. Requête pour récupérer le client par ID
    client_resp = supabase.table("client").select("*").eq("id_client", id_client).execute()
    
    if not client_resp.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")

    client = client_resp.data[0]

    # 2. Récupérer l'utilisateur associé
    utilisateur_resp = supabase.table("utilisateur").select("nom, prenom, carte_national, mail").eq("id_utilisateur", client["id_utilisateur"]).execute()
    utilisateur = utilisateur_resp.data[0] if utilisateur_resp.data else {}

    # 3. Retirer le mot de passe pour la sécurité
    utilisateur.pop("mot_de_passe", None)

    return {
        "id_client": client["id_client"],
        "entreprise": client["entreprise"],
        "adresse": client["adresse"],
        "telephone": client["telephone"],
        "utilisateur": utilisateur
    }
    
#Permet de créer un client et son utilisateur associé dans la base de données
def create_client(data: ClientCreate, current_user: dict):
    # 1️⃣ Création de l'utilisateur
    utilisateur_resp = supabase.table("utilisateur").insert({
        "nom": data.nom,
        "prenom": data.prenom,
        "carte_national": data.carte_national,
        "mail": data.mail,
        "mot_de_passe": None,
        "role": "client",
        "date_creation": date.today().isoformat()
    }).execute()

    if not utilisateur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")

    id_utilisateur = utilisateur_resp.data[0]["id_utilisateur"]

    # 2️⃣ Création du client
    try:
        client_resp = supabase.table("client").insert({
            "id_utilisateur": id_utilisateur,
            "entreprise": data.entreprise,
            "adresse": data.adresse,
            "telephone": data.telephone,
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'insertion client: {str(e)}")

    id_client = client_resp.data[0]["id_client"]

    # 3️⃣ Log de l'action
    supabase.table("historique_actions").insert({
        "id_utilisateur": current_user["id_utilisateur"],
        "action": "CREATION_CLIENT",
        "cible": json.dumps({
            "id_client": id_client,
            "id_utilisateur": id_utilisateur,
            "nom": data.nom,
            "prenom": data.prenom,
            "entreprise": data.entreprise
        }),
        "date_action": datetime.now().isoformat()
    }).execute()

    # ✅ Réponse
    return {
        "message": "Client créé avec succès",
        "client": client_resp.data[0],
        "utilisateur": utilisateur_resp.data[0]
    }
    
#Permet de mettre à jour un client
def update_client(id_client: int, data: ClientUpdate, current_user: dict):
    # Vérifier si le client existe
    client_resp = supabase.table("client").select("*, utilisateur(*)").eq("id_client", id_client).single().execute()
    if not client_resp.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")

    id_utilisateur = client_resp.data["id_utilisateur"]
    utilisateur_avant = client_resp.data["utilisateur"]
    client_avant = {
        "entreprise": client_resp.data.get("entreprise"),
        "adresse": client_resp.data.get("adresse"),
        "telephone": client_resp.data.get("telephone")
    }

    # 1. Mise à jour des données utilisateur
    utilisateur_update = {
        k: v for k, v in data.dict().items()
        if k in ["nom", "prenom", "mail", "carte_national"] and v is not None
    }

    utilisateur_diff = {}
    if utilisateur_update:
        supabase.table("utilisateur").update(utilisateur_update).eq("id_utilisateur", id_utilisateur).execute()
        for key, new_value in utilisateur_update.items():
            ancien = utilisateur_avant.get(key)
            utilisateur_diff[key] = {"avant": ancien, "après": new_value}

    # 2. Mise à jour des données client
    client_update = {
        k: v for k, v in data.dict().items()
        if k in ["entreprise", "adresse", "telephone"] and v is not None
    }

    client_diff = {}
    if client_update:
        supabase.table("client").update(client_update).eq("id_client", id_client).execute()
        for key, new_value in client_update.items():
            ancien = client_avant.get(key)
            client_diff[key] = {"avant": ancien, "apres": new_value}

    # Vérifier s'il y a eu au moins un changement
    if not utilisateur_diff and not client_diff:
        raise HTTPException(status_code=400, detail="Aucune modification apportée")

    # Log de l'action
    supabase.table("historique_actions").insert({
        "id_utilisateur": current_user["id_utilisateur"],
        "action": "MISE_A_JOUR_CLIENT",
        "cible": json.dumps({
            "id_client": id_client,
            "modifications": {
                "utilisateur": utilisateur_diff,
                "client": client_diff
            }
        }),
        "date_action": date.today().isoformat()
    }).execute()

    return {
        "message": "Client mis à jour avec succès",
        "modifications": {
            "utilisateur": utilisateur_diff,
            "client": client_diff
        }
    }
# #Permet de supprimer un client
def delete_client(id_client: int, current_user: dict):
    # 1. Vérifie si le client existe
    client_resp = supabase.table("client").select("id_utilisateur").eq("id_client", id_client).single().execute()

    if not client_resp.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")

    id_utilisateur = client_resp.data["id_utilisateur"]

    # 2. Supprimer le client
    delete_client_resp = supabase.table("client").delete().eq("id_client", id_client).execute()
    if not delete_client_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression du client")

    # 3. Supprimer l'utilisateur associé
    delete_utilisateur_resp = supabase.table("utilisateur").delete().eq("id_utilisateur", id_utilisateur).execute()
    if not delete_utilisateur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'utilisateur")

    # 4. Log de l'action : suppression client
    supabase.table("historique_actions").insert({
        "id_utilisateur": current_user["id_utilisateur"],
        "action": "SUPPRESSION_CLIENT",
        "cible": json.dumps({
            "id_client": id_client,
            "id_utilisateur": id_utilisateur
        }),
        "date_action": datetime.now().isoformat()
    }).execute()

    return {
        "message": "Client et utilisateur supprimés avec succès",
        "client_supprime": delete_client_resp.data[0],
        "utilisateur_supprime": delete_utilisateur_resp.data[0]
    }