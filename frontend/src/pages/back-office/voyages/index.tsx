import React from 'react';
import { Box, Fade, Typography } from '@mui/material';
import VoyageContent from '../../../views/back-office/voyages/voyageContent';



const Voyages_BackOffice: React.FC = () => {
    return (
        <Fade in timeout={700}>
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
        </Fade>
    );  
};


export default Voyages_BackOffice;