import { Fade, Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

const ClientContent: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();

  // Tu peux convertir l'ID en number si nécessaire
  const numericClientId = Number(clientId);

  // Utilise numericClientId pour charger les voyages du client
  // Exemple :
  // useEffect(() => { fetchVoyagesByClient(numericClientId); }, [numericClientId]);

  return (
     <Fade in timeout={700}>
          <Box sx={{ marginLeft: '290px', padding: '20px' }}>
        <div>
        <h2>Voyages du client ID : {numericClientId}</h2>
        {/* Ton contenu ici */}
        </div>
    </Box>
    </Fade>
  );
};

export default ClientContent;
