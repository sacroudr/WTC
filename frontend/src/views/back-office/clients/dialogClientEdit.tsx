import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, Button, TextField,
  Typography, Box, Paper, Alert, IconButton, useTheme
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import type { ClientApiResponse } from '../../../types/client';

interface Props {
  open: boolean;
  onClose: () => void;
  idClient: number | null;
  onClientUpdated: (updatedClient: ClientApiResponse) => void;
}

const DialogClientEdit: React.FC<Props> = ({ open, onClose, idClient, onClientUpdated }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    mail: '',
    carte_national: '',
    entreprise: '',
    adresse: '',
    telephone: '',
  });

  const [initialData, setInitialData] = useState(formData);

  useEffect(() => {
    if (idClient && open) {
      setLoading(true);
      axios.get(`${apiUrl}/client/${idClient}`)
        .then(res => {
          const user = res.data.utilisateur;
          const newData = {
            nom: user.nom,
            prenom: user.prenom,
            mail: user.mail,
            carte_national: user.carte_national || '',
            entreprise: res.data.entreprise,
            adresse: res.data.adresse,
            telephone: res.data.telephone,
          };
          setFormData(newData);
          setInitialData(newData);
        })
        .catch(() => setError('Erreur lors du chargement des données'))
        .finally(() => setLoading(false));
    }
  }, [idClient, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!idClient) return;
    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem('token');
    axios.put(`${apiUrl}/client/update/${idClient}`, formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => {
        onClientUpdated(res.data.client || res.data);
        onClose();
      })
      .catch(() => setError('Échec de la mise à jour'))
      .finally(() => setSubmitting(false));
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
            Modifier les informations du client
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

      {/* Contenu */}
      <DialogContent sx={{ bgcolor: theme.palette.grey[50], py: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && (
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
              Informations personnelles
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                size="small"
                fullWidth
              />
              <TextField
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                size="small"
                fullWidth
              />
              <TextField
                label="Email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                size="small"
                fullWidth
              />
            </Box>

            <TextField
              label="CIN"
              name="carte_national"
              value={formData.carte_national}
              onChange={handleChange}
              size="small"
              fullWidth
            />

            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Informations entreprise
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Entreprise"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleChange}
                size="small"
                fullWidth
              />
              <TextField
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                size="small"
                fullWidth
              />
              <TextField
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                size="small"
                fullWidth
              />
            </Box>
          </Paper>
        )}
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
          {submitting ? 'Sauvegarde...' : 'Enregistrer'}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DialogClientEdit;
