from fastapi import FastAPI
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Les variables SUPABASE_URL ou SUPABASE_KEY sont manquantes")

# Instanciation du client Supabase
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI with Supabase!"}

@app.get("/utilisateurs")
def list_utilisateurs():
    response = supabase_client.table("utilisateur").select("*").execute()
    return response.data
   
