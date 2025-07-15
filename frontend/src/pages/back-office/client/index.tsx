import React, { useState } from 'react';
import { Box, Fade, Typography, Button, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClientContent from '../../../views/back-office/clients/clientContent';
import DialogClientAdd from '../../../views/back-office/clients/dialogClientAdd'; // 👈 importe le composant

const Client_BackOffice: React.FC = () => {
    const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  return (
    <Fade in timeout={700}>
      <Box sx={{ marginLeft: '290px', padding: '20px' }}>
        <Typography
          variant="h4"
          sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
        >
          Clients
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)} // 👈 ouvrir le dialog
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
            Client
          </Button>
        </Box>

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

        <ClientContent refreshTrigger={refreshCounter}/>

        {/* 👇 Composant Dialog d'ajout */}
        <DialogClientAdd open={openDialog} onClose={() => setOpenDialog(false)}
          onClientAdded={() => {
          setOpenDialog(false); // ferme la modale
          setRefreshCounter((prev) => prev + 1); // 👈 déclenche le useEffect dans CamionContent
          setSuccessMessage("Client créé avec succès !"); 
        }} />
      </Box>
    </Fade>
  );
};

export default Client_BackOffice;