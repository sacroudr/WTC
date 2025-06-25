import React from 'react';
import { Box } from '@mui/material';
import DashboardContent from '../../../views/super-admin/dashboard/dashboardContent';
import DashboardHeader from '../../../views/super-admin/dashboard/dashboardHeader';


const Dashboard_SuperAdmin: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <DashboardHeader />
            <DashboardContent />
        </Box>
    );  
};


export default Dashboard_SuperAdmin;