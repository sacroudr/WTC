import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Fade } from '@mui/material';
import ChauffeurContent from '../../../views/back-office/chauffeurs/chauffeurContent';
import AddIcon from '@mui/icons-material/Add';
import ChauffeursInfo from '../../../views/back-office/chauffeurs/chauffeursInfo';
import DialogAddChauffeur from '../../../views/back-office/chauffeurs/dialogAddChauffeur';

const Chauffeurs_BackOffice: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);

  
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Fade in timeout={700}>
      <Box sx={{ marginLeft: "290px", padding: "20px" }}>
          <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                      variant="h4"
                      sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
                  >
                      Chauffeurs
                  </Typography>
                  <ChauffeursInfo />
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                  {/* ✅ Bouton + Chauffeur */}
                  <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
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
                  Chauffeur
                  </Button>
              </Box>
          </Box>

        <ChauffeurContent refreshTrigger={refreshCounter}/>

        {/* ✅ Pop-up Dialog */}
        <DialogAddChauffeur open={openDialog} handleClose={() => setOpenDialog(false)} 
          onChauffeurAdded={() => {
          setOpenDialog(false); // ferme la modale
          setRefreshCounter((prev) => prev + 1); // 👈 déclenche le useEffect dans CamionContent
          setSuccessMessage("Chauffeur créé avec succès !");
        }} />

        {successMessage && (
          <Snackbar
            open={true}
            autoHideDuration={4000}
            onClose={() => setSuccessMessage(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              severity="success"
              onClose={() => setSuccessMessage(null)}
              sx={{ width: '100%' }}
            >
          {successMessage}
          </Alert>
          </Snackbar>
        )}
      </Box>
    </Fade>
  );
};

export default Chauffeurs_BackOffice;
