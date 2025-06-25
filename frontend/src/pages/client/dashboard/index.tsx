import React from 'react';
import { Box } from '@mui/material';
import DashboardContent from '../../../views/client/dashboard/dashboardContent';
import DashboardHeader from '../../../views/client/dashboard/dashboardHeader';


const Dashboard_Client: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <DashboardHeader />
            <DashboardContent />
        </Box>
    );  
};


export default Dashboard_Client;