// import React, { useEffect, useState } from 'react';
// import { Typography, Box, Paper, CircularProgress } from '@mui/material';
// import axios from 'axios';

// const DashboardContent: React.FC = () => {
//   const apiUrl = import.meta.env.VITE_API_BACK
//   const [clientsCount, setClientsCount] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchClientsCount = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/backoffice/client/count`);
//         // suppose que la réponse a une structure { total_clients: number }
//         setClientsCount(response.data.total);
//       } catch (err: any) {
//         setError(err.message || 'Erreur lors de la récupération');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClientsCount();
//   }, []);

//   return (
//     <Box sx={{paddingX: 2}}>
//             <Paper
//         elevation={3}
//         sx={{
//           p: 2,
//           width: 250,
//           textAlign: 'center',
//           borderRadius: 2,
//           background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
//           color: 'white',
//         }}
//       >
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
//           Nombre de clients
//         </Typography>

//         {loading && <CircularProgress color="inherit" size={24} />}
//         {error && <Typography variant="body2">{error}</Typography>}
//         {clientsCount !== null && !loading && !error && (
//           <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
//             {clientsCount}
//           </Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default DashboardContent;


import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { People } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';

const DashboardContent: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientsCount = async () => {
      try {
        const response = await axios.get(`${apiUrl}/backoffice/client/count`);
        setClientsCount(response.data.total);
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        setError(axiosError.message || 'Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchClientsCount();
  }, [apiUrl]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={32} />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      );
    }

    if (clientsCount !== null) {
      return (
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mt: 1
          }}
        >
          {clientsCount.toLocaleString()}
        </Typography>
      );
    }

    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 300,
          borderRadius: 3,
          background: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 2,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'white',
              mr: 2,
            }}
          >
            <People />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '0.5px'
            }}
          >
            Total Clients
          </Typography>
        </Box>

        {renderContent()}
      </Paper>
    </Box>
  );
};

export default DashboardContent;