// src/layouts/navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Button, Box, Stack, Container } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom'; // ✅ import Link
import logo from '../assets/WTC_LOGO_JPG_v3_removed.png';

const Navbar: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: alpha(theme.palette.secondary.main, 0.75),
        boxShadow: 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', paddingY: 1 }}>
          {/* ✅ Logo cliquable */}
          <Box
            component={Link}
            to="/accueil"
            sx={{
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo WTC"
              sx={{
                height: 56,
                width: 'auto',
                objectFit: 'contain',
                backgroundColor: '#fff',
                borderRadius: 1,
                padding: '4px',
                boxShadow: 1,
              }}
            />
          </Box>

          {/* ✅ Liens de navigation */}
          <Stack direction="row" spacing={4}>
            {[
              { label: 'Accueil', path: '/accueil' },
              { label: 'À Propos', path: '/a-propos' },
              { label: 'Contact', path: '/contact' },
              { label: 'Tracker', path: '/tracker' },
            ].map(({ label, path }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{
                  color: '#fff',
                  textTransform: 'none',
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                {label}
              </Button>
            ))}
          </Stack>

          {/* Boutons Login / Signup */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                fontFamily: theme.typography.fontFamily,
                textTransform: 'none',
                px: 3,
                mr: 2,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark || theme.palette.primary.main,
                },
                boxShadow: 2,
              }}
            >
              Log in
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: '#fff',
                fontFamily: theme.typography.fontFamily,
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  borderColor: '#fff',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

