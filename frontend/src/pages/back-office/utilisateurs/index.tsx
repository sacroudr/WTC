import React from 'react';
import { Box, Typography } from '@mui/material';
import ChauffeurContent from '../../../views/back-office/chauffeurs/chauffeurContent';



const Chauffeurs_BackOffice: React.FC = () => {
    return (
        
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <Box display="flex" alignItems="center" mb={1}>
            <Typography
                variant="h4"
                sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
            >
                Chauffeur
            </Typography>
            </Box>
           <ChauffeurContent />
        </Box>
    );  
};


export default Chauffeurs_BackOffice;