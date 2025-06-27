import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd'; // Icône pour "Affecter camion"
import CamionContent from '../../../views/back-office/camions/camionContent';
import CamionInfo from '../../../views/back-office/camions/camionInfo';

const Camions_BackOffice: React.FC = () => {
//   const [showDialog, setShowDialog] = useState(false); // <-- À utiliser si tu ouvres un dialogue

  return (
    <Box sx={{ marginLeft: "290px", padding: "20px" }}>
      <Box mb={2}>
        {/* Titre et info */}
        <Box display="flex" alignItems="center" mb={1}>
          <Typography
            variant="h4"
            sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
          >
            Camions
          </Typography>
          <CamionInfo />
        </Box>

        {/* Boutons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
              color: 'white',
              textTransform: 'none',
              fontWeight: 'bold',
              marginTop: '15px',
              marginBottom: '15px',
              mr: 2,
            }}
          >
            Camion
          </Button>

          <Button
            variant="contained"
            startIcon={<GroupAddIcon />}
            sx={{
              color: 'white',
              background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
              textTransform: 'none',
              fontWeight: 'bold',
              marginTop: '15px',
            }}
          >
            Affecter camion
          </Button>
        </Box>
      </Box>

      <CamionContent />
    </Box>
  );
};

export default Camions_BackOffice;
