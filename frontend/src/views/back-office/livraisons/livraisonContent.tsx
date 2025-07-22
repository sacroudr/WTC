import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableContainer,
  Divider
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import DialogInfoLivraison from './dialogInfoLivraison';
import type { Voyage } from '../../../types/voyage';

// Bouton de recherche avec gradient
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

const TrackButton = styled(Button)(() => ({
  background: `linear-gradient(90deg, #3168B1 0%, #E42422 100%)`,
  fontFamily: 'open sans',
  color: '#fff',
  borderRadius: '15px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 'bold', 
  padding: '6px 16px',
  '&:hover': {
    opacity: 0.9,
  },
}));

const LivraisonContent: React.FC = () => {
  const [numeroVoyage, setNumeroVoyage] = useState('');
  const [livraisons, setLivraisons] = useState<never[]>([]);
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const apiUrl = import.meta.env.VITE_API_BACK;

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = async (numeroVoyageParam?: string) => {
    try {
      setError(null);
      const numero = numeroVoyageParam || numeroVoyage;
      const response = await axios.get(`${apiUrl}/suivi/${numero}`);
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

  const fetchVoyages = async () => {
    try {
      const response = await axios.get(`${apiUrl}/voyages`);
      setVoyages(response.data.voyages);
    } catch (err) {
      console.error('Erreur lors de la récupération des voyages', err);
    }
  };

  useEffect(() => {
    fetchVoyages();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box sx={{  minHeight: '100vh', pt:2 }}>
        <Box>
          <Paper elevation={4} sx={{ p: 4, borderRadius: '25px', maxWidth: 600, mx: 'auto', mb: 5 }}>
            <Typography variant="h4" fontFamily="Montserrat" fontWeight="bold" textAlign="center" sx={{ background: 'linear-gradient(90deg, #3f51b5, #f50057)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>
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
                    '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                  }}
                />
                <GradientButton onClick={() => handleSearch()}>
                  Rechercher
                </GradientButton>
              </Box>

              {error && (
                <Typography color="error" textAlign="center">
                  {error}
                </Typography>
              )}
            </Box>

            <DialogInfoLivraison open={openDialog} onClose={() => setOpenDialog(false)} livraisons={livraisons} />
          </Paper>

          <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: '#3f3f3f' }}>
            Liste des voyages d’aujourd’hui
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(90deg, #f5a3ae, #c4a9f3)' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Numéro voyage</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Entreprise</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Chauffeur</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Num Matricule</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Track</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {[...voyages]
                  .filter((voyage) => voyage.statut !== "Livraison effectuée")
                  .sort((a, b) => a.id_voyage - b.id_voyage)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((voyage) => (
                    <TableRow key={voyage.id_voyage} hover>
                      <TableCell>{voyage.numero_voyage}</TableCell>
                      <TableCell>{voyage.entreprise}</TableCell>
                      <TableCell>{voyage.nom_client}</TableCell>
                      <TableCell>{voyage.nom_chauffeur}</TableCell>
                      <TableCell>{voyage.matricule}</TableCell>
                      <TableCell>
                        <TrackButton onClick={() => handleSearch(voyage.numero_voyage)}>
                          Track
                        </TrackButton>
                      </TableCell>
                    </TableRow>
                ))}

              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={voyages.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      
    </Box>
  );
};

export default LivraisonContent;
