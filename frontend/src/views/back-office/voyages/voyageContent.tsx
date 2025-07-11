import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Divider,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import type { ClientApiResponse } from '../../../types/client';
import type { Chauffeur } from '../../../types/chauffeur';
// import type { SelectChangeEvent } from '@mui/material';

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

  // const handleChauffeurChange = (e: SelectChangeEvent) => {
  //   const selectedChauffeurId = parseInt(e.target.value as string, 10);
  //   const selectedChauffeur = chauffeurs.find((c) => c.id_chauffeur === selectedChauffeurId);
  //   const firstCamion = selectedChauffeur?.camions?.[0];
  //   console.log('🚚 id_camion sélectionné :', firstCamion?.id_camion ?? 'Aucun camion trouvé');
  //   setFormData((prev) => ({
  //     ...prev,
  //     id_chauffeur: selectedChauffeurId.toString(),
  //     id_camion: firstCamion?.id_camion != null ? firstCamion.id_camion.toString() : '',
  //   }));
  //   setMatriculeCamion(firstCamion?.matricule || '');
  // };

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
          <Autocomplete
            options={clients}
            getOptionLabel={(client) =>
              `${client.utilisateur.nom} - ${client.entreprise}`
            }
            value={clients.find((c) => c.id_client.toString() === formData.id_client) || null}
            onChange={(_, newValue) => {
              setFormData((prev) => ({
                ...prev,
                id_client: newValue ? newValue.id_client.toString() : '',
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Client" size="small" />
            )}
            renderOption={(props, client) => (
              <li {...props}>
                <span style={{ fontWeight: 'bold' }}>{client.utilisateur.nom}</span>{' '}
                <span style={{ color: '#777', fontStyle: 'italic' }}> - {client.entreprise}</span>
              </li>
            )}
            fullWidth
            isOptionEqualToValue={(option, value) => option.id_client === value.id_client}
          />
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
          <Autocomplete
            options={chauffeurs.filter((chauffeur) => chauffeur.disponibilite)}
            getOptionLabel={(chauffeur) =>
              chauffeur.utilisateur
                ? `${chauffeur.utilisateur.nom} ${chauffeur.utilisateur.prenom}`
                : `Chauffeur ${chauffeur.id_chauffeur}`
            }
            value={
              chauffeurs.find((c) => c.id_chauffeur.toString() === formData.id_chauffeur) || null
            }
            onChange={(_, newValue) => {
              const firstCamion = newValue?.camions?.[0];
              setFormData((prev) => ({
                ...prev,
                id_chauffeur: newValue ? newValue.id_chauffeur.toString() : '',
                id_camion: firstCamion?.id_camion ? firstCamion.id_camion.toString() : '',
              }));
              setMatriculeCamion(firstCamion?.matricule || '');
            }}
            renderInput={(params) => (
              <TextField {...params} label="Chauffeur" size="small" />
            )}
            renderOption={(props, chauffeur) => (
              <li {...props}>
                <span style={{ fontWeight: 'bold' }}>
                  {chauffeur.utilisateur?.nom || `Chauffeur ${chauffeur.id_chauffeur}`}
                </span>
                {chauffeur.utilisateur && (
                  <span style={{ color: '#777', fontStyle: 'italic', marginLeft: 4 }}>
                    {chauffeur.utilisateur.prenom}
                  </span>
                )}
              </li>
            )}
            fullWidth
            isOptionEqualToValue={(option, value) => option.id_chauffeur === value.id_chauffeur}
            noOptionsText="Aucun chauffeur n'est disponible"
          />
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
