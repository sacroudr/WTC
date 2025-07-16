import React from 'react';
import {
  Typography,
  Box,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { TooltipProps } from '@mui/material/Tooltip';

// Tooltip personnalisé avec flèche
const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#ffffff',
    color: '#333',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: 280,
    borderRadius: 8,
    padding: theme.spacing(2),
    border: '1px solid #e0e0e0',
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#ffffff',
    '&::before': {
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
  },
}));

const VoyagesInfo: React.FC = () => {
  return (
    <StyledTooltip
      title={
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Voyage en cours (jaune) */}
          <Box display="flex" alignItems="center">
            <Card sx={{ backgroundColor: '#E6E6FA', marginRight: '8px', width: '24px', height: '24px', boxShadow: 'none' }}>
              <CardContent sx={{ padding: 0, height: '100%' }} />
            </Card>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Voyage Planifier
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Card sx={{ backgroundColor: '#FFFACD', marginRight: '8px', width: '24px', height: '24px', boxShadow: 'none' }}>
              <CardContent sx={{ padding: 0, height: '100%' }} />
            </Card>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Voyage en cours
            </Typography>
          </Box>

          {/* Voyage livré (vert) */}
          <Box display="flex" alignItems="center">
            <Card sx={{ backgroundColor: '#D1FAE5', marginRight: '8px', width: '24px', height: '24px', boxShadow: 'none' }}>
              <CardContent sx={{ padding: 0, height: '100%' }} />
            </Card>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Voyage livré
            </Typography>
          </Box>
        </Box>
      }
      placement="bottom-start"
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          backgroundColor: '#3168B1',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>
          i
        </Typography>
      </Box>
    </StyledTooltip>
  );
};

export default VoyagesInfo;
