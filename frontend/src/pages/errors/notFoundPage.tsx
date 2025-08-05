import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      px={2}
    >
      {/* Gros emoji */}
      <Typography fontSize="6rem" mb={2}>😵‍💫</Typography>

      <Typography variant="h2" gutterBottom>404</Typography>
      <Typography variant="h5" gutterBottom>Oups ! Page non trouvée</Typography>
      <Typography variant="body1" mb={4}>
        La page que vous cherchez n'existe pas ou a été déplacée.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/accueil')}
      >
        Retour à l'accueil
      </Button>
    </Box>
  );
};

export default NotFoundPage;
