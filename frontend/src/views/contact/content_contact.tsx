// src/views/content_contact.tsx
import React from 'react';
import { Box, Typography, TextField, Button, Container, Paper } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

const Content_Contact: React.FC = () => {
//   const theme = useTheme();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          Contactez-nous
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Une question ? Un besoin spécifique ? N’hésitez pas à nous envoyer un message via le formulaire ci-dessous.
        </Typography>

        <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Nom"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Envoyer
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Content_Contact;
