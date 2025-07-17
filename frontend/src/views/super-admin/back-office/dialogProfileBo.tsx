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
  Divider,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import axios from 'axios';
import type { Utilisateur } from '../../../types/utilisateur';

interface DialogProfileBoProps {
  open: boolean;
  onClose: () => void;
  backOfficeId: number | null;
}

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

const DialogProfileBo: React.FC<DialogProfileBoProps> = ({ open, onClose, backOfficeId }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const [boDetails, setBoDetails] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertSeverity }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (!backOfficeId || !open) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${apiUrl}/backoffice/${backOfficeId}`);
        // Backend retourne : { message: ..., utilisateur: {...} }
        setBoDetails(response.data.backoffice_user.utilisateur);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement du profil back-office');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [backOfficeId, open]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden' },
        }}
      >
        {/* Header */}
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
            <PersonOutlineIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Profil Back-Office
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: theme.palette.grey[100],
              '&:hover': { backgroundColor: theme.palette.grey[300] },
              color: theme.palette.grey[700],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <DialogContent sx={{ bgcolor: theme.palette.background.default, py: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : boDetails ? (
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
              <SectionTitle title="Informations générales" />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <InfoItem label="Nom" value={boDetails.nom || '-'} />
                <InfoItem label="Prénom" value={boDetails.prenom || '-'} />
                <InfoItem label="Email" value={boDetails.mail || '-'} />
                <InfoItem label="Carte Nationale" value={boDetails.carte_national || '-'} />
              </Box>
              {/* Ajoute d'autres champs spécifiques si besoin */}
              <Divider sx={{ my: 2 }} />
            </Paper>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucune donnée à afficher.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Composant pour les sections
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
    {title}
  </Typography>
);

// Composant pour chaque champ d'information
const InfoItem: React.FC<{ label: string; value: string; important?: boolean }> = ({ label, value, important }) => (
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

export default DialogProfileBo;
