from fastapi import FastAPI

from authentification.routes import router as auth_router
from utilisateur.routes import router as utilisateur_router
from chauffeurs.routes import router as chauffeurs_router
from back_office.routes import router as back_office_router
from client.routes import router as client_router
from camion.routes import router as camion_router
from voyage.routes import router as voyage_router

app = FastAPI()

# Inclure les routes
app.include_router(auth_router)
app.include_router(utilisateur_router)
app.include_router(chauffeurs_router)
app.include_router(back_office_router)
app.include_router(client_router)
app.include_router(camion_router)
app.include_router(voyage_router)