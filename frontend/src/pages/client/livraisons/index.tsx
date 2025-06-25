import React from 'react';
import { Box } from '@mui/material';
import LivraisonContent from '../../../views/client/livraison/livraisonContent';


const Livraison_Client: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <LivraisonContent />
        </Box>
    );  
};


export default Livraison_Client;