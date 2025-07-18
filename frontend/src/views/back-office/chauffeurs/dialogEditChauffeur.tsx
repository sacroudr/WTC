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

import type { Chauffeur } from '../../../types/chauffeur';

interface DialogEditChauffeurProps {
  open: boolean;
  onClose: () => void;
  chauffeur: Chauffeur | null;
  onUpdated: () => void;
}

const DialogEditChauffeur: React.FC<DialogEditChauffeurProps> = ({
  open,
  onClose,
  chauffeur,
  onUpdated,
}) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    mail: '',
    telephone: '',
    num_permis: '',
    disponibilite: true,
  });
  const [initialData, setInitialData] = useState<typeof formData>(formData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chauffeur) {
      const newData = {
        nom: chauffeur.utilisateur?.nom || '',
        prenom: chauffeur.utilisateur?.prenom || '',
        mail: chauffeur.utilisateur?.mail || '',
        telephone: chauffeur.telephone || '',
        num_permis: chauffeur.num_permis || '',
        disponibilite: chauffeur.disponibilite || false,
      };
      setFormData(newData);
      setInitialData(newData);
    }
  }, [chauffeur]);

  const handleSubmit = async () => {
    if (!chauffeur) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // await axios.put(`${apiUrl}/chauffeurs/update/${chauffeur.id_chauffeur}`, formData);
      await axios.put(
      `${apiUrl}/chauffeurs/update/${chauffeur.id_chauffeur}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      onUpdated();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Erreur Axios:', err.response?.data || err.message);
        setError(err.response?.data?.detail || 'Erreur lors de la mise à jour du chauffeur.');
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
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
        },
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
          bgcolor: theme.palette.grey[100],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="primary">
            Modifier les informations du chauffeur
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
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

      <DialogContent sx={{ bgcolor: theme.palette.grey[50], py: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            bgcolor: 'white',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            Informations générales
          </Typography>

          {/* Champs Nom, Prénom, Email sur la même ligne */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                label="Nom"
                size="small"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                sx={{ flex: 1 }}
                />
                <TextField
                label="Prénom"
                size="small"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                sx={{ flex: 1 }}
                />
                <TextField
                label="Email"
                size="small"
                value={formData.mail}
                onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
                sx={{ flex: 1 }}
                />
            </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                label="Téléphone"
                fullWidth
                size="small"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            />
            <TextField
                label="Numéro de permis"
                fullWidth
                size="small"
                value={formData.num_permis}
                onChange={(e) => setFormData({ ...formData, num_permis: e.target.value })}
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

export default DialogEditChauffeur;
