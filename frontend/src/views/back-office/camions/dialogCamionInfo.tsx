import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Box,
  
  useTheme,
  Paper,
//   Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import type { Camion } from '../../../types/camion';

interface DialogInfoCamionProps {
  open: boolean;
  handleClose: () => void;
  idCamion: number | null;
}

const DialogCamionInfo: React.FC<DialogInfoCamionProps> = ({ open, handleClose, idCamion }) => {
  const [camion, setCamion] = useState<Camion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_BACK;


  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Date invalide
    return date.toLocaleDateString('fr-FR'); // Retourne dd/mm/yyyy automatiquement en français
  };

  useEffect(() => {
    const fetchCamion = async () => {
      if (idCamion == null) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${apiUrl}/camions/${idCamion}`);
        setCamion(res.data.camion);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des infos du camion");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchCamion();
  }, [idCamion, open, apiUrl]);

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
            sx: {
            borderRadius: 4, // Plus arrondi que la valeur par défaut (qui est 2)
            overflow: 'hidden', // Évite les débordements arrondis
            },
        }}
        >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          pt: 3,
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
            Détails du camion
            </Typography>
        </Box>
        <IconButton
            onClick={handleClose}
            sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: theme.palette.grey[100],
                '&:hover': {
                backgroundColor: theme.palette.grey[300],
                },
                color: theme.palette.grey[700],
                zIndex: 10,
            }}
            >
            <CloseIcon sx={{ fontSize: 24 }} />
            </IconButton>
      </Box>

      <DialogContent sx={{ bgcolor: theme.palette.background.default, py: 3 }}>
        {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
            </Box>
        ) : error ? (
            <Alert severity="error">{error}</Alert>
        ) : camion ? (
            <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
            >
            {/* Première ligne : 3 champs */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <InfoLabel label="Matricule" value={camion.matricule} />
                <InfoLabel label="Modèle" value={camion.modele} />
                <InfoLabel
                label="Chauffeur"
                value={
                    camion.chauffeur_camion?.[0]?.chauffeur?.utilisateur
                    ? `${camion.chauffeur_camion[0].chauffeur.utilisateur.nom} ${camion.chauffeur_camion[0].chauffeur.utilisateur.prenom}`
                    : "Non attribué"
                }
                important={!camion.chauffeur_camion?.[0]?.chauffeur}
                />
            </Box>

            {/* Les autres champs : 2 colonnes */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <InfoLabel label="Carte grise" value={camion.carte_grise} />
                <InfoLabel label="Fin carte grise" value={formatDate(camion.fin_carte_grise)} />
                <InfoLabel label="Assurance" value={camion.assurance} />
                <InfoLabel label="Fin assurance" value={formatDate(camion.fin_validite_assurance)} />
                <InfoLabel label="Visite technique" value={camion.visite_technique} />
                <InfoLabel label="Fin visite technique" value={formatDate(camion.fin_visite_technique)} />
                <InfoLabel label="Extincteur" value={camion.extincteur ? 'Oui' : 'Non'} />
                <InfoLabel label="Fin extincteur" value={formatDate(camion.fin_extincteur)} />
            </Box>
            </Paper>
        ) : (
            <Typography variant="body2" color="text.secondary">
            Aucune donnée à afficher.
            </Typography>
        )}
        </DialogContent>

    </Dialog>
  );
};

const InfoLabel: React.FC<{ label: string; value: string; important?: boolean }> = ({ label, value, important }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="body2"
      fontWeight={500}
      sx={{
        color: important ? 'error.main' : 'text.primary',
        fontStyle: important ? 'italic' : 'normal',
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default DialogCamionInfo;
