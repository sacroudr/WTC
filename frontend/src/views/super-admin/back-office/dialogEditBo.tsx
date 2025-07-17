import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Alert,
  Typography,
  useTheme,
  IconButton,
  Box,
  Paper,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import type { Utilisateur } from '../../../types/utilisateur';

interface DialogEditBoProps {
  open: boolean;
  onClose: () => void;
  backOffice: Utilisateur | null;
  onUpdated: () => void;
}

const DialogEditBo: React.FC<DialogEditBoProps> = ({ open, onClose, backOffice, onUpdated }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    mail: '',
    carte_national: '',
  });

  const [initialData, setInitialData] = useState(formData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (backOffice) {
      const data = {
        nom: backOffice.nom || '',
        prenom: backOffice.prenom || '',
        mail: backOffice.mail || '',
        carte_national: backOffice.carte_national || '',
      };
      setFormData(data);
      setInitialData(data);
    }
  }, [backOffice]);

  const handleSubmit = async () => {
    if (!backOffice) return;
    setSubmitting(true);
    setError(null);
    try {
      await axios.put(`${apiUrl}/backoffice/update/${backOffice.id_utilisateur}`, formData);
      onUpdated();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Erreur Axios:', err.response?.data || err.message);
        setError(err.response?.data?.detail || 'Erreur lors de la mise à jour.');
      } else {
        console.error('Erreur inattendue:', err);
        setError('Erreur inattendue.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const hasChanged = JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
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
          bgcolor: theme.palette.grey[100],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="primary">
            Modifier le back-office
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
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ bgcolor: theme.palette.grey[50], py: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Paper
          elevation={2}
          sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: 'white' }}
        >
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            Informations générales
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Nom"
              size="small"
              fullWidth
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
            <TextField
              label="Prénom"
              size="small"
              fullWidth
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Email"
              size="small"
              fullWidth
              value={formData.mail}
              onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
            />
            <TextField
              label="Carte Nationale"
              size="small"
              fullWidth
              value={formData.carte_national}
              onChange={(e) => setFormData({ ...formData, carte_national: e.target.value })}
            />
          </Box>
        </Paper>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.palette.grey[100],
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <Button onClick={onClose} variant="outlined" color="secondary" disabled={submitting}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || !hasChanged}
          variant="contained"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #275997 0%, #c51f1d 100%)',
            },
          }}
        >
          {submitting ? 'Enregistrement...' : 'Modifier'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DialogEditBo;
