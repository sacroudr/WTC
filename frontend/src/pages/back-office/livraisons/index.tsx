import React from 'react';
import { Box, Fade, Typography } from '@mui/material';
import LivraisonContent from '../../../views/back-office/livraisons/livraisonContent';



const Livraisons_BackOffice: React.FC = () => {
    return (
        <Fade in timeout={700}>
            <Box sx={{ marginLeft: "280px", padding: "20px" }}>
                <Box mb={2}>
                <Box display="flex" alignItems="center" mb={1}>
                        <Typography
                                variant="h4"
                                sx={{ display: 'flex', alignItems: 'center', lineHeight: 1, mr: 1 }}
                            >
                        Livraisons
                        </Typography>
                    </Box>
                </Box>
                <LivraisonContent />
            </Box>
        </Fade>
    );  
};


export default Livraisons_BackOffice;