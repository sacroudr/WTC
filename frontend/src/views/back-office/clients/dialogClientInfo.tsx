import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Box,
  useTheme,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import type { ClientApiResponse  } from '../../../types/client';

interface DialogClientInfoProps {
  open: boolean;
  onClose: () => void;
  idClient: number | null;
}

const DialogClientInfo: React.FC<DialogClientInfoProps> = ({ open, onClose, idClient }) => {
  const [client, setClient] = useState<ClientApiResponse | null>(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_BACK;

  useEffect(() => {
    const fetchClient = async () => {
      if (idClient == null) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${apiUrl}/client/${idClient}`);
        setClient(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des infos du client");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchClient();
  }, [idClient, open, apiUrl]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoOutlinedIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="primary">
            Informations du client
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
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

      {/* Content */}
      <DialogContent sx={{ bgcolor: theme.palette.background.default, py: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : client ? (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <InfoLabel label="Nom" value={`${client.utilisateur.prenom} ${client.utilisateur.nom}`} />
              <InfoLabel label="Mail" value={client.utilisateur.mail || 'Non renseignée'} />
              <InfoLabel label="Carte nationale" value={client.utilisateur.carte_national || 'Non renseignée'} />
              <InfoLabel label="Entreprise" value={client.entreprise} />
              <InfoLabel label="Adresse" value={client.adresse} />
              <InfoLabel label="Téléphone" value={client.telephone} />
            </Box>
          </Paper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Aucune donnée à afficher.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

const InfoLabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography
        variant="body2"
        fontWeight={500}
        sx={
            value === 'Non renseignée'
            ? { color: 'error.main', fontStyle: 'italic' }
            : undefined
        }
        >
        {value}
    </Typography>
  </Box>
);

export default DialogClientInfo;
