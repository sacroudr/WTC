// src/components/dialogCamion.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Paper,
} from '@mui/material';
import type { Camion } from '../../../types/camion';

type Props = {
  open: boolean;
  onClose: () => void;
  camions: Camion[];
};

const DialogCamion: React.FC<Props> = ({ open, onClose, camions }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: 'background.default',
          boxShadow: 6,
        },
      }}
    >

      <DialogContent
            dividers
            sx={{
            p: 0,
            maxHeight: '70vh', // ou '80vh' selon la taille que tu veux
            overflowY: 'auto',
        }}
        >
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', m: 2 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
                }}
              >
                {[
                  'Numéro matricule',
                  'Modèle',
                  'Chauffeur',
                  'Assurance',
                  'Carte grise',
                  'Extincteur',
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.95rem',
                      py: 1.5,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {camions.map((camion, index) => {
                const chauffeur = camion.chauffeur_camion?.[0]?.chauffeur?.utilisateur;
                const nomComplet = chauffeur
                  ? `${chauffeur.prenom} ${chauffeur.nom}`
                  : 'Aucun chauffeur';

                return (
                  <TableRow
                    key={camion.id_camion}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: '#f0f4ff',
                      },
                    }}
                  >
                    <TableCell align="center" sx={{fontWeight: 'bold'}}>{camion.matricule}</TableCell>
                    <TableCell align="center" sx={{fontWeight: 'bold'}}>{camion.modele}</TableCell>
                    <TableCell align="center">
                    {nomComplet === 'Aucun chauffeur' ? (
                        <Box sx={{ color: 'error.main', fontWeight: 'bold' }}>
                        {nomComplet}
                        </Box>
                    ) : (
                        <Box sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {nomComplet}
                        </Box>
                    )}
                    </TableCell>

                    <TableCell align="center" sx={{fontWeight: 'bold'}}>{camion.assurance}</TableCell>
                    <TableCell align="center" sx={{fontWeight: 'bold'}}>{camion.carte_grise}</TableCell>
                    <TableCell align="center" sx={{fontWeight: 'bold'}}>
                      <Box
                        sx={{
                          fontWeight: 'bold',
                          color: camion.extincteur ? 'primary.main' : 'secondary.main',
                        }}
                      >
                        {camion.extincteur ? 'Oui' : 'Non'}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCamion;