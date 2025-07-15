// src/components/Client_BackOffice/DialogClientDelete.tsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, CircularProgress, Alert, Box, IconButton, Divider
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface DialogClientDeleteProps {
  open: boolean;
  handleClose: () => void;
  idClient: number | null;
  onClientDeleted: () => void;
}

const DialogClientDelete: React.FC<DialogClientDeleteProps> = ({
  open,
  handleClose,
  idClient,
  onClientDeleted
}) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!idClient) return;
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${apiUrl}/client/delete/${idClient}`);
      onClientDeleted();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Échec de la suppression du client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteForeverIcon sx={{ color: '#E42422', fontSize: 32 }} />
            <Typography variant="h6">Confirmer la suppression</Typography>
          </Box>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ backgroundColor: '#f9f9f9', py: 3 }}>
        <Typography>
          Êtes-vous sûr de vouloir supprimer ce client ?
          <br /><strong>Cette action est irréversible.</strong>
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>Annuler</Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogClientDelete;
