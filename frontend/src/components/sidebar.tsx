// import React from 'react';
// import {
//   Drawer,
//   List,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Divider,
//   Typography,
//   Box,
//   useTheme,
// } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FiGrid, FiUsers, FiTruck, FiLogOut, FiPackage,  FiMap, FiUser, FiFileText } from 'react-icons/fi';
// // import WtcLogo from '../assets/WTC_LOGO_JPG_v2_removed.png';
// import WtcLogo from '../assets/WTC_LOGO_CROPPED.png';
// import { ListItemButton } from '@mui/material';

// const sidebarWidth = 280;

// // Fonction pour extraire le rôle depuis le token JWT
// function getUserRoleFromToken(): string | null {
//   const token = localStorage.getItem('token');
//   if (!token) return null;

//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.role || null;
//   } catch (error) {
//     console.error('Erreur lors du décodage du token :', error);
//     return null;
//   }
// }

// const Sidebar: React.FC = () => {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();

//   const role = getUserRoleFromToken();

//   const dashboardPath =
//     role === 'client'
//       ? '/dashboard_client'
//       : role === 'back-office'
//       ? '/dashboard_back-office'
//       : '/dashboard_super-admin';

//   const clientPath =
//     role === 'super-admin' ? '/clients_super-admin' : '/clients_back-office';

//   // const utilisateursPath =
//   //   role === 'super-admin' ? '/utilisateurs_super-admin' : '/chauffeurs_back-office';
//   const utilisateursPath =
//     role === 'back-office' ? '/chauffeurs_back-office' : null;

//   const camionsPath =
//     role === 'super-admin' ? '/camions_super-admin' : '/camions_back-office';

//   const boPath = role === 'super-admin' ? '/bo_super-admin' : null;

//   const logsPath = role === 'super-admin' ? '/logs_super-admin' : null;

//   const voyagesPath =
//     role === 'client'
//       ? '/voyages_client'
//       : role === 'super-admin'
//       ? '/voyages_super-admin'
//       : '/voyages_back-office';

//   const livraisonsPath =
//     role === 'client'
//       ? '/livraisons_client'
//       : role === 'super-admin'
//       ? '/livraisons_super-admin'
//       : '/livraisons_back-office';

// const menuItems = [
//   {
//     text: 'Tableau de bord',
//     icon: <FiGrid size={20} />,
//     path: dashboardPath,
//     roles: ['client', 'back-office', 'super-admin'],
//   },
//   {
//     text: 'Clients',
//     icon: <FiUser size={20} />,
//     path: clientPath,
//     roles: ['back-office', ],
//   },
//   {
//     text: 'Chauffeurs',
//     icon: <FiUsers size={20} />,
//     path: utilisateursPath,
//     roles: ['back-office'],
//   },
//   {
//     text: 'Logs',
//     icon: <FiFileText  size={20} />,
//     path: logsPath,
//     roles: ['super-admin'],
//   },
//   {
//     text: 'Back-Office',
//     icon: <FiUsers size={20} />,
//     path: boPath,
//     roles: ['super-admin'],
//   },
//   {
//     text: 'Camions',
//     icon: <FiTruck size={20} />,
//     path: camionsPath,
//     roles: ['back-office'],
//   },
//   {
//     text: 'Voyages',
//     icon: <FiMap size={20} />,
//     path: voyagesPath,
//     roles: ['client', 'back-office', ],
//   },
//   {
//     text: 'Livraisons',
//     icon: <FiPackage size={20} />,
//     path: livraisonsPath,
//     roles: ['client', 'back-office'],
//   },
// ];


//   // const filteredMenuItems = menuItems.filter(item => item.roles.includes(role || ''));
//   const filteredMenuItems = menuItems.filter(
//     item => item.roles.includes(role || '') && item.path !== null
//   );

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/');
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: sidebarWidth,
//         flexShrink: 0,
//         whiteSpace: 'nowrap',
//         '& .MuiDrawer-paper': {
//           width: sidebarWidth,
//           background: `linear-gradient( ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
//           color: '#fff',
//           borderRight: 'none',
//           overflowX: 'hidden',
//           display: 'flex',
//           flexDirection: 'column',
//         },
//       }}
//     >
//       <Toolbar
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           minHeight: 70,
//           px: 2,
//           mb: 2,
//         }}
//       >
//         <Box
//           component="img"
//           src={WtcLogo}
//           alt="Logo WTC"
//           sx={{
//             height: 80,
//             width: 80,
//             objectFit: 'contain',
//             p: 0.5,
//             mt: 2,
//             backgroundColor: '#fff',
//             borderRadius: 1,
//             cursor: 'pointer',
//             transition: 'transform 0.3s ease',
//             '&:hover': {
//               transform: 'scale(1.1)',
//             },
//           }}
//           onClick={() => navigate(dashboardPath)}
//         />
//       </Toolbar>

