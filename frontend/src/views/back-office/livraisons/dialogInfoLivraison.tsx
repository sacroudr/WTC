import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from '@mui/material';
import { IoClose } from 'react-icons/io5';
import {
  FaCheckCircle,
  FaTruck,
  FaFileAlt,
  FaBoxOpen,
  FaShippingFast,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import MapLivraison from './mapLivraison';

// Interfaces
interface Suivi {
  date_maj: string;
  statut: string;
  localisation: string;
  commentaire?: string;
}

interface Livraison {
  id_livraison: number;
  numero_voyage: string;
  suivi: Suivi[];
}

interface DialogInfoLivraisonProps {
  livraisons: Livraison[];
  onClose: () => void;
  open: boolean;
}

const statusOrder = [
  'Validé',
  'Pris en charge des documents',
  'Chargement du camion',
  'Départ port',
  'Livraison effectuée',
];

const statusIcons: Record<string, React.ReactNode> = {
  'Validé': <FaCheckCircle size={26} />,
  'Pris en charge des documents': <FaFileAlt size={26} />,
  'Chargement du camion': <FaBoxOpen size={26} />,
  'Départ port': <FaShippingFast size={26} />,
  'Livraison effectuée': <FaTruck size={26} />,
};

const DialogInfoLivraison: React.FC<DialogInfoLivraisonProps> = ({ livraisons, onClose, open }) => {
  const theme = useTheme();
  const [livraisonTrackee, setLivraisonTrackee] = React.useState<number | null>(null);
   const handleClose = () => {
    setLivraisonTrackee(null); // Réinitialise l'état
    onClose(); // Ferme le dialog
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: theme.palette.background.default }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            {livraisons.length > 0 ? `Voyage n° ${livraisons[0].numero_voyage}` : 'Voyage'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: theme.palette.text.secondary }}>
            <IoClose size={26} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default }}>
        {livraisons.length > 0 ? (
          livraisons.map((livraison, index) => {
            const completedStatuses = livraison.suivi.map((s) => s.statut);

            return (
              <Box key={index} mb={6}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  position="relative"
                  py={6}
                  px={4}
                >
                  {/* Ligne grise de base */}
                  <Box
                    position="absolute"
                    top="125px"
                    left="110px"
                    right="110px"
                    height="3px"
                    bgcolor={theme.palette.grey[300]}
                    borderRadius="2px"
                    zIndex={0}
                  />

                  {/* Ligne de progression */}
                  {completedStatuses.length > 1 && (
                    <Box
                      position="absolute"
                      top="125px"
                      left="110px"
                      right="110px"
                      height="3px"
                      zIndex={1}
                      sx={{
                        background: `linear-gradient(to right, ${theme.palette.primary.main} ${(completedStatuses.length - 1) / (statusOrder.length - 1) * 100}%, ${theme.palette.grey[300]} ${(completedStatuses.length - 1) / (statusOrder.length - 1) * 100}%)`,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  )}

                  {statusOrder.map((status, i) => {
                    const isCompleted = completedStatuses.includes(status);
                    const suiviData = livraison.suivi.find((s) => s.statut === status);
                    const dateMaj = suiviData ? new Date(suiviData.date_maj).toLocaleString() : '--';
                    const commentaire = suiviData?.commentaire || 'En attente';

                    return (
                      <Box
                        key={i}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="flex-start"
                        flex={1}
                        position="relative"
                        zIndex={2}
                        mx={1}
                      >
                        {/* Date */}
                        <Box height="40px" display="flex" alignItems="center" justifyContent="center" mb={1}>
                          <Typography
                            variant="caption"
                            color={isCompleted ? theme.palette.text.primary : theme.palette.text.secondary}
                            fontWeight={isCompleted ? 'bold' : 'normal'}
                            textAlign="center"
                          >
                            {dateMaj}
                          </Typography>
                        </Box>

                        {/* Icone */}
                        <Box
                          width={65}
                          height={65}
                          borderRadius="50%"
                          bgcolor={isCompleted ? theme.palette.primary.main : '#f5f5f5'}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          border={`2px solid ${isCompleted ? theme.palette.primary.main : theme.palette.grey[300]}`}
                          color={isCompleted ? '#fff' : theme.palette.text.secondary}
                          sx={{
                            transition: 'all 0.3s ease',
                            boxShadow: isCompleted ? `0 4px 10px rgba(49, 104, 177, 0.4)` : 'none',
                          }}
                        >
                          {statusIcons[status] || <FaMapMarkerAlt size={26} />}
                        </Box>

                        {/* Statut */}
                        <Box height="55px" display="flex" alignItems="center" justifyContent="center" mt={2}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            textAlign="center"
                            color={isCompleted ? theme.palette.text.primary : theme.palette.text.secondary}
                            sx={{ maxWidth: 150 }}
                          >
                            {status}
                          </Typography>
                        </Box>

                        {/* Commentaire */}
                        <Box height="40px" display="flex" alignItems="center" justifyContent="center" mt={1}>
                          <Typography
                            variant="body2"
                            textAlign="center"
                            color={theme.palette.text.secondary}
                            sx={{ maxWidth: 160, fontSize: '0.75rem' }}
                          >
                            {commentaire}
                          </Typography>
                        </Box>

                        {/* Bouton Tracker */}
                        <Box height="35px" mt={1} display="flex" justifyContent="center" alignItems="center">
                          {status === 'Départ port' && isCompleted && (
                            <Button
                              onClick={() => setLivraisonTrackee(livraison.id_livraison)}
                              variant="contained"
                              size="small"
                              sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}CC)`,
                                color: '#fff',
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                px: 2,
                                '&:hover': {
                                  background: theme.palette.primary.dark,
                                },
                              }}
                              startIcon={<FaTruck size={14} />}
                            >
                              Tracker
                            </Button>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography color="text.secondary" textAlign="center">
            Aucun suivi disponible.
          </Typography>
        )}

        {livraisonTrackee !== null && (
          <Box mt={4}>
            <MapLivraison livraisonId={livraisonTrackee} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogInfoLivraison;
