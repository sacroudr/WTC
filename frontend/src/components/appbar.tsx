import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Drawer, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import ProfileUserPopover from "./profileUser";





// Composant AppBar avec notifications
const AppBarComponent: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  // État pour gérer l'ouverture/fermeture du tiroir
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

 function getInitialsFromToken(): string {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    let prenom = "";
    let nom = "";

    // Si les champs sont absents, on tente via le mail
    if (decoded.mail) {
      const mailParts = decoded.mail.split("@")[0].split(".");
      prenom = mailParts[0] || "";
      nom = mailParts[1] || "";
    }

    const initiales = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
    return initiales;
  } catch (err) {
    console.error("Erreur dans le décodage du token:", err);
    return "";
  }
}

  // Fonction pour ouvrir/fermer le tiroir
  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  // Exemple de notifications avec des statuts
  const notifications = [
    { id: 1, text: "Nouvelle tâche assignée", status: "important" },
    { id: 2, text: "Message de l'équipe", status: "info" },
    { id: 3, text: "Mise à jour de votre projet", status: "warning" },
    { id: 4, text: "Rappel : Réunion à 14h", status: "default" },
  ];

  // Fonction pour déterminer la couleur de l'icône en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "important":
        return "#FF4D4F"; // Rouge
      case "info":
        return "#1890FF"; // Bleu
      case "warning":
        return "#FAAD14"; // Jaune
      default:
        return "#8C8C8C"; // Gris
    }
  };

  return (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      padding: "16px",
      backgroundColor: "#F3F3F5",
      marginLeft: "280px",
    }}
  >
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        maxWidth: "1200px",
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        //   px: 2,
        }}  
      >

        {/* Icônes à droite */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 3 }}>
          <IconButton aria-label="notifications" onClick={toggleDrawer(true)}>
            <NotificationsIcon sx={{ color: "#000" }} />
          </IconButton>

          {/* Avatar utilisateur stylisé */}
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: "#EAE2F8",
              color: "#7E57C2",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "0 0 8px rgba(126, 87, 194, 0.6)",
              },
            }}
            onClick={handleAvatarClick}
          >
            {getInitialsFromToken()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>

    {/* Drawer des notifications */}
    <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      {/* (Pas besoin de changer cette partie) */}
      <Box
          sx={{
            width: 350,
            padding: 2,
            backgroundColor: "#F9F9F9",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2, color: "#333", fontWeight: "bold" }}>
            Notifications
          </Typography>
          <Divider />

          <List sx={{ marginTop: 1 }}>
            {/* Boucle pour afficher les notifications */}
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginBottom: "8px",
                  "&:hover": { backgroundColor: "#F5F5F5" },
                  transition: "all 0.3s ease",
                }}
              >
                {/* Avatar avec icône circulaire de couleur selon le statut */}
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      backgroundColor: getStatusColor(notification.status),
                      width: 32,
                      height: 32,
                    }}
                  >
                    <CircleIcon sx={{ fontSize: 14, color: "#FFFFFF" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.text}
                  primaryTypographyProps={{ sx: { color: "#333", fontWeight: "500" } }}
                />
              </ListItem>
            ))}
          </List>

          {/* Bouton pour fermer le tiroir */}
          <Box sx={{ marginTop: "auto", textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#888",
                cursor: "pointer",
                "&:hover": { color: "#555" },
                transition: "color 0.3s ease",
              }}
              onClick={toggleDrawer(false)}
            >
              Fermer
            </Typography>
          </Box>
        </Box>
    </Drawer>
    <ProfileUserPopover anchorEl={anchorEl} open={open} onClose={handleClose} />


  </Box>
);

};

export default AppBarComponent;
