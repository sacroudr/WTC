// src/components/dashboardContent.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const DashboardContent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue sur votre tableau de bord !
      </Typography>
      <Typography variant="body1">
        Gérez vos activités depuis cet espace centralisé le client.
      </Typography>
    </Box>
  );
};

export default DashboardContent;
