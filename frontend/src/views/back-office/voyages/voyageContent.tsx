import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import axios from 'axios';
import type { ClientApiResponse } from '../../../types/client';
import type { Chauffeur } from '../../../types/chauffeur';
import type { SelectChangeEvent } from '@mui/material';

const VoyageContent: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BACK;

  const [formData, setFormData] = useState({
    id_client: '',
    id_chauffeur: '',
    id_camion: '',
    ice: '',
    date_depart: '',
    adresse_depart: '',
    adresse_arrive: '',
  });

  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [matriculeCamion, setMatriculeCamion] = useState('');
  const [clients, setClients] = useState<ClientApiResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${apiUrl}/client/`);
        setClients(response.data.clients);
      } catch (err: unknown) {
        console.error(err);
        setError('Erreur lors du chargement des clients.');
      }
    };
    fetchClients();
  }, [apiUrl]);

  useEffect(() => {
    const fetchChauffeurs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/chauffeurs/`);
        console.log('Chauffeurs récupérés :', response.data);
        setChauffeurs(response.data);
      } catch (err: unknown) {
        console.error(err);
        setError('Erreur lors du chargement des chauffeurs.');
      }
    };
    fetchChauffeurs();
  }, [apiUrl]);

  const handleChauffeurChange = (e: SelectChangeEvent) => {
    const selectedChauffeurId = parseInt(e.target.value as string, 10);
    const selectedChauffeur = chauffeurs.find((c) => c.id_chauffeur === selectedChauffeurId);
    const firstCamion = selectedChauffeur?.camions?.[0];
    console.log('🚚 id_camion sélectionné :', firstCamion?.id_camion ?? 'Aucun camion trouvé');
    setFormData((prev) => ({
      ...prev,
      id_chauffeur: selectedChauffeurId.toString(),
      id_camion: firstCamion?.id_camion != null ? firstCamion.id_camion.toString() : '',
    }));
    setMatriculeCamion(firstCamion?.matricule || '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async () => {
  setSubmitting(true);
  setError(null);
  setSuccessMessage(null);
  try {
    const camionIdParsed = parseInt(formData.id_camion);
    const payload = {
      id_client: parseInt(formData.id_client),
      id_chauffeur: parseInt(formData.id_chauffeur),
      ...(isNaN(camionIdParsed) ? {} : { id_camion: camionIdParsed }),
      ice: formData.ice,
      date_depart: formData.date_depart.split('T')[0],
      adresse_depart: formData.adresse_depart,
      adresse_arrive: formData.adresse_arrive,
    };

    const response = await axios.post(`${apiUrl}/voyages/new`, payload);
    setSuccessMessage(`Voyage créé avec succès : ${response.data.numero_voyage}`);
    setFormData({
      id_client: '',
      id_chauffeur: '',
      id_camion: '',
      ice: '',
      date_depart: '',
      adresse_depart: '',
      adresse_arrive: '',
    });
    setMatriculeCamion('');
  } catch (err: unknown) {
    console.error(err);

    // Vérifie si c'est une erreur axios
    if (axios.isAxiosError(err)) {
      const apiError = err.response?.data as { detail?: { msg: string }[] } | undefined;
      if (apiError?.detail) {
        setError(apiError.detail.map(e => e.msg).join(', '));
      } else {
        setError('Erreur lors de la création du voyage.');
      }
    } else {
      setError('Erreur inconnue lors de la création du voyage.');
    }
  } finally {
    setSubmitting(false);
  }
};

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          background: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" color="primary">
          Créer un Voyage
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Divider />

        {/* Client + ICE */}
        <Box display="flex" gap={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Client</InputLabel>
            <Select
              name="id_client"
              value={formData.id_client}
              onChange={(e) => setFormData((prev) => ({ ...prev, id_client: e.target.value }))}
              label="Client"
            >
              {clients.map((client) => (
                <MenuItem key={client.id_client} value={client.id_client}>
                  {client.utilisateur.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="ICE"
            name="ice"
            value={formData.ice}
            onChange={handleChange}
            size="small"
          />
        </Box>

        {/* Chauffeur + Camion */}
        <Box display="flex" gap={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Chauffeur</InputLabel>
            <Select
              name="id_chauffeur"
              value={formData.id_chauffeur}
              onChange={handleChauffeurChange}
              label="Chauffeur"
            >
              {chauffeurs
                .filter((chauffeur) => chauffeur.disponibilite)
                .map((chauffeur) => (
                  <MenuItem key={chauffeur.id_chauffeur} value={chauffeur.id_chauffeur}>
                    {chauffeur.utilisateur
                      ? `${chauffeur.utilisateur.nom} ${chauffeur.utilisateur.prenom}`
                      : `Chauffeur ${chauffeur.id_chauffeur}`}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Matricule Camion"
            name="id_camion"
            value={matriculeCamion}
            onChange={handleChange}
            size="small"
            disabled
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
          fullWidth
          label="Adresse de départ"
          name="adresse_depart"
          value={formData.adresse_depart}
          onChange={handleChange}
          size="small"
        />

          <TextField
          fullWidth
          label="Adresse d'arrivée"
          name="adresse_arrive"
          value={formData.adresse_arrive}
          onChange={handleChange}
          size="small"
        />
        </Box>   

        <TextField
          fullWidth
          label="Date de départ"
          type="datetime-local"
          name="date_depart"
          value={formData.date_depart}
          onChange={handleChange}
          size="small"
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
            color: '#fff',
            py: 1.2,
            '&:hover': {
              background: 'linear-gradient(90deg, #275997 0%, #c51f1d 100%)',
              transform: 'scale(1.02)',
            },
            transition: 'transform 0.2s',
          }}
        >
          {submitting ? 'Création...' : 'Créer le voyage'}
        </Button>
      </Paper>
    </Box>
  );
};

export default VoyageContent;
