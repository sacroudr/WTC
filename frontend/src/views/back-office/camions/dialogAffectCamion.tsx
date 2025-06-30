import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, MenuItem, TextField, CircularProgress,
  Box, Typography, Paper, Divider
} from '@mui/material';
import { FaTruckMoving, FaUserTie } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';

import type { Camion } from '../../../types/camion'; // adapte ce chemin
import type { Chauffeur } from '../../../types/chauffeur';

interface DialogAffectCamionProps {
  open: boolean;
  onClose: () => void;
  onAffectationSuccess: () => void;
}

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 250,
    },
  },
};

const DialogAffectCamion: React.FC<DialogAffectCamionProps> = ({ open, onClose, onAffectationSuccess }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [camions, setCamions] = useState<Camion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState<number | ''>('');
  const [selectedCamion, setSelectedCamion] = useState<number | ''>('');

  const handleCancel = () => {
  setSelectedChauffeur('');
  setSelectedCamion('');
  onClose();
};


  useEffect(() => {
    if (open) {
      axios.get<Chauffeur[]>(`${apiUrl}/chauffeurs/`)
        .then(res => setChauffeurs(res.data))
        .catch(err => console.error('❌ Erreur API chauffeurs:', err));

      axios.get<{ camions: Camion[] }>(`${apiUrl}/camions/`)
        .then(res => setCamions(res.data.camions))
        .catch(err => console.error('❌ Erreur API camions:', err));
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/camions/affecter_camion`, {
        id_chauffeur: selectedChauffeur,
        id_camion: selectedCamion
      });
      onAffectationSuccess();
    } catch (error: unknown) {
      const err = error as AxiosError<{ detail?: string }>;
      alert(err.response?.data?.detail || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ px: 4, pt: 3, pb: 2, position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <FaTruckMoving size={22} color="#E42422" />
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Affecter un camion à un chauffeur
          </Typography>
        </Box>
        <IconButton
          onClick={handleCancel}
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
      </DialogTitle>


      <Divider />

      <DialogContent sx={{ px: 4, py: 3, bgcolor: 'background.default' }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Box display="flex" flexDirection="column" gap={4}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" mb={1}>
                <FaUserTie style={{ marginRight: 8, verticalAlign: 'middle', color:"#E42422" }} />
                Chauffeur disponible
              </Typography>
              <TextField
                select
                fullWidth
                variant="outlined"
                placeholder="Sélectionner un chauffeur"
                value={selectedChauffeur}
                onChange={e => setSelectedChauffeur(Number(e.target.value))}
                SelectProps={{ MenuProps: menuProps }}
              >
                {chauffeurs
                .filter(ch => ch.camions?.length === 0)
                .map(ch => (
                  <MenuItem key={ch.id_chauffeur} value={ch.id_chauffeur}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <FaUserTie size={18} color="#3168B1" />
                      <Box>
                        <Typography fontWeight={600} color="text.primary">
                          {ch.utilisateur?.nom} {ch.utilisateur?.prenom}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
              ))}

              </TextField>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" mb={1}>
                <FaTruckMoving style={{ marginRight: 8, verticalAlign: 'middle', color:"#E42422" }} />
                Camion disponible
              </Typography>
              <TextField
                select
                fullWidth
                variant="outlined"
                placeholder="Sélectionner un camion"
                value={selectedCamion}
                onChange={e => setSelectedCamion(Number(e.target.value))}
                SelectProps={{ MenuProps: menuProps }}
              >
                {camions
                .filter(cam => cam.chauffeur_camion?.length === 0)
                .map(cam => (
                  <MenuItem key={cam.id_camion} value={cam.id_camion}>
                    <Box display="flex" flexDirection="column">
                      <Typography fontWeight={600} color="text.primary">
                        {cam.matricule}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cam.modele}
                      </Typography>
                    </Box>
                  </MenuItem>
              ))}
              </TextField>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          color="secondary"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !selectedChauffeur || !selectedCamion}
          sx={{
            fontWeight: 'bold',
            background: "linear-gradient(90deg, #3168B1 0%, #E42422 100%)",
            color: "#fff",
            '&:hover': {
              background: "linear-gradient(90deg, #275997 0%, #c51f1d 100%)",
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Affecter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAffectCamion;
