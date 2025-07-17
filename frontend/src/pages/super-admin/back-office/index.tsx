import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import ChauffeursInfo from '../../../views/back-office/chauffeurs/chauffeursInfo';
import BoContent from '../../../views/super-admin/back-office/boContent';
import DialogAddBo from '../../../views/super-admin/back-office/dialogAddBo';

const Bo_SuperAdmin: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Fade in timeout={700}>
      <Box sx={{ marginLeft: "275px", padding: "20px" }}>
          <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                      variant="h4"
                      sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
                  >
                      Back-Office
                  </Typography>
                  {/* <ChauffeursInfo /> */}
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                  {/* ✅ Bouton + back-office */}
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
                  Back-office
                  </Button>
              </Box>
          </Box>

        <BoContent refreshTrigger={refreshCounter}/>

        <DialogAddBo
            open={openDialog}
            handleClose={() => setOpenDialog(false)}
            onBoAdded={() => {
                setOpenDialog(false);
                setRefreshCounter((prev) => prev + 1);
                setSuccessMessage("Back-office créé avec succès !");
            }}
            />


        {/* ✅ Pop-up Dialog
        <DialogAddChauffeur open={openDialog} handleClose={() => setOpenDialog(false)} 
          onChauffeurAdded={() => {
          setOpenDialog(false); // ferme la modale
          setRefreshCounter((prev) => prev + 1); // 👈 déclenche le useEffect dans CamionContent
          setSuccessMessage("Back-office créé avec succès !");
        }} /> */}

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

export default Bo_SuperAdmin;