//       <List sx={{ flexGrow: 1, mt: 1 }}>
//         {filteredMenuItems.map(({ text, icon, path }) => (
//           <ListItemButton
//             key={text}
//             onClick={() => navigate(path!)} // Le "!" dit à TypeScript "je te promets que ce n'est pas null"
//             sx={{
//               px: 3,
//               py: 1.7,
//               mx: 1,
//               mb: 1,
//               borderRadius: 2,
//               justifyContent: 'flex-start',
//               color: '#fff',
//               backgroundColor: location.pathname === path ? 'rgba(255,255,255,0.25)' : 'transparent',
//               '&:hover': {
//                 backgroundColor: 'rgba(255,255,255,0.15)',
//               },
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 minWidth: 0,
//                 mr: 2,
//                 color: '#fff',
//                 display: 'flex',
//                 justifyContent: 'center',
//               }}
//             >
//               {icon}
//             </ListItemIcon>
//             <ListItemText
//               primary={
//                 <Typography
//                   sx={{
//                     fontWeight: 500,
//                     fontSize: 14,
//                     textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
//                   }}
//                 >
//                   {text}
//                 </Typography>
//               }
//             />
//           </ListItemButton>
//         ))}
//       </List>

//       <Divider sx={{ borderColor: `${theme.palette.text.secondary}40`, mx: 2 }} />

//       <List sx={{ mb: 2 }}>
//         <ListItemButton
//           onClick={handleLogout}
//           sx={{
//             px: 3,
//             py: 1.7,
//             mx: 1,
//             borderRadius: 2,
//             justifyContent: 'flex-start',
//             color: '#fff',
//             '&:hover': {
//               backgroundColor: 'rgba(255,255,255,0.15)',
//             },
//           }}
//         >
//           <ListItemIcon
//             sx={{
//               minWidth: 0,
//               mr: 2,
//               display: 'flex',
//               justifyContent: 'center',
//               color: '#fff',
//             }}
//           >
//             <FiLogOut size={22} />
//           </ListItemIcon>
//           <ListItemText
//             primary={
//               <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
//                 Se déconnecter
//               </Typography>
//             }
//           />
//         </ListItemButton>
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;




import React, { useMemo, useCallback } from 'react';
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
  ListItemButton,
  Collapse,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiGrid, 
  FiUsers, 
  FiTruck, 
  FiLogOut, 
  FiPackage,  
  FiMap, 
  FiUser, 
  FiFileText,
  FiChevronDown,
  FiChevronRight,
  FiSettings
} from 'react-icons/fi';
import WtcLogo from '../assets/WTC_LOGO_CROPPED_v2.png';

// Types
interface MenuItem {
  id: string;
  text: string;
  icon: React.ReactNode;
  path?: string;
  roles: UserRole[];
  children?: MenuItem[];
}

type UserRole = 'client' | 'back-office' | 'super-admin';

// Configuration des menus
const MENU_CONFIG: MenuItem[] = [
  {
    id: 'dashboard',
    text: 'Tableau de bord',
    icon: <FiGrid size={20} />,
    roles: ['client', 'back-office', 'super-admin'],
  },
  {
    id: 'users',
    text: 'Utilisateurs',
    icon: <FiUsers size={20} />,
    roles: ['back-office', 'super-admin'],
    children: [
      {
        id: 'clients',
        text: 'Clients',
        icon: <FiUser size={18} />,
        roles: ['back-office'],
      },
      {
        id: 'drivers',
        text: 'Chauffeurs',
        icon: <FiUsers size={18} />,
        roles: ['back-office'],
      },
      {
        id: 'back-office-users',
        text: 'Back-Office',
        icon: <FiUsers size={18} />,
        roles: ['super-admin'],
      },
    ],
  },
  {
    id: 'fleet',
    text: 'Flotte',
    icon: <FiTruck size={20} />,
    roles: ['back-office', 'super-admin'],
    children: [
      {
        id: 'trucks',
        text: 'Camions',
        icon: <FiTruck size={18} />,
        roles: ['back-office'],
      },
      {
        id: 'trips',
        text: 'Voyages',
        icon: <FiMap size={18} />,
        roles: ['client', 'back-office'],
      },
    ],
  },
  {
    id: 'deliveries',
    text: 'Livraisons',
    icon: <FiPackage size={20} />,
    roles: ['client', 'back-office'],
  },
  {
    id: 'admin',
    text: 'Administration',
    icon: <FiSettings size={20} />,
    roles: ['super-admin'],
    children: [
      {
        id: 'logs',
        text: 'Logs système',
        icon: <FiFileText size={18} />,
        roles: ['super-admin'],
      },
    ],
  },
];

// Constantes
const SIDEBAR_WIDTH = 280;
const COLLAPSED_WIDTH = 70;

// Hook personnalisé pour la gestion du token
const useAuth = () => {
  const getUserRole = useCallback((): UserRole | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const parts = token.split('.');
      if (parts.length !== 3) {
        localStorage.removeItem('token');
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      // Vérifier l'expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem('token');
        return null;
      }

      return payload.role || null;
    } catch (error) {
      console.error('Token invalide:', error);
      localStorage.removeItem('token');
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    // Redirection sera gérée par le composant parent
  }, []);

  return { getUserRole, logout };
};

// Hook pour les paths dynamiques
const useDynamicPaths = (role: UserRole | null) => {
  return useMemo(() => {
    const pathMap: Record<string, string> = {
      dashboard: role === 'client' 
        ? '/dashboard_client' 
        : role === 'back-office' 
        ? '/dashboard_back-office' 
        : '/dashboard_super-admin',
      clients: role === 'super-admin' 
        ? '/clients_super-admin' 
        : '/clients_back-office',
      drivers: '/chauffeurs_back-office',
      'back-office-users': '/bo_super-admin',
      trucks: role === 'super-admin' 
        ? '/camions_super-admin' 
        : '/camions_back-office',
      trips: role === 'client'
        ? '/voyages_client'
        : role === 'super-admin'
        ? '/voyages_super-admin'
        : '/voyages_back-office',
      deliveries: role === 'client'
        ? '/livraisons_client'
        : role === 'super-admin'
        ? '/livraisons_super-admin'
        : '/livraisons_back-office',
      logs: '/logs_super-admin',
    };
    return pathMap;
  }, [role]);
};

// Composant pour un élément de menu
interface MenuItemComponentProps {
  item: MenuItem;
  role: UserRole | null;
  paths: Record<string, string>;
  currentPath: string;
  onNavigate: (path: string) => void;
  level?: number;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  role,
  paths,
  currentPath,
  onNavigate,
  level = 0
}) => {
  const [expanded, setExpanded] = React.useState(false);
  
  const hasChildren = item.children && item.children.length > 0;
  const hasAccess = role && item.roles.includes(role);
  const itemPath = paths[item.id];
  const isActive = currentPath === itemPath;

  if (!hasAccess) return null;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    } else if (itemPath) {
      onNavigate(itemPath);
    }
  };

  const paddingLeft = 3 + (level * 2);

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: paddingLeft,
          pr: 3,
          py: 1.5,
          mx: 1,
          mb: 0.5,
          borderRadius: 2,
          backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.15)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 2,
            color: '#fff',
            opacity: isActive ? 1 : 0.8,
          }}
        >
          {item.icon}
        </ListItemIcon>
        
        <ListItemText
          primary={
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: level > 0 ? 13 : 14,
                  opacity: isActive ? 1 : 0.9,
                }}
              >
                {item.text}
              </Typography>
              
              {hasChildren && (
                expanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />
              )}
            </Box>
          }
        />
      </ListItemButton>

      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                role={role}
                paths={paths}
                currentPath={currentPath}
                onNavigate={onNavigate}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// Composant principal
interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { getUserRole, logout } = useAuth();
  
  const role = getUserRole();
  const paths = useDynamicPaths(role);

  // Filtrer les éléments de menu selon le rôle
  const filteredMenuItems = useMemo(() => {
    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter(item => role && item.roles.includes(role))
        .map(item => ({
          ...item,
          path: paths[item.id],
          children: item.children ? filterItems(item.children) : undefined,
        }))
        .filter(item => item.path || (item.children && item.children.length > 0));
    };
    
    return filterItems(MENU_CONFIG);
  }, [role, paths]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  const handleLogoClick = useCallback(() => {
    const dashboardPath = paths.dashboard;
    if (dashboardPath) {
      navigate(dashboardPath);
    }
  }, [navigate, paths.dashboard]);

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          background: `linear-gradient(180deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          color: '#fff',
          borderRight: 'none',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
        },
      }}
    >
      {/* En-tête avec logo et titre */}
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-start',
          alignItems: 'center',
          minHeight: 80,
          px: collapsed ? 2 : 3,
          mb: 2 ,
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
          onClick={handleLogoClick}
        >
          <Box
            component="img"
            src={WtcLogo}
            alt="Logo WTC"
            sx={{
              height: collapsed ? 40 : 50,
              width: collapsed ? 40 : 50,
              objectFit: 'contain',
              backgroundColor: '#fff',
              borderRadius: 2,
              padding: 0.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              },
            }}
          />
          
          {!collapsed && (
            <Typography
              variant="h5"
              sx={{
                ml: 2,
                fontWeight: 700,
                fontSize: '1.5rem',
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
              }}
            >
              W.T.C
            </Typography>
          )}
        </Box>
      </Toolbar>

      {/* Menu principal */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 0 }}>
          {filteredMenuItems.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              role={role}
              paths={paths}
              currentPath={location.pathname}
              onNavigate={handleNavigate}
            />
          ))}
        </List>
      </Box>

      {/* Séparateur */}
      <Divider 
        sx={{ 
          borderColor: 'rgba(255,255,255,0.2)', 
          mx: 2,
          my: 1,
        }} 
      />

      {/* Bouton de déconnexion */}
      <List sx={{ pb: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            px: 3,
            py: 2,
            mx: 1,
            borderRadius: 2,
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.15)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 2,
              color: '#fff',
              justifyContent: 'center',
            }}
          >
            <FiLogOut size={20} />
          </ListItemIcon>
          
          {!collapsed && (
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  Se déconnecter
                </Typography>
              }
            />
          )}
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;