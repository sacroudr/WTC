// src/views/super-admin/back-office/dialogAddBo.tsx

import React, { useState } from 'react';
import {
  Dialog, DialogContent, TextField, Button, Box, Typography, Paper, IconButton, Snackbar, Alert, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';

interface DialogAddBoProps {
  open: boolean;
  handleClose: () => void;
  onBoAdded?: () => void;
}

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

const DialogAddBo: React.FC<DialogAddBoProps> = ({ open, handleClose, onBoAdded }) => {
  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_BACK;

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    carte_national: '',
    mail: '',
    mot_de_passe: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertSeverity }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}/backoffice/new`, formData); // 👉 adapte le endpoint si différent
      // ✅ Réinitialisation du formulaire
      setFormData({
       nom: '',
       prenom: '',
       carte_national: '',
       mail: '',
       mot_de_passe: '',
      });
      onBoAdded?.();
      handleClose();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Erreur lors de la création',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ nom: '', prenom: '', carte_national: '', mail: '', mot_de_passe: '' });
    handleClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <Box sx={{ px: 3, pt: 3, pb: 1, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.grey[100], display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddCircleOutlineIcon sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">Ajouter un back-office</Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: theme.palette.grey[700] }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ bgcolor: theme.palette.grey[50], py: 3 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="nom" label="Nom" fullWidth size="small" value={formData.nom} onChange={handleChange} />
              <TextField name="prenom" label="Prénom" fullWidth size="small" value={formData.prenom} onChange={handleChange} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="carte_national" label="Carte Nationale" fullWidth size="small" value={formData.carte_national} onChange={handleChange} />
              <TextField name="mail" label="Email" type="email" fullWidth size="small" value={formData.mail} onChange={handleChange} />
            </Box>

            <TextField name="mot_de_passe" label="Mot de passe" type="password" fullWidth size="small" value={formData.mot_de_passe} onChange={handleChange} />
          </Paper>
        </DialogContent>

        <Box sx={{ px: 3, py: 2, bgcolor: theme.palette.grey[100], borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleCancel} variant="outlined" color="secondary" disabled={submitting}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={submitting} variant="contained"
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

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default DialogAddBo;
