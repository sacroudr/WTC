// src/components/dashboardContent.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import type { Camion } from '../../../types/camion'; // adapte ce chemin si besoin

const DashboardContent: React.FC = () => {
  const [camions, setCamions] = useState<Camion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_BACK;

  useEffect(() => {
    const fetchCamions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/camions/`);
        if (response.data && Array.isArray(response.data.camions)) {
          setCamions(response.data.camions);
        } else {
          setCamions([]);
        }
      } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Erreur Axios :', err.message);
        setError('Erreur réseau : impossible de contacter le serveur.');
      } else {
        console.error('Erreur inattendue :', err);
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
        setLoading(false);
      }
    };

    fetchCamions();
  }, [apiUrl]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Liste des camions
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : camions && camions.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(90deg, #f5a3ae, #c4a9f3)',
                }}
              >
                <TableCell sx={{ fontWeight: 'bold', color: '#1D1D1B' }}>
                  Modèle
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1D1D1B' }}>
                  Numéro matricule
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1D1D1B' }}>
                  Carte grise
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1D1D1B' }}>
                  Visite technique
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {camions.map((camion) => (
                <TableRow key={camion.id_camion}>
                  <TableCell>{camion.modele}</TableCell>
                  <TableCell>{camion.matricule}</TableCell>
                  <TableCell>{camion.assurance}</TableCell>
                  <TableCell>{camion.visite_technique}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              px: 2,
              py: 1.5,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Button
              variant="text"
              endIcon={<ArrowForward />}
              sx={{
                color: '#1D1D1B',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              Plus de détails
            </Button>
          </Box>
        </TableContainer>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucun camion trouvé.
        </Alert>
      )}
    </Box>
  );
};

export default DashboardContent;
