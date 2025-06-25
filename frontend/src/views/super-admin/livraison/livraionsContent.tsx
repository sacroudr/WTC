// src/components/dashboardContent.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const LivraisonContent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue sur votre livraions A SUPER-ADMIN DZEB !
      </Typography>
      <Typography variant="body1">
        Gérez vos activités depuis cet espace centralisé le super-admin.
      </Typography>
    </Box>
  );
};

export default LivraisonContent;
