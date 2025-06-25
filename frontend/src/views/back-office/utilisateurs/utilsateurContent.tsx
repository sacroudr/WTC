// src/components/dashboardContent.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const UtilisateurContent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue sur votre utilisateur a tbi !
      </Typography>
      <Typography variant="body1">
        Gérez vos activités depuis cet espace centralisé le back-office.
      </Typography>
    </Box>
  );
};

export default UtilisateurContent;
