import { Container, Typography, Button, Paper } from '@mui/material';

export default function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Bienvenue sur ma plateforme
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Ceci est un texte de démonstration pour vérifier si le thème fonctionne avec Open Sans pour le texte principal et Montserrat pour les titres.
        </Typography>

        <Button variant="contained" color="secondary" sx={{ mr: 2 }}>
          Action principale
        </Button>
        <Button variant="outlined" color="primary">
          Action secondaire
        </Button>
      </Paper>
    </Container>
  );
}
