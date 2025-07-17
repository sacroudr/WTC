
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FaTruck, FaMapMarkedAlt, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import type { Voyage } from '../../../../types/voyage';
import DialogInfoLivraison from '../../livraisons/dialogInfoLivraison';

interface VoyageListProps {
  clientId: number;
}
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

const ITEMS_PER_PAGE = 6;

const VoyageList: React.FC<VoyageListProps> = ({ clientId }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLivraison, setSelectedLivraison] = useState<Livraison[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handleVoyageClick = async (numeroVoyage: string) => {
    try {
      const response = await axios.get(`${apiUrl}/suivi/${numeroVoyage}`);
      setSelectedLivraison(response.data.livraisons);
      setOpenDialog(true);
    } catch (error) {
      console.error("Erreur lors du chargement des livraisons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const res = await axios.get(`${apiUrl}/voyages/client/${clientId}`);
        setVoyages(res.data.voyages);
      } catch (error) {
        console.error("Erreur lors du chargement des voyages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVoyages();
  }, [clientId]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const voyagesSorted = [...voyages].sort((a, b) => a.id_voyage - b.id_voyage);

  const filteredVoyages = voyagesSorted.filter((voyage) =>
    voyage.numero_voyage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voyage.adresse_depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voyage.adresse_arrive.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredVoyages.length / ITEMS_PER_PAGE);
  const voyagesToShow = filteredVoyages.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!loading && voyages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Typography variant="h6" color="text.secondary" fontWeight={500}>
          Ce client n'a pas de voyage.
        </Typography>
      </Box>
    );
  }

  return (
    <Box px={2} py={4} >
      {/* Barre de recherche */}
      <Box display="flex" justifyContent="center" sx={{ mb: 4 }}>
        <TextField
            placeholder="Rechercher un numéro, une adresse de départ ou d'arrivée..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
            }}
            sx={{
            width: '100%',
            maxWidth: 600,
            backgroundColor: '#f9f9f9',
            borderRadius: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                paddingLeft: '12px',
                '& fieldset': {
                borderColor: '#ddd',
                },
                '&:hover fieldset': {
                borderColor: '#ccc',
                },
                '&.Mui-focused fieldset': {
                borderColor: '#3168B1',
                },
            },
            }}
            InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                <Box
                    sx={{
                    backgroundColor: '#eaeaea',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                >
                    <SearchIcon sx={{ color: '#888' }} />
                </Box>
                </InputAdornment>
            ),
            }}
        />
        </Box>


      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
        {voyagesToShow.map((voyage) => {
          const isDelivered = voyage.statut?.toLowerCase().trim() === 'livraison effectuée';
          const isFuture = new Date(voyage.date_depart) > new Date();

          let backgroundColor = '#FFFACD'; // Jaune clair
          if (isDelivered) backgroundColor = '#D1FAE5'; // Vert clair
          else if (isFuture) backgroundColor = '#E6E6FA'; // Lavande

          return (
            <Paper
              key={voyage.id_voyage}
              onClick={() => {
                if (!isDelivered) handleVoyageClick(voyage.numero_voyage);
              }}
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: backgroundColor,
                flex: '1 1 300px',
                maxWidth: 300,
                minWidth: 300,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: isDelivered ? 'default' : 'pointer',
                '&:hover': !isDelivered
                  ? {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    }
                  : {},
              }}
            >
              <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>
                N°{voyage.numero_voyage}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Box mb={1.5} display="flex" alignItems="center" gap={1}>
                <FaCalendarAlt color="#E42422" size={18} />
                <Typography fontSize={15}>
                  <strong>Départ :</strong> {new Date(voyage.date_depart).toLocaleDateString('fr-FR')}
                </Typography>
              </Box>

              <Box mb={1.5} display="flex" alignItems="center" gap={1}>
                <FaMapMarkedAlt color="#E42422" size={18} />
                <Typography fontSize={15}>
                  <strong>De :</strong> {voyage.adresse_depart}
                </Typography>
              </Box>

              <Box mb={1.5} display="flex" alignItems="center" gap={1}>
                <FaMapMarkedAlt color="#E42422" size={18} />
                <Typography fontSize={15}>
                  <strong>À :</strong> {voyage.adresse_arrive}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <FaTruck color="#E42422" size={18} />
                <Typography fontSize={15}>
                  <strong>Chauffeur :</strong> {voyage.nom_chauffeur}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={5}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="secondary"
            shape="rounded"
            size="large"
          />
        </Box>
      )}

      <DialogInfoLivraison
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        livraisons={selectedLivraison}
      />
    </Box>
  );
};

export default VoyageList;
