import React from 'react';
import { Box } from '@mui/material';
import DashboardContent from '../../../views/super-admin/dashboard/dashboardContent';


const Dashboard_SuperAdmin: React.FC = () => {
    return (
        <Box sx={{ marginLeft: "290px", padding: "20px" }}>
            <DashboardContent />
        </Box>
    );  
};


export default Dashboard_SuperAdmin;