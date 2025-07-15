import React, { useState } from 'react';
import {
  Dialog, DialogContent, TextField, Button, Box, Typography,
  Paper, IconButton, Snackbar, Alert, useTheme
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface DialogClientAddProps {
  open: boolean;
  onClose: () => void;
  onClientAdded?: () => void;
}

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

const DialogClientAdd: React.FC<DialogClientAddProps> = ({ open, onClose, onClientAdded }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    carte_national: '',
    mail: '',
    entreprise: '',
    adresse: '',
    telephone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}/client/new`, formData);
      onClientAdded?.();
      onClose();
      setFormData({
        nom: '',
        prenom: '',
        carte_national: '',
        mail: '',
        entreprise: '',
        adresse: '',
        telephone: '',
      });
    } catch (error) {
      console.error("Erreur création client :", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la création du client",
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: '',
      prenom: '',
      carte_national: '',
      mail: '',
      entreprise: '',
      adresse: '',
      telephone: '',
    });
    onClose();
  };

  return (
    <>
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
              Ajouter un client
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
            <Typography variant="subtitle1" fontWeight="bold" color="primary">Informations client</Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="nom" label="Nom" fullWidth size="small" value={formData.nom} onChange={handleChange} />
              <TextField name="prenom" label="Prénom" fullWidth size="small" value={formData.prenom} onChange={handleChange} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="carte_national" label="Carte nationale" fullWidth size="small" value={formData.carte_national} onChange={handleChange} />
              <TextField name="telephone" label="Téléphone" fullWidth size="small" value={formData.telephone} onChange={handleChange} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField name="mail" label="Email" fullWidth size="small" type="email" value={formData.mail} onChange={handleChange} />
              <TextField name="entreprise" label="Entreprise" fullWidth size="small" value={formData.entreprise} onChange={handleChange} />
            </Box>

            <TextField name="adresse" label="Adresse" fullWidth size="small" value={formData.adresse} onChange={handleChange} />
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

export default DialogClientAdd;
