import React, { useState } from 'react';
import {
  Dialog, DialogContent, TextField, Button, Box, Typography, Paper, IconButton, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios, { AxiosError } from 'axios';

interface DialogAddCamionProps {
  open: boolean;
  onClose: () => void;
  onCamionAdded?: () => void;
}

const DialogAddCamion: React.FC<DialogAddCamionProps> = ({ open, onClose, onCamionAdded }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [formData, setFormData] = useState({
    matricule: '',
    modele: '',
    assurance: '',
    fin_validite_assurance: '',
    visite_technique: '',
    fin_visite_technique: '',
    carte_grise: '',
    fin_carte_grise: '',
    extincteur: false,
    fin_extincteur: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}/camions/new`, {
        ...formData,
        fin_validite_assurance: new Date(formData.fin_validite_assurance),
        fin_visite_technique: new Date(formData.fin_visite_technique),
        fin_carte_grise: new Date(formData.fin_carte_grise),
        fin_extincteur: new Date(formData.fin_extincteur),
      });
      onClose();
      onCamionAdded?.();
    } catch (error: unknown) {
    const err = error as AxiosError<{ detail?: string }>;
    alert(err.response?.data?.detail || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
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
            Ajouter un camion
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
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ bgcolor: theme.palette.grey[50], py: 3 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: 'white' }}>
          
          <Typography variant="subtitle1" fontWeight="bold" color="primary">Informations générales</Typography>
          <Box sx={{display: 'flex', gap: 2 }}>
            <TextField label="Matricule" fullWidth size="small" name="matricule" onChange={handleChange} />
            <TextField label="Modèle" fullWidth size="small" name="modele" onChange={handleChange} />
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" color="primary">Assurance</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Assurance" fullWidth size="small" name="assurance" onChange={handleChange} />
            <TextField label="Fin validité assurance" type="date" fullWidth size="small" name="fin_validite_assurance" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" color="primary">Carte grise</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Carte grise" fullWidth size="small" name="carte_grise" onChange={handleChange} />
            <TextField label="Fin carte grise" type="date" fullWidth size="small" name="fin_carte_grise" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" color="primary">Visite technique</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Visite technique" fullWidth size="small" name="visite_technique" onChange={handleChange} />
            <TextField label="Fin visite technique" type="date" fullWidth size="small" name="fin_visite_technique" onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Box>

          <Typography variant="subtitle1" fontWeight="bold" color="primary">Extincteur</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ minWidth: '100px' }}>Présent :</Typography>
              <label>
                <input type="radio" name="extincteur" value="true" checked={formData.extincteur === true} onChange={() => setFormData(prev => ({ ...prev, extincteur: true }))} />
                Oui
              </label>
              <label>
                <input type="radio" name="extincteur" value="false" checked={formData.extincteur === false} onChange={() => setFormData(prev => ({ ...prev, extincteur: false, fin_extincteur: '' }))} />
                Non
              </label>
            </Box>

            {formData.extincteur && (
              <TextField
                label="Fin extincteur"
                type="date"
                size="small"
                name="fin_extincteur"
                InputLabelProps={{ shrink: true }}
                value={formData.fin_extincteur}
                onChange={handleChange}
              />
            )}
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
        <Button onClick={onClose} variant="outlined" color="secondary" disabled={submitting}>Annuler</Button>
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
  );
};

export default DialogAddCamion;
