import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import axios from 'axios';

import type { Camion } from '../../../types/camion';

interface Props {
  open: boolean;
  handleClose: () => void;
  idCamion: number | null;
  onCamionUpdated: () => void;
}

const DialogCamionEdit: React.FC<Props> = ({ open, handleClose, idCamion, onCamionUpdated }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const theme = useTheme();

  const [initialCamion, setInitialCamion] = useState<Partial<Camion>>({});

  const [camion, setCamion] = useState<Partial<Camion>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || idCamion === null) return;

    setLoading(true);
    axios
      .get(`${apiUrl}/camions/${idCamion}`)
      .then((res) => {
            setCamion(res.data.camion);
            setInitialCamion(res.data.camion);
        })
      .catch(() => setError("Erreur lors du chargement des informations du camion."))
      .finally(() => setLoading(false));
  }, [idCamion, open, apiUrl]);

  const handleChange = (field: keyof Camion, value: string | boolean) => {
    setCamion((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (idCamion === null) return;
    setSubmitting(true);
    try {
      await axios.put(`${apiUrl}/camions/update/${idCamion}`, camion);
      onCamionUpdated();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du camion.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasChanged = JSON.stringify(camion) !== JSON.stringify(initialCamion);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            Modifier les informations du camion
            </Typography>
        </Box>
        <IconButton
            onClick={handleClose}
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
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
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
            {/* Section: Identité */}
            <Typography variant="subtitle1" fontWeight="bold" color="primary">Informations générales</Typography>
            <TextField
              label="Matricule"
              fullWidth
              size="small"
              value={camion.matricule || ''}
              onChange={(e) => handleChange('matricule', e.target.value)}
            />

            {/* Section: Assurance */}
            <Typography variant="subtitle1" fontWeight="bold" color="primary">Assurance</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Assurance"
                fullWidth
                size="small"
                value={camion.assurance || ''}
                onChange={(e) => handleChange('assurance', e.target.value)}
              />
              <TextField
                label="Fin validité assurance"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={(camion.fin_validite_assurance as string)?.slice(0, 10) || ''}
                onChange={(e) => handleChange('fin_validite_assurance', e.target.value)}
              />
            </Box>

            {/* Section: Carte grise */}
            <Typography variant="subtitle1" fontWeight="bold" color="primary">Carte grise</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Carte grise"
                fullWidth
                size="small"
                value={camion.carte_grise || ''}
                onChange={(e) => handleChange('carte_grise', e.target.value)}
              />
              <TextField
                label="Fin validité carte grise"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={(camion.fin_carte_grise as string)?.slice(0, 10) || ''}
                onChange={(e) => handleChange('fin_carte_grise', e.target.value)}
              />
            </Box>

            {/* Section: Visite technique */}
            <Typography variant="subtitle1" fontWeight="bold" color="primary">Visite technique</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Visite technique"
                fullWidth
                size="small"
                value={camion.visite_technique || ''}
                onChange={(e) => handleChange('visite_technique', e.target.value)}
              />
              <TextField
                label="Fin de la visite technique"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={(camion.fin_visite_technique as string)?.slice(0, 10) || ''}
                onChange={(e) => handleChange('fin_visite_technique', e.target.value)}
              />
            </Box>

            {/* Section: Extincteur */}
            <Typography variant="subtitle1" fontWeight="bold" color="primary">Extincteur</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ minWidth: '100px' }}>Présent :</Typography>
                <label>
                  <input
                    type="radio"
                    name="extincteur"
                    value="true"
                    checked={camion.extincteur === true}
                    onChange={() => handleChange('extincteur', true)}
                  />
                  Oui
                </label>
                <label>
                  <input
                    type="radio"
                    name="extincteur"
                    value="false"
                    checked={camion.extincteur === false}
                    onChange={() => handleChange('extincteur', false)}
                  />
                  Non
                </label>
              </Box>

              {camion.extincteur === true && (
                <TextField
                  label="Fin validité extincteur"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={(camion.fin_extincteur as string)?.slice(0, 10) || ''}
                  onChange={(e) => handleChange('fin_extincteur', e.target.value)}
                />
              )}
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
        <Button onClick={handleClose} variant="outlined" color="secondary" disabled={submitting}>
          Annuler
        </Button>
        <Button
            onClick={handleSubmit}
            disabled={submitting || !hasChanged}
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
            {submitting ? 'Enregistrement...' : 'Modifier'}
        </Button>

      </Box>
    </Dialog>
  );
};

export default DialogCamionEdit;
