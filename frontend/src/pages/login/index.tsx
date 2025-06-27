import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/WTC_LOGO_JPG_v2_removed.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BACK;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setHasError(false); // reset visuel au début

    try {
      const response = await axios.post(`${apiUrl}/utilisateurs/login/`, {
        mail: email,
        mot_de_passe: password,
      });

      const { token, role } = response.data.utilisateur;
      localStorage.setItem('token', token);

      if (role === 'client') {
        navigate('/dashboard_client');
      } else if (role === 'back-office') {
        navigate('/dashboard_back-office');
      } else if (role === 'super-admin') {
        navigate('/dashboard_super-admin');
      } else {
        // setError('Rôle non reconnu');
        console.error('Rôle non reconnu');
        setHasError(true);
        return;
      }

      console.log('Connecté avec succès:', response.data.utilisateur);
    } catch (err: unknown) {
      setHasError(true);
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.detail || 'Erreur de connexion');
      } else {
        console.error('Erreur réseau ou serveur injoignable');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
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
          maxWidth: 1000,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* Left - Logo */}
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

        {/* Right - Form */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 5,
          }}
        >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // évite le rechargement de la page
            handleLogin(); // appelle ta fonction de connexion
          }}
        >

          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Connexion
          </Typography>

          <TextField
            label="Adresse Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => {setEmail(e.target.value); setHasError(false)}}
            error={hasError}
            helperText={hasError ? 'Email ou mot de passe incorrect' : ''}
          />

          <TextField
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setHasError(false);}}
            error={hasError}
            // helperText={hasError ? 'Email ou mot de passe incorrect' : ''} // facultatif ici si déjà affiché au-dessus
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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: theme.palette.primary.main,
                    '&.Mui-checked': {
                      color: theme.palette.secondary.main,
                    },
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.light}20`,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontWeight: 'bold',fontSize: 14, color: theme.palette.text.primary }}>
                  Se souvenir de moi
                </Typography>
              }
            />
            <Link href="#" underline="hover" sx={{ fontWeight: 'bold',fontSize:14}}>
              Mot de passe oublié ?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              mb: 2,
              py: 1.4,
              fontWeight: 'bold',
              fontSize: 16,
              borderRadius: 2,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: '#fff',
              '&:hover': {
                opacity: 0.9,
              },
            }}
            onClick={handleLogin}
            disabled={!email || !password}
          >
            Se connecter
          </Button>

          <Typography align="center" variant="body2" mt={2} fontWeight="bold">
            Vous n'avez pas de compte ?{' '}
            <RouterLink to="/register" style={{ textDecoration: 'underline', color: theme.palette.primary.main }}>
              Créez-en un
            </RouterLink>
          </Typography>
        </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
