import { Fade, Box, Typography } from '@mui/material';
import React from 'react';
import VoyagesInfo from './voyageInfo';
import VoyageList from './voyageList';
import { useParams } from 'react-router-dom';
const ClientContent: React.FC = () => {
  // const clientId = 1; // Remplace ça dynamiquement plus tard avec useParams si besoin
  const { clientId } = useParams<{ clientId: string }>();
  const numericClientId = Number(clientId);
  return (
    <Fade in timeout={700}>
      <Box sx={{ marginLeft: "290px", padding: "20px" }}>
        <Box mb={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
            >
              Vos voyages
            </Typography>
            <VoyagesInfo />
          </Box>
        </Box>
        <VoyageList clientId={numericClientId} />
      </Box>
    </Fade>
  );
};

export default ClientContent;
