import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Pagination,
} from '@mui/material';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EngineeringIcon from '@mui/icons-material/Engineering';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { FiTruck } from 'react-icons/fi';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import DialogCamionInfo from './dialogCamionInfo';
import type { Camion } from '../../../types/camion';
import DialogCamionEdit from './dialogCamionEdit';

interface CamionContentProps {
  refreshTrigger: number;
}

const CamionContent: React.FC<CamionContentProps> = ({ refreshTrigger }) => {
  const [camions, setCamions] = useState<Camion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCamionId, setSelectedCamionId] = useState<number | null>(null);
  const [dialogOpenInfo, setDialogOpenInfo] = useState(false);  
  const [dialogOpenEdit, setDialogOpenEdit] = useState(false);  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const apiUrl = import.meta.env.VITE_API_BACK;

  const openDialogInfo = (id: number) => {
    setSelectedCamionId(id);
    setDialogOpenInfo(true);
  };

  const closeDialogInfo = () => {
    setDialogOpenInfo(false);
    setSelectedCamionId(null);
  };

  const openDialogEdit = (id: number) => {
    setSelectedCamionId(id);
    setDialogOpenEdit(true);
  };

  const closeDialogEdit = () => {
    setDialogOpenEdit(false);
    setSelectedCamionId(null);
  };

  const getNomPrenomChauffeur = (camion: Camion) => {
    if (camion.chauffeur_camion?.length && camion.chauffeur_camion[0].chauffeur?.utilisateur) {
      const user = camion.chauffeur_camion[0].chauffeur.utilisateur;
      return `${user.prenom} ${user.nom}`;
    }
    return <span style={{ color: 'E42422' }}>Non assigné</span>;
  };

  const fetchCamions = async () => {
    try {
      const res = await axios.get(`${apiUrl}/camions/`);
      if (res.data && Array.isArray(res.data.camions)) {
        const sortedCamions = res.data.camions.sort(
          (a: Camion, b: Camion) => a.id_camion - b.id_camion
        );
        setCamions(sortedCamions);
      } else {
        setCamions([]);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des camions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamions();
  }, [refreshTrigger]);

  const filteredCamions = camions.filter((camion) => {
    const query = searchQuery.toLowerCase();
    const matricule = camion.matricule?.toLowerCase() || '';
    const modele = camion.modele?.toLowerCase() || '';
    const chauffeur = camion.chauffeur_camion?.[0]?.chauffeur?.utilisateur;
    const chauffeurNomPrenom = chauffeur
      ? `${chauffeur.prenom} ${chauffeur.nom}`.toLowerCase()
      : '';
    return (
      matricule.includes(query) ||
      modele.includes(query) ||
      chauffeurNomPrenom.includes(query)
    );
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on new search
  }, [searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCamions = filteredCamions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
        <TextField
          placeholder="Rechercher par matricule, modèle ou chauffeur…"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      ) : camions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 3 }}>Aucun camion trouvé.</Alert>
      ) : (
        <>
          <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'flex-start',
    mt: 2,
  }}
>
  {currentCamions.map((camion) => (
    <Box
      key={camion.id_camion}
      sx={{
        width: 'calc(25% - 24px)', // 4 cards per row, with 24px gap
        minWidth: 260,
        boxSizing: 'border-box',
      }}
    >
                <Paper
                  elevation={4}
                  sx={{
                    position: 'relative',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    padding: 3,
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: 7,
                      background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      zIndex: 10,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <EditOutlinedIcon
                      sx={{ color: '#3168B1', cursor: 'pointer' }}
                      titleAccess="Modifier"
                      onClick={() => openDialogEdit(camion.id_camion)}
                    />
                    <InfoOutlinedIcon
                      sx={{ color: '#3168B1', cursor: 'pointer' }}
                      titleAccess="Informations"
                      onClick={() => openDialogInfo(camion.id_camion)}
                    />
                  </Box>

                  <Box sx={{ width: '100%', mt: 4 }}>
                    <Typography
                      fontWeight="bold"
                      fontSize="1.1rem"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Box component={FiTruck} size={20} sx={{ color: '#E42422' }} />
                      {camion.matricule}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Modèle : <strong>{camion.modele}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chauffeur : <strong>{getNomPrenomChauffeur(camion)}</strong>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 'auto', width: '100%' }}>
                    {/* Carte grise */}
                    {(() => {
                      const now = new Date();
                      const fin = new Date(camion.fin_carte_grise);
                      const diff = Math.ceil((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      let color = '#9e9e9e';
                      if (diff < 0) color = '#E42422';
                      else if (diff <= 30) color = '#FFA500';
                      return <CreditCardIcon sx={{ color }} />;
                    })()}
                    {/* Visite technique */}
                    {(() => {
                      const now = new Date();
                      const fin = new Date(camion.fin_visite_technique);
                      const diff = Math.ceil((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      let color = '#9e9e9e';
                      if (diff < 0) color = '#E42422';
                      else if (diff <= 30) color = '#FFA500';
                      return <EngineeringIcon sx={{ color }} />;
                    })()}
                    {/* Assurance */}
                    {(() => {
                      const now = new Date();
                      const fin = new Date(camion.fin_validite_assurance);
                      const diff = Math.ceil((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      let color = '#9e9e9e';
                      if (diff < 0) color = '#E42422';
                      else if (diff <= 30) color = '#FFA500';
                      return <AssignmentTurnedInIcon sx={{ color }} />;
                    })()}
                    {/* Extincteur */}
                    {(() => {
                      const now = new Date();
                      if (!camion.extincteur) {
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FireExtinguisherIcon sx={{ color: '#9e9e9e' }} />
                            <WarningAmberOutlinedIcon sx={{ color: '#E42422' }} />
                          </Box>
                        );
                      } else {
                        const fin = new Date(camion.fin_extincteur);
                        const diff = Math.ceil((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        let color = '#9e9e9e';
                        if (diff < 0) color = '#E42422';
                        else if (diff <= 30) color = '#FFA500';
                        return <FireExtinguisherIcon sx={{ color }} />;
                      }
                    })()}
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {filteredCamions.length > itemsPerPage && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(filteredCamions.length / itemsPerPage)}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="secondary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}

      <DialogCamionInfo
        open={dialogOpenInfo}
        handleClose={closeDialogInfo}
        idCamion={selectedCamionId}
      />
      <DialogCamionEdit
        open={dialogOpenEdit}
        handleClose={closeDialogEdit}
        idCamion={selectedCamionId}
        onCamionUpdated={() => {
          fetchCamions();
          setSuccessMessage("Camion modifié avec succès !");
        }}
      />
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSuccessMessage(null)} sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default CamionContent;
