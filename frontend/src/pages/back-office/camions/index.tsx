import React from 'react';
import { Box } from '@mui/material';
import CamionContent from '../../../views/back-office/camions/camionContent';



const Camions_BackOffice: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <CamionContent />
        </Box>
    );  
};


export default Camions_BackOffice;