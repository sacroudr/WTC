import React from 'react';
import { Box, Fade } from '@mui/material';


const Client_BackOffice: React.FC = () => {
    return (
        <Fade in timeout={700}>
            <Box sx={{ marginLeft: "290px", padding: "20px" }}>
                <h1>Client a tbi</h1>
            </Box>
        </Fade>
    );  
};


export default Client_BackOffice;