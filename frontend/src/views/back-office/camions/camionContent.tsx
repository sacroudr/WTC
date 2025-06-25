// src/components/dashboardContent.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const CamionContent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue sur votre page camions !
      </Typography>
      <Typography variant="body1">
        Gérez vos activités depuis cet espace centralisé le back-office.
      </Typography>
    </Box>
  );
};

export default CamionContent;
