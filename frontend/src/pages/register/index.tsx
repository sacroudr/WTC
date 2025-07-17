// src/pages/RegisterPage.tsx (anciennement LoginPage.tsx)
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/WTC_LOGO_JPG_v2_removed.png';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_BACK;


const RegisterPage: React.FC = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    civilite: 'Mr.',
    nom: '',
    prenom: '',
    carte_national: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    ville: '',
    adresse: '',
    codePostal: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  type RegisterPayload = {
  nom: string;
  prenom: string;
  carte_national: string; // à ajouter dans le formulaire
  mail: string;
  mot_de_passe: string;
};

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
  try {
    const payload: RegisterPayload = {
      nom: formData.nom,
      prenom: formData.prenom,
      carte_national: formData.carte_national,
      mail: formData.email,
      mot_de_passe: formData.password,
    };

    const response = await axios.post(`${apiUrl}/utilisateurs/signup/`, payload);
    const data = response.data;

    setSuccessMessage("Inscription réussie !");
    setErrorMessage(''); // on efface un éventuel message d'erreur
    localStorage.setItem("token", data.utilisateur.token);

    setTimeout(() => {
      window.location.href = "/dashboard_back-office";
    }, 1000); // redirection après 1s

  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setErrorMessage("Erreur : " + error.response.data.detail);
    } else {
      setErrorMessage("Erreur lors de l'inscription.");
    }
    setSuccessMessage('');
  }
};



  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          maxWidth: 1100,
          borderRadius: 4,
          overflow: 'auto',
          maxHeight: '95vh', 
        }}
      >
        {/* Logo animé */}
        <Box
          sx={{
            width: '50%',
            background: `linear-gradient(to bottom, ${theme.palette.secondary.main}20, ${theme.palette.primary.main}20)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: '100%',
              maxWidth: 300,
              objectFit: 'contain',
              animation: 'spinY 10s linear infinite',
              '@keyframes spinY': {
                from: { transform: 'rotateY(0deg)' },
                to: { transform: 'rotateY(360deg)' },
              },
            }}
          />
        </Box>

        {/* Formulaire */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 5,
            px: 4,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            sx={{
              mb: 4,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Créer un compte
          </Typography>

          {/* Civilité */}
          <RadioGroup
            row
            value={formData.civilite}
            onChange={(e) => handleChange('civilite', e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="Mr." control={<Radio />} label="Mr." />
            <FormControlLabel value="Mme." control={<Radio />} label="Mme." />
          </RadioGroup>

          {/* Grid 2 colonnes */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Nom"
                fullWidth
                size="small"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Prénom"
                size="small"
                fullWidth
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Carte nationale"
                    size="small"
                    fullWidth
                    value={formData.carte_national}
                    onChange={(e) => handleChange('carte_national', e.target.value)}
                />
                </Grid>
            <Grid item xs={6} sx={{ width: '90%'}}>
              <TextField
                label="Email"
                size="small"
                fullWidth
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sx={{ width: '90%'}}>
              <TextField
                label="Mot de passe"
                size="small"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ width: '90%'}}>
              <TextField
                label="Confirmer mot de passe"
                size="small"
                type={showConfirm ? 'text' : 'password'}
                fullWidth
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Téléphone"
                size="small"
                fullWidth
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ville"
                size="small"
                fullWidth
                value={formData.ville}
                onChange={(e) => handleChange('ville', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Adresse"
                size="small"
                fullWidth
                value={formData.adresse}
                onChange={(e) => handleChange('adresse', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Code postale"
                size="small"
                fullWidth
                value={formData.codePostal}
                onChange={(e) => handleChange('codePostal', e.target.value)}
              />
            </Grid>
          </Grid>
          {successMessage && (
            <Typography
                variant="body2"
                sx={{ color: 'green', mt: 2, textAlign: 'center', fontWeight: 'bold' }}
            >
                {successMessage}
            </Typography>
            )}

            {errorMessage && (
            <Typography
                variant="body2"
                sx={{ color: 'red', mt: 2, textAlign: 'center', fontWeight: 'bold' }}
            >
                {errorMessage}
            </Typography>
        )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              py: 1.4,
              fontWeight: 'bold',
              fontSize: 16,
              borderRadius: 2,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: '#fff',
              '&:hover': { opacity: 0.9 },
            }}
            disabled={!formData.email || !formData.password || formData.password !== formData.confirmPassword}
            onClick={handleSubmit}
          >
            S'inscrire
          </Button>

          <Typography align="center" variant="body2" mt={2} fontWeight="bold">
            Vous avez déjà un compte ?{' '}
            <RouterLink to="/login" style={{ textDecoration: 'underline', color: theme.palette.primary.main }}>
              Connectez-vous
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
