import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BACK;

const DashboardHeader: React.FC = () => {
  const [prenom, setPrenom] = useState<string | null>(null);

  // Récupère le prénom à partir du token JWT
  const fetchUserPrenom = async () => {
    const token = localStorage.getItem("token"); // Assure-toi que le token s'appelle "token"

    if (!token) {
      console.error("Token non trouvé");
      return;
    }

    try {
      // Décoder le token pour extraire l'ID utilisateur
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const userId = payload.id_utilisateur;

      const response = await axios.get(`${apiUrl}/utilisateurs/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.utilisateur;
      setPrenom(user.prenom || null);
    } catch (error) {
      console.error("Erreur lors de la récupération du prénom :", error);
      setPrenom(null);
    }
  };

  useEffect(() => {
    fetchUserPrenom();
  }, []);

  return (
    <Box
      sx={{
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: 1,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="#333">
        {prenom ? `Bonjour, ${prenom}` : "Bonjour Utilisateur"}
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Aujourd'hui, {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </Typography>
    </Box>
  );
};

export default DashboardHeader;
