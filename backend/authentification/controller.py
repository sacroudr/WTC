from datetime import date
from fastapi import HTTPException
from config.supabase import supabase

from .utils import hash_password
from .utils import verify_password
from .utils import create_access_token

from .models import UserCreate
from .models import UserLogin 

def register_user(user: UserCreate):
    existing_user = supabase.table("utilisateur").select("*").eq("mail", user.mail).execute()
    if existing_user.data:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé.")

    hashed = hash_password(user.mot_de_passe)

    result = supabase.table("utilisateur").insert({
        "nom": user.nom,
        "prenom": user.prenom,
        "carte_national": user.carte_national,
        "mail": user.mail,
        "mot_de_passe": hashed,
        "role": 'back-office',
        "date_creation": date.today().isoformat()
    }).execute()

    return {"message": "Utilisateur créé avec succès", "utilisateur": result.data[0]}

# def login_user(user: UserLogin):
#     # Chercher l'utilisateur dans la base
#     response = supabase.table("utilisateur").select("*").eq("mail", user.mail).execute()
    
#     if not response.data:
#         raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")
    
#     utilisateur = response.data[0]
    
#     # Vérifier le mot de passe
#     if not verify_password(user.mot_de_passe, utilisateur["mot_de_passe"]):
#         raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")
    
#     # Ici, on pourrait générer un token JWT si besoin (non inclus ici)
    
#     # Retourner les infos utiles sans le mot de passe
#     utilisateur_sans_mdp = {k: v for k, v in utilisateur.items() if k != "mot_de_passe"}
    
#     return {
#         "message": "Connexion réussie",
#         "utilisateur": utilisateur_sans_mdp
#     }

def login_user(user: UserLogin):
    # Chercher l'utilisateur
    response = supabase.table("utilisateur").select("*").eq("mail", user.mail).execute()
    
    if not response.data:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")
    
    utilisateur = response.data[0]
    
    # Vérifier le mot de passe
    if not verify_password(user.mot_de_passe, utilisateur["mot_de_passe"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")
    
    # Générer le token JWT
    token_data = {"id_utilisateur": utilisateur["id_utilisateur"], "mail": utilisateur["mail"], "role": utilisateur["role"]}
    token = create_access_token(token_data)

    # Mettre à jour le token dans la base
    supabase.table("utilisateur").update({"token": token}).eq("id_utilisateur", utilisateur["id_utilisateur"]).execute()

    # Retourner les infos utilisateur sans mot de passe
    utilisateur_sans_mdp = {k: v for k, v in utilisateur.items() if k != "mot_de_passe"}
    utilisateur_sans_mdp["token"] = token

    return {
        "message": "Connexion réussie",
        "utilisateur": utilisateur_sans_mdp
    }