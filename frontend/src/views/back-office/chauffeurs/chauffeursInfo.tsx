import React from 'react';
import {
  Typography,
  Box,
  Tooltip,
  Avatar,
  Badge
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

// Badge vert stylisé pour la disponibilité
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    height: 12,
    minWidth: 12,
    borderRadius: '50%',
    bottom: 4,
    right: 4,
  },
}));

// Badge rouge stylisé pour l'indisponibilité
const StyledBadgeRed = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#d32f2f',  // rouge
    color: '#d32f2f',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    height: 12,
    minWidth: 12,
    borderRadius: '50%',
    bottom: 4,
    right: 4,
  },
}));

const ChauffeursInfo: React.FC = () => {
  return (
    <StyledTooltip
      title={
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">

            {/* Ligne horizontale : avatar avec bulle verte + texte "Disponible" */}
            <Box display="flex" alignItems="center" gap={1} minWidth={140}>
            <StyledBadge
                overlap="circular"
                variant="dot"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Avatar sx={{ width: 40, height: 40 }}>
                C
                </Avatar>
            </StyledBadge>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Disponible
            </Typography>
            </Box>

            {/* Ligne horizontale : avatar avec bulle rouge + texte "Indisponible" */}
            <Box display="flex" alignItems="center" gap={1} minWidth={140}>
            <StyledBadgeRed
                overlap="circular"
                variant="dot"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Avatar sx={{ width: 40, height: 40 }}>
                C
                </Avatar>
            </StyledBadgeRed>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Indisponible
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

export default ChauffeursInfo;
