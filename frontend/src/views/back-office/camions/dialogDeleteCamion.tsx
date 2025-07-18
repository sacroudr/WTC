import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

interface DialogDeleteCamionProps {
  open: boolean;
  handleClose: () => void;
  idCamion: number | null;
  onCamionDeleted: () => void;
}

const DialogDeleteCamion: React.FC<DialogDeleteCamionProps> = ({
  open,
  handleClose,
  idCamion,
  onCamionDeleted,
}) => {
  const apiUrl = import.meta.env.VITE_API_BACK;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (!idCamion) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/camions/delete/${idCamion}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onCamionDeleted();
      handleClose();
    } catch (err: unknown) {
      console.error(err);
      setError("Échec de la suppression du camion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteForeverIcon sx={{ color: '#E42422', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', color: '#1D1D1B' }}>
              Confirmer la suppression
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ backgroundColor: '#f9f9f9', py: 3 }}>
        <Typography sx={{ fontFamily: 'Open Sans, sans-serif', color: '#606264' }}>
          Êtes-vous sûr de vouloir supprimer ce camion ? <br />
          <strong>Cette action est irréversible.</strong>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: '#3168B1',
            borderColor: '#3168B1',
            '&:hover': { borderColor: '#3168B1', backgroundColor: '#f0f0f0' },
          }}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          onClick={handleDelete}
          variant="contained"
          sx={{
            backgroundColor: '#E42422',
            color: '#fff',
            '&:hover': { backgroundColor: '#b91c1b' },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDeleteCamion;
