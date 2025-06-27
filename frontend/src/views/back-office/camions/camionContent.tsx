// src/components/CamionContent.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Snackbar,
} from '@mui/material';
import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // ✅ Assurance
import EngineeringIcon from '@mui/icons-material/Engineering'; // ✅ Visite technique
import CreditCardIcon from '@mui/icons-material/CreditCard'; // ✅ Carte grise
import { FiTruck } from 'react-icons/fi';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
// import { Button } from '@mui/material';


// import CamionInfo from './camionInfo';
import DialogCamionInfo from './dialogCamionInfo';

import type { Camion } from '../../../types/camion';
import DialogCamionEdit from './dialogCamionEdit';
// import { useTheme } from '@mui/material/styles'; // Si tu veux utiliser le thème MUI
const CamionContent: React.FC = () => {
  const [camions, setCamions] = useState<Camion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedCamionId, setSelectedCamionId] = useState<number | null>(null);

  const [dialogOpenInfo, setDialogOpenInfo] = useState(false);  
  const [dialogOpenEdit, setDialogOpenEdit] = useState(false);  

  // const open = Boolean(anchorEl);
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

  // Pour fetch le nom du chauffeur
  const getNomPrenomChauffeur = (camion: Camion) => {
  if (camion.chauffeur_camion?.length && camion.chauffeur_camion[0].chauffeur?.utilisateur) {
    const user = camion.chauffeur_camion[0].chauffeur.utilisateur;
    return `${user.prenom} ${user.nom}`;
  }
  return <span style={{ color: 'E42422' }}>Non assigné</span>;
};

  // Fonction pour récupérer les camions
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
  }, [apiUrl]);

  
  return (
    <Box sx={{ p: 3 }}>
      {/* Titre + Info Bulle + Bouton Ajouter */}
      {/* <Box mb={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography
            variant="h4"
            sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
          >
            Camions
          </Typography>
          <CamionInfo />
        </Box> */}

        {/* Bouton sous le titre */}
        {/* <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          onClick={() => {
            setSelectedCamionId(null); // pour créer un nouveau camion
            setDialogOpenEdit(true);
          }}
        >
          + Camion
        </Button>
      </Box> */}

      {/* État de chargement ou erreur */}
      {loading ? (
        <Box textAlign="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      ) : camions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 3 }}>Aucun camion trouvé.</Alert>
      ) : (
        <Grid container spacing={3} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
          {camions.map((camion) => (
            <Box
              key={camion.id_camion}
              sx={{
                flex: '0 0 23%',
                maxWidth: '23%',
                padding: '0 12px',
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

                {/* Actions (modifier/info) */}
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

                {/* Info camion */}
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

                {/* Icônes bas */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 'auto', width: '100%' }}>
                  {(() => {
                    const now = new Date();
                    const finCarte = new Date(camion.fin_carte_grise);
                    const diffTime = finCarte.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    let iconColor = '#9e9e9e'; // gris par défaut

                    if (diffDays < 0) {
                      iconColor = '#E42422'; // rouge : expiré
                    } else if (diffDays <= 30) {
                      iconColor = '#FFA500'; // jaune : moins de 30 jours
                    }

                    return <CreditCardIcon sx={{ color: iconColor }} />;
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
                        // extincteur = false => afficher extincteur gris + warning rouge
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FireExtinguisherIcon sx={{ color: '#9e9e9e' }} />
                            <WarningAmberOutlinedIcon sx={{ color: '#E42422' }} />
                          </Box>
                        );
                      } else {
                        // extincteur = true => afficher selon la date fin_extincteur
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
        </Grid>
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
        fetchCamions(); // recharge la liste
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
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
    
  );
};

export default CamionContent;
