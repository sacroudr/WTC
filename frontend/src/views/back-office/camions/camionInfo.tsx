import React from 'react';
import { Typography, Box, Tooltip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import FireExtinguisherIcon from '@mui/icons-material/FireExtinguisher';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EngineeringIcon from '@mui/icons-material/Engineering';
import type { TooltipProps } from '@mui/material/Tooltip';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

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
    color: '#ffffff', // couleur du fond de l'infobulle
    '&::before': {
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
  },
}));

const InfoItem = ({
  icon,
  label,
  color = '#6b7280',
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
}) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box sx={{ color }}>{icon}</Box>
    <Typography variant="body2" sx={{ color: '#444' }}>
      {label}
    </Typography>
  </Box>
);

const CamionInfo: React.FC = () => {
  return (
    <StyledTooltip
      title={
        <Box display="flex" flexDirection="column" gap={1}>

          <InfoItem icon={<CreditCardIcon />} label="Carte grise" />
          <InfoItem icon={<EngineeringIcon />} label="Visite technique" />
          <InfoItem icon={<AssignmentTurnedInIcon />} label="Assurance" />
          <InfoItem icon={<FireExtinguisherIcon />} label="Extincteur" />

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Alertes
          </Typography>
          <InfoItem
            icon={<WarningAmberOutlinedIcon />}
            label="Extincteur indisponible"
            color="#E42422"
          />
          <InfoItem
            icon={<AssignmentTurnedInIcon />}
            label="Date expirée"
            color="#E42422"
          />
          <InfoItem
            icon={<EngineeringIcon />}
            label="Reste 1 mois de validité"
            color="#FFA500"
          />
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

export default CamionInfo;
