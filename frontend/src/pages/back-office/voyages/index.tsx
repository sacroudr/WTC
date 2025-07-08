import React from 'react';
import { Box, Typography } from '@mui/material';
import VoyageContent from '../../../views/back-office/voyages/voyageContent';



const Voyages_BackOffice: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <Box mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                        variant="h4"
                        sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
                    >
                        Voyages
                    </Typography>
                </Box>
        </Box>
            <VoyageContent />
        </Box>
    );  
};


export default Voyages_BackOffice;