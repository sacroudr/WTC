// // src/components/DialogChauffeurDelete.tsx
// import React from 'react'
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button
// } from '@mui/material'
// import axios from 'axios'

// import type { Chauffeur } from '../../../types/chauffeur'

// interface DialogChauffeurDeleteProps {
//   open: boolean
//   chauffeur: Chauffeur | null
//   onClose: () => void
//   onConfirm: (successMessage: string) => void
// }

// const DialogChauffeurDelete: React.FC<DialogChauffeurDeleteProps> = ({
//   open,
//   chauffeur,
//   onClose,
//   onConfirm,
// }) => {
//     const apiUrl = import.meta.env.VITE_API_BACK
//     const handleConfirm = async () => {
//     if (!chauffeur) return

//     try {
//         await axios.delete(`${apiUrl}/chauffeurs/delete/${chauffeur.id_chauffeur}`)
//         onConfirm(`Le chauffeur ${chauffeur.utilisateur?.prenom} ${chauffeur.utilisateur?.nom} a été supprimé avec succès.`)
//     } catch (error: unknown) {
//         if (axios.isAxiosError(error)) {
//         alert(`Erreur: ${error.response?.data?.detail || 'Suppression impossible'}`)
//         } else {
//         alert(`Erreur inattendue: ${error}`)
//         }
//     }
//     }


//   return (
//     <Dialog sx={{color: '#3168B1'}} open={open} onClose={onClose}>
//       <DialogTitle>Confirmer la suppression</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Êtes-vous sûr de vouloir supprimer{' '}
//           <strong>
//             {chauffeur?.utilisateur?.prenom} {chauffeur?.utilisateur?.nom}
//           </strong>
//           ?
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} sx={{color: '#3168B1'}}>Annuler</Button>
//         <Button onClick={handleConfirm} sx={{background: '#E42422' }} variant="contained">
//           Supprimer
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default DialogChauffeurDelete


// src/components/DialogChauffeurDelete.tsx

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

import type { Chauffeur } from '../../../types/chauffeur';

interface DialogChauffeurDeleteProps {
  open: boolean;
  chauffeur: Chauffeur | null;
  onClose: () => void;
  onConfirm: (successMessage: string) => void;
}

const DialogChauffeurDelete: React.FC<DialogChauffeurDeleteProps> = ({
  open,
  chauffeur,
  onClose,
  onConfirm,
}) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    if (!chauffeur) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${apiUrl}/chauffeurs/delete/${chauffeur.id_chauffeur}`);
      onConfirm(`Le chauffeur ${chauffeur.utilisateur?.prenom} ${chauffeur.utilisateur?.nom} a été supprimé avec succès.`);
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.detail || 'Suppression impossible');
      } else {
        setError('Erreur inattendue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteForeverIcon sx={{ color: '#E42422', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', color: '#1D1D1B' }}>
              Confirmer la suppression
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ backgroundColor: '#f9f9f9', py: 3 }}>
        <DialogContentText sx={{ fontFamily: 'Open Sans, sans-serif', color: '#606264' }}>
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong>
            {chauffeur?.utilisateur?.prenom} {chauffeur?.utilisateur?.nom}
          </strong>
          ?
        </DialogContentText>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: '#3168B1',
            borderColor: '#3168B1',
            '&:hover': { backgroundColor: '#e3f0fd', borderColor: '#265a96' },
          }}
          disabled={loading}
        >
          Annuler
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#E42422',
            color: '#fff',
            '&:hover': { backgroundColor: '#b91c1b' },
            minWidth: 100,
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogChauffeurDelete;
