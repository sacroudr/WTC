import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, Fade } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd'; // Icône pour "Affecter camion"
import CamionContent from '../../../views/back-office/camions/camionContent';
import CamionInfo from '../../../views/back-office/camions/camionInfo';
import DialogAddCamion from '../../../views/back-office/camions/dialogAddCamion';
import DialogAffectCamion from '../../../views/back-office/camions/dialogAffectCamion';

const Camions_BackOffice: React.FC = () => {
//   const [showDialog, setShowDialog] = useState(false); // <-- À utiliser si tu ouvres un dialogue
  const [openDialog, setOpenDialog] = useState(false);
  const [openAffectDialog, setOpenAffectDialog] = useState(false);

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <Fade in timeout={700}>
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
              onClick={() => setOpenDialog(true)}
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
              onClick={() => setOpenAffectDialog(true)} // <-- ajout
            >
              Affecter camion
            </Button>
          </Box>
        </Box>

        <CamionContent refreshTrigger={refreshCounter} />
        <DialogAddCamion open={openDialog} onClose={() => setOpenDialog(false)} 
          onCamionAdded={() => {
          setOpenDialog(false); // ferme la modale
          setRefreshCounter((prev) => prev + 1); // 👈 déclenche le useEffect dans CamionContent
          setSuccessMessage("Camion créé avec succès !");
        }} />
        <DialogAffectCamion
          open={openAffectDialog}
          onClose={() => setOpenAffectDialog(false)}
          onAffectationSuccess={() => {
            setOpenAffectDialog(false);
            setSuccessMessage("Camion affecté avec succès !");
            setRefreshCounter((prev) => prev + 1);
          }}
        />
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

export default Camions_BackOffice;
