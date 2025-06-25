import React from 'react';
import { Box } from '@mui/material';
import UtilisateurContent from '../../../views/super-admin/utilisateurs/utilisateurContent';


const Utilisateur_SuperAdmin: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <UtilisateurContent />
        </Box>
    );  
};


export default Utilisateur_SuperAdmin;