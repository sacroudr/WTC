import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import DialogInfoLivraison from '../back-office/livraisons/dialogInfoLivraison';

interface Suivi {
  date_maj: string;
  statut: string;
  localisation: string;
  commentaire?: string;
}

interface Livraison {
  id_livraison: number;
  numero_voyage: string;
  suivi: Suivi[];
}
// Bouton gradient
const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: '#fff',
  padding: '10px 30px',
  borderRadius: '30px',
  textTransform: 'none',
  fontSize: '16px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-2px)',
  },
}));

const ContentTracker: React.FC = () => {
  const [numeroVoyage, setNumeroVoyage] = useState('');
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BACK;

  const handleSearch = async () => {
    try {
      setError(null);
      const response = await axios.get(`${apiUrl}/suivi/${numeroVoyage}`);
      setLivraisons(response.data.livraisons);
      setOpenDialog(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Erreur lors de la recherche.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur inconnue lors de la recherche.');
      }
      setLivraisons([]);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 2 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: '25px',
          maxWidth: 600,
          mx: 'auto',
          mb: 5,
        }}
      >
        <Typography
          variant="h4"
          fontFamily="Montserrat"
          fontWeight="bold"
          textAlign="center"
          sx={{
            background: 'linear-gradient(90deg, #3f51b5, #f50057)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Suivi de Livraison
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box display="flex" flexDirection="column" gap={3}>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              value={numeroVoyage}
              onChange={(e) => setNumeroVoyage(e.target.value)}
              placeholder="WTC-20250708-00016"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                },
              }}
            />
            <GradientButton onClick={handleSearch}>Rechercher</GradientButton>
          </Box>

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
        </Box>

        <DialogInfoLivraison
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          livraisons={livraisons}
        />
      </Paper>
    </Box>
  );
};

export default ContentTracker;
