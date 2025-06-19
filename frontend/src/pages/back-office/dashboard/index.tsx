import React from 'react';
import { Box } from '@mui/material';
import DashboardContent from '../../../views/back-office/dashboard/dashboardContent';



const Dashboard_BackOffice: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <DashboardContent />
        </Box>
    );  
};


export default Dashboard_BackOffice;