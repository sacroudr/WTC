from fastapi import HTTPException
from config.supabase import supabase
from datetime import date

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
    utilisateur_resp = supabase.table("utilisateur").select("nom, prenom, carte_national").eq("id_utilisateur", client["id_utilisateur"]).execute()
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
def create_client(data: ClientCreate):
    # 1. Création de l'utilisateur (mail et mot_de_passe laissés vides)
    utilisateur_resp = supabase.table("utilisateur").insert({
        "nom": data.nom,
        "prenom": data.prenom,
        "carte_national": data.carte_national,
        "mail": data.mail,  # volontairement vide
        "mot_de_passe": None,  # volontairement vide
        "role": "client",
        "date_creation": date.today().isoformat()
    }).execute()
    
    if not utilisateur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")

    id_utilisateur = utilisateur_resp.data[0]["id_utilisateur"]

    # 2. Création du client avec l'id_utilisateur
    try:
        client_resp = supabase.table("client").insert({
            "id_utilisateur": id_utilisateur,
            "entreprise": data.entreprise,
            "adresse": data.adresse,
            "telephone": data.telephone,
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'insertion client: {str(e)}")
    
    return {
        "message": "Client créé avec succès",
        "client_id": client_resp.data[0]["id_client"]
    }
    
#Permet de mettre à jour un client
def update_client(id_client: int, data: ClientUpdate):
    # Vérifier si le client existe
    client_resp = supabase.table("client").select("*, utilisateur(*)").eq("id_client", id_client).single().execute()
    
    if not client_resp.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")

    id_utilisateur = client_resp.data["id_utilisateur"]

    # 1. Mise à jour des données utilisateur
    utilisateur_update = {k: v for k, v in data.dict().items() if k in ["nom", "prenom", "mail", "carte_national"] and v is not None}
    if utilisateur_update:
        supabase.table("utilisateur").update(utilisateur_update).eq("id_utilisateur", id_utilisateur).execute()

    # 2. Mise à jour des données client
    client_update = {k: v for k, v in data.dict().items() if k in ["entreprise", "adresse", "telephone"] and v is not None}
    if client_update:
        supabase.table("client").update(client_update).eq("id_client", id_client).execute()

    return {"message": "Client mis à jour avec succès"}
    
#Permet de supprimer un client
def delete_client(id_client: int):
    # 1. Vérifie si le client existe
    client_resp = supabase.table("client").select("id_utilisateur").eq("id_client", id_client).single().execute()

    if not client_resp.data:
        raise HTTPException(status_code=404, detail="Client non trouvé")

    id_utilisateur = client_resp.data["id_utilisateur"]

    # 2. Supprimer d'abord le client
    delete_client_resp = supabase.table("client").delete().eq("id_client", id_client).execute()

    if not delete_client_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression du client")

    # 3. Supprimer ensuite l'utilisateur associé
    delete_utilisateur_resp = supabase.table("utilisateur").delete().eq("id_utilisateur", id_utilisateur).execute()

    if not delete_utilisateur_resp.data:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'utilisateur")

    return {"message": "Client et utilisateur supprimés avec succès"}