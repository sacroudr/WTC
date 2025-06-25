import React from 'react';
import { Box } from '@mui/material';
import LivraisonContent from '../../../views/super-admin/livraison/livraionsContent';


const Livraison_SuperAdmin: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <LivraisonContent />
        </Box>
    );  
};


export default Livraison_SuperAdmin;