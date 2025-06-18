// src/views/content_apropos.tsx
import React from 'react';
import {  Typography, Container, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Content_Apropos: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          À propos de notre plateforme
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Notre mission est de révolutionner la logistique en proposant une plateforme intuitive et performante.
          Que vous soyez un client, un chauffeur ou un membre du back-office, vous trouverez tous les outils nécessaires pour faciliter vos opérations.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Nous mettons l’accent sur la transparence, la traçabilité et l’optimisation des trajets pour améliorer l’efficacité globale de vos livraisons.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Notre équipe est composée de passionnés de technologie et de logistique, engagés à fournir la meilleure expérience possible à nos utilisateurs.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Content_Apropos;
