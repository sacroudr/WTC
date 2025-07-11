import React from 'react';
import { Box, Fade } from '@mui/material';
import DashboardContent from '../../../views/back-office/dashboard/dashboardContent';
import DashboardHeader from '../../../views/back-office/dashboard/dashboardHeader';



const Dashboard_BackOffice: React.FC = () => {
    return (
        <Fade in timeout={700}>
            <Box sx={{ marginLeft: "270px", padding: "20px" }}>
                <DashboardHeader />
                <DashboardContent />
            </Box>
        </Fade>
    );  
};


export default Dashboard_BackOffice;