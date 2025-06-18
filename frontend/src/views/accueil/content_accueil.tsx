import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Content_Accueil: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        padding: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" component="h1" color="primary" gutterBottom>
        Bienvenue sur notre plateforme !
      </Typography>
      <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mb: 3 }}>
        Gérez vos livraisons efficacement, suivez vos trajets en temps réel, et simplifiez votre logistique.
      </Typography>
      <Button variant="contained" color="primary" size="large">
        Commencer
      </Button>
    </Box>
  );
};

export default Content_Accueil;
