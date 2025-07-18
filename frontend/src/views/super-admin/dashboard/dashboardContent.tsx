import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { People, LocalShipping,EventNote , DriveEta  } from '@mui/icons-material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';

const DashboardContent: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BACK;

  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [chauffeurStats, setChauffeurStats] = useState<{
    total: number;
    disponibles: number;
    indisponibles: number;
  } | null>(null);
  const [camionsCount, setCamionsCount] = useState<number | null>(null);
  const [pendingVoyages, setPendingVoyages] = useState<number | null>(null);

  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingChauffeurs, setLoadingChauffeurs] = useState(true);
  const [loadingCamions, setLoadingCamions] = useState(true);
  const [loadingVoyages, setLoadingVoyages] = useState(true);

  const [errorClients, setErrorClients] = useState<string | null>(null);
  const [errorChauffeurs, setErrorChauffeurs] = useState<string | null>(null);
  const [errorCamions, setErrorCamions] = useState<string | null>(null);
  const [errorVoyages, setErrorVoyages] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientsCount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/superadmin/client/count`);
        setClientsCount(res.data.total);
      } catch (err) {
        const axiosErr = err as AxiosError;
        setErrorClients(axiosErr.message || 'Erreur clients');
      } finally {
        setLoadingClients(false);
      }
    };

    const fetchChauffeurStats = async () => {
      try {
        const res = await axios.get(`${apiUrl}/superadmin/chauffeur/count`);
        setChauffeurStats(res.data);
      } catch (err) {
        const axiosErr = err as AxiosError;
        setErrorChauffeurs(axiosErr.message || 'Erreur chauffeurs');
      } finally {
        setLoadingChauffeurs(false);
      }
    };

    const fetchCamionsCount = async () => {
      try {
        const res = await axios.get(`${apiUrl}/superadmin/camion/count`);
        setCamionsCount(res.data.total);
      } catch (err) {
        const axiosErr = err as AxiosError;
        setErrorCamions(axiosErr.message || 'Erreur camions');
      } finally {
        setLoadingCamions(false);
      }
    };

    const fetchPendingVoyages = async () => {
      try {
        const res = await axios.get(`${apiUrl}/superadmin/voyage/count`);
        setPendingVoyages(res.data.total);
      } catch (err) {
        const axiosErr = err as AxiosError;
        setErrorVoyages(axiosErr.message || 'Erreur voyages');
      } finally {
        setLoadingVoyages(false);
      }
    };

    fetchClientsCount();
    fetchChauffeurStats();
    fetchCamionsCount();
    fetchPendingVoyages();
  }, [apiUrl]);

  const renderCount = (loading: boolean, error: string | null, count: number | null) => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={30} /></Box>;
    }
    if (error) {
      return <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>;
    }
    if (count !== null) {
      return (
        <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: 'primary.main' }}>
          {count.toLocaleString()}
        </Typography>
      );
    }
    return null;
  };

  const StatCard = ({
    title,
    icon,
    loading,
    error,
    count,
  }: {
    title: string;
    icon: React.ReactNode;
    loading: boolean;
    error: string | null;
    count: number | null;
  }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: 300,
        borderRadius: 4,
        background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{
          width: 50,
          height: 50,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
        }}>
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {renderCount(loading, error, count)}
    </Paper>
  );

  const ChauffeurCard = () => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: 300,
        borderRadius: 4,
        background: 'linear-gradient(to bottom right, #ffffff, #f0f4ff)',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{
          width: 50,
          height: 50,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
        }}>
          <DriveEta  />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chauffeurs
        </Typography>
      </Box>
      {renderCount(loadingChauffeurs, errorChauffeurs, chauffeurStats?.total ?? null)}

      {!loadingChauffeurs && !errorChauffeurs && chauffeurStats && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircle color="success" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {chauffeurStats.disponibles} dispo
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Cancel color="error" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {chauffeurStats.indisponibles} indispo
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );

  return (
    
    <Box
      sx={{
        p: 3,
        display: 'flex',
        gap: 3,
        flexWrap: 'nowrap',
        overflowX: 'auto',
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: 4,
        },
      }}
    >
      <StatCard
        title="Total Clients"
        icon={<People />}
        loading={loadingClients}
        error={errorClients}
        count={clientsCount}
      />
      
      <ChauffeurCard />
      <StatCard
        title="Total Camions"
        icon={<LocalShipping />}
        loading={loadingCamions}
        error={errorCamions}
        count={camionsCount}
      />
      <StatCard
        title="Voyages à faire"
        icon={<EventNote  />}
        loading={loadingVoyages}
        error={errorVoyages}
        count={pendingVoyages}
      />
    </Box>
  );
};

export default DashboardContent;
