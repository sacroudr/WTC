from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from authentification.routes import router as auth_router
from utilisateur.routes import router as utilisateur_router
from chauffeurs.routes import router as chauffeurs_router
from back_office.routes import router as back_office_router
from client.routes import router as client_router
from camion.routes import router as camion_router
from voyage.routes import router as voyage_router
from suivi_livraison.routes import router as suivi_livraison_router

app = FastAPI()

# ✅ Autoriser les requêtes du front (ex : localhost:3000 pour React en dev)
origins = [
    "http://localhost:5173",        # React dev  # ajoute ton domaine en production si besoin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # ou ["*"] pour tout autoriser (déconseillé en prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(auth_router)
app.include_router(utilisateur_router)
app.include_router(chauffeurs_router)
app.include_router(back_office_router)
app.include_router(client_router)
app.include_router(camion_router)
app.include_router(voyage_router)
app.include_router(suivi_livraison_router)