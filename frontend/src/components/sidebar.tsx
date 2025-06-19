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
import { FiGrid, FiUsers, FiTruck, FiLogOut, FiPackage } from 'react-icons/fi';
// import WtcLogo from '../assets/WTC_LOGO_JPG_v2_removed.png';
import WtcLogo from '../assets/WTC_LOGO_CROPPED.png';
import { ListItemButton } from '@mui/material';

const sidebarWidth = 280;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { text: 'Tableau de bord', icon: <FiGrid size={22} />, path: '/dashboard' },
    { text: 'Utilisateurs', icon: <FiUsers size={22} />, path: '/utilisateurs' },
    { text: 'Camions', icon: <FiTruck size={22} />, path: '/camions' },
    { text: 'Livraisons', icon: <FiPackage size={22} />, path: '/livraisons' },
  ];

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
          // borderBottom: `1px solid ${theme.palette.text.secondary}40`,
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
          onClick={() => navigate('/dashboard')}
        />

      </Toolbar>

      <List sx={{ flexGrow: 1, mt: 1 }}>
        {menuItems.map(({ text, icon, path }) => (
          <ListItemButton
            key={text}
            // button
            onClick={() => navigate(path)}
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
          // button
          component="div"
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
