import React from 'react';
import { Box } from '@mui/material';
import LivraisonContent from '../../../views/back-office/livraisons/livraisonContent';



const Livraisons_BackOffice: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <LivraisonContent />
        </Box>
    );  
};


export default Livraisons_BackOffice;