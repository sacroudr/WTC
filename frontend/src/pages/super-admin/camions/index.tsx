import React from 'react';
import { Box } from '@mui/material';
import CamionContent from '../../../views/super-admin/camion/camionContent';


const Camion_SuperAdmin: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <CamionContent />
        </Box>
    );  
};


export default Camion_SuperAdmin;