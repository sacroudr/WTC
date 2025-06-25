import React from 'react';
import { Box } from '@mui/material';
import UtilisateurContent from '../../../views/back-office/utilisateurs/utilsateurContent';



const Utilisateurs_BackOffice: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <UtilisateurContent />
        </Box>
    );  
};


export default Utilisateurs_BackOffice;