import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function App() {
  return (
    <Container maxWidth="sm" style={{ marginTop: 50, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Bienvenue sur MUI !
      </Typography>
      <Button variant="contained" color="primary">
        Clic moi
      </Button>
    </Container>
  );
}
