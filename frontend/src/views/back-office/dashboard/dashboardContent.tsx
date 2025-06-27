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
import DialogCamion from './dialogCamion';

const DashboardContent: React.FC = () => {
  const [camions, setCamions] = useState<Camion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

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
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            backgroundColor: 'background.default',
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(90deg, #f5a3ae, #c4a9f3)',
                }}
              >
                {['Numéro matricule','Modèle' , 'Carte grise', 'Visite technique'].map((label) => (
                  <TableCell
                    key={label}
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '1rem',
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {camions.slice(0, 5).map((camion) => (
                <TableRow
                  key={camion.id_camion}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                    transition: 'background-color 0.3s',
                  }}
                >
                  <TableCell align="center" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {camion.matricule}
                  </TableCell>
                  <TableCell align="center" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {camion.modele}
                  </TableCell>
                  <TableCell align="center" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {camion.assurance}
                  </TableCell>
                  <TableCell align="center" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                    {camion.visite_technique}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              px: 2,
              py: 1.5,
              backgroundColor: 'background.default',
            }}
          >
            <Button
              variant="text"
              endIcon={<ArrowForward />}
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                textTransform: 'none',
                fontFamily: 'Open Sans, sans-serif',
                '&:hover': {
                  color: 'secondary.main',
                },
              }}
              onClick={() => setOpenDialog(true)}
            >
              Plus de détails
            </Button>
            <DialogCamion
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              camions={camions}
            />
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
