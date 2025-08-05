import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import {
  Dialog, DialogContent, TextField, Button, Box, Typography, Paper, IconButton, Snackbar, Alert, useTheme,
  Autocomplete
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface DialogAddChauffeurProps {
  open: boolean;
  handleClose: () => void;
  onChauffeurAdded?: () => void;
}

interface Camion {
  id_camion: number;
  matricule: string;
  modele: string;
}

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';



const DialogAddChauffeur: React.FC<DialogAddChauffeurProps> = ({ open, handleClose, onChauffeurAdded }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    carte_national: '',
    telephone: '',
    mail: '',
    mot_de_passe: '',
    num_permis: '',
    disponibilite: true,
    id_camion: '',
  });

  const [camions, setCamions] = useState<Camion[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertSeverity }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (open) {
      axios.get(`${apiUrl}/camions/disponible`)
        .then(response => {
          setCamions(response.data.camions_sans_chauffeur || []);
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: 'Erreur lors du chargement des camions',
            severity: 'error'
          });
        });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/chauffeurs/new`, 
        formData,
          {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
      );
      handleClose();
      onChauffeurAdded?.();
      setFormData({
        nom: '',
        prenom: '',
        carte_national: '',
        telephone: '',
        mail: '',
        mot_de_passe: '',
        num_permis: '',
        disponibilite: true,
        id_camion: '',
      });
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      alert(err.response?.data?.detail || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
  setFormData({
    nom: '',
    prenom: '',
    carte_national: '',
    telephone: '',
    mail: '',
    mot_de_passe: '',
    num_permis: '',
    disponibilite: true,
    id_camion: '',
  });
};

  const handleCancel = () => {
    resetForm();
    handleClose();
  };

  

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
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
            <AddCircleOutlineIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Ajouter un chauffeur
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
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
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>

        {/* Content */}
        <DialogContent sx={{ bgcolor: theme.palette.grey[50], py: 3 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: 'white' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">Informations personnelles</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="nom" label="Nom" fullWidth size="small" value={formData.nom} onChange={handleChange} />
              <TextField name="prenom" label="Prénom" fullWidth size="small" value={formData.prenom} onChange={handleChange} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="carte_national" label="Carte Nationale" fullWidth size="small" value={formData.carte_national} onChange={handleChange} />
              <TextField name="telephone" label="Téléphone" fullWidth size="small" value={formData.telephone} onChange={handleChange} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="mail" label="Email" type="email" fullWidth size="small" value={formData.mail} onChange={handleChange} />
              <TextField name="num_permis" label="Numéro de permis" fullWidth size="small" value={formData.num_permis} onChange={handleChange} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="mot_de_passe"
                label="Mot de passe"
                type="password"
                fullWidth
                size="small"
                value={formData.mot_de_passe}
                onChange={handleChange}
              />
            </Box>

            <Typography variant="subtitle1" fontWeight="bold" color="primary">Affectation</Typography>
            <Autocomplete
            options={camions}
            getOptionLabel={(option) => `${option.matricule} - ${option.modele}`}
            onChange={(_, value) => {
              setFormData(prev => ({
                ...prev,
                id_camion: value ? value.id_camion.toString() : '',
              }));
            }}
            value={camions.find(c => c.id_camion.toString() === formData.id_camion) || null}
            isOptionEqualToValue={(option, value) => option.id_camion === value.id_camion}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id_camion} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography fontWeight={600} color="text.primary">
                  {option.matricule}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.modele}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sélectionner un camion"
                size="small"
                fullWidth
              />
            )}
          />
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
          <Button onClick={handleCancel} variant="outlined" color="secondary" disabled={submitting}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            variant="contained"
            sx={{
              fontWeight: 'bold',
              background: "linear-gradient(90deg, #3168B1 0%, #E42422 100%)",
              color: "#fff",
              '&:hover': {
                background: "linear-gradient(90deg, #275997 0%, #c51f1d 100%)",
              },
            }}
          >
            {submitting ? 'Création...' : 'Créer'}
          </Button>
        </Box>
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

export default DialogAddChauffeur;
