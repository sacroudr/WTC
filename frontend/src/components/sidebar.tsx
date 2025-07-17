import React from 'react';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiTruck, FiLogOut, FiPackage,  FiMap, FiUser } from 'react-icons/fi';
// import WtcLogo from '../assets/WTC_LOGO_JPG_v2_removed.png';
import WtcLogo from '../assets/WTC_LOGO_CROPPED.png';
import { ListItemButton } from '@mui/material';

const sidebarWidth = 280;

// Fonction pour extraire le rôle depuis le token JWT
function getUserRoleFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (error) {
    console.error('Erreur lors du décodage du token :', error);
    return null;
  }
}

const Sidebar: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const role = getUserRoleFromToken();

  const dashboardPath =
    role === 'client'
      ? '/dashboard_client'
      : role === 'back-office'
      ? '/dashboard_back-office'
      : '/dashboard_super-admin';

  const clientPath =
    role === 'super-admin' ? '/clients_super-admin' : '/clients_back-office';

  // const utilisateursPath =
  //   role === 'super-admin' ? '/utilisateurs_super-admin' : '/chauffeurs_back-office';
  const utilisateursPath =
    role === 'back-office' ? '/chauffeurs_back-office' : null;

  const camionsPath =
    role === 'super-admin' ? '/camions_super-admin' : '/camions_back-office';

  const boPath = role === 'super-admin' ? '/bo_super-admin' : null;

  const logsPath = role === 'super-admin' ? '/logs_super-admin' : null;

  const voyagesPath =
    role === 'client'
      ? '/voyages_client'
      : role === 'super-admin'
      ? '/voyages_super-admin'
      : '/voyages_back-office';

  const livraisonsPath =
    role === 'client'
      ? '/livraisons_client'
      : role === 'super-admin'
      ? '/livraisons_super-admin'
      : '/livraisons_back-office';

const menuItems = [
  {
    text: 'Tableau de bord',
    icon: <FiGrid size={22} />,
    path: dashboardPath,
    roles: ['client', 'back-office', 'super-admin'],
  },
  {
    text: 'Clients',
    icon: <FiUser size={22} />,
    path: clientPath,
    roles: ['back-office', ],
  },
  {
    text: 'Chauffeurs',
    icon: <FiUsers size={22} />,
    path: utilisateursPath,
    roles: ['back-office'],
  },
  {
    text: 'Logs',
    icon: <FiPackage size={22} />,
    path: logsPath,
    roles: ['super-admin'],
  },
  {
    text: 'Back-Office',
    icon: <FiUsers size={22} />,
    path: boPath,
    roles: ['super-admin'],
  },
  {
    text: 'Camions',
    icon: <FiTruck size={22} />,
    path: camionsPath,
    roles: ['back-office'],
  },
  {
    text: 'Voyages',
    icon: <FiMap size={22} />,
    path: voyagesPath,
    roles: ['client', 'back-office', ],
  },
  {
    text: 'Livraisons',
    icon: <FiPackage size={22} />,
    path: livraisonsPath,
    roles: ['client', 'back-office'],
  },
];


  // const filteredMenuItems = menuItems.filter(item => item.roles.includes(role || ''));
  const filteredMenuItems = menuItems.filter(
    item => item.roles.includes(role || '') && item.path !== null
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          background: `linear-gradient( ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          color: '#fff',
          borderRight: 'none',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 70,
          px: 2,
        }}
      >
        <Box
          component="img"
          src={WtcLogo}
          alt="Logo WTC"
          sx={{
            height: 80,
            width: 80,
            objectFit: 'contain',
            p: 0.5,
            mt: 2,
            backgroundColor: '#fff',
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
          onClick={() => navigate(dashboardPath)}
        />
      </Toolbar>

      <List sx={{ flexGrow: 1, mt: 1 }}>
        {filteredMenuItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={text}
            onClick={() => navigate(path!)} // Le "!" dit à TypeScript "je te promets que ce n'est pas null"
            sx={{
              px: 3,
              py: 1.7,
              mx: 1,
              mb: 1,
              borderRadius: 2,
              justifyContent: 'flex-start',
              color: '#fff',
              backgroundColor: location.pathname === path ? 'rgba(255,255,255,0.25)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                color: '#fff',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 16,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {text}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: `${theme.palette.text.secondary}40`, mx: 2 }} />

      <List sx={{ mb: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            px: 3,
            py: 1.7,
            mx: 1,
            borderRadius: 2,
            justifyContent: 'flex-start',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.15)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 2,
              display: 'flex',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <FiLogOut size={22} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                Se déconnecter
              </Typography>
            }
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;