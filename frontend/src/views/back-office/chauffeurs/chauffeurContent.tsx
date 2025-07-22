import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Paper,
  Table,
  TablePagination,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TextField,
  IconButton,
  Button,
  Box,
  Avatar,
  Badge,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import type { Chauffeur } from '../../../types/chauffeur'
import DialogChauffeurDelete from './dialogChauffeurDelete'
import DialogProfileChauffeur from './dialogProfileChauffeur'
import DialogEditChauffeur from './dialogEditChauffeur'

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
}))

interface ChauffeurContentProps {
  refreshTrigger: number;
}

const ChauffeurContent: React.FC<ChauffeurContentProps> = ({ refreshTrigger }) => {
  const apiUrl = import.meta.env.VITE_API_BACK
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([])
  const [filteredChauffeurs, setFilteredChauffeurs] = useState<Chauffeur[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Etats pour gestion du dialogue suppression
  const [dialogOpen, setDialogOpen] = useState(false)
  const [chauffeurToDelete, setChauffeurToDelete] = useState<Chauffeur | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Etats pour gestion du dialogue profile
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [selectedChauffeurId, setSelectedChauffeurId] = useState<number | null>(null)

  // Etats pour gestion du dialogue edition
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [chauffeurToEdit, setChauffeurToEdit] = useState<Chauffeur | null>(null)


  // Nouveaux états pour loading et erreur
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChauffeurs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<Chauffeur[]>(`${apiUrl}/chauffeurs/`)
      const sortedChauffeurs = response.data.sort((a, b) => a.id_chauffeur - b.id_chauffeur)
      setChauffeurs(sortedChauffeurs)
      setFilteredChauffeurs(sortedChauffeurs)
    } catch (error) {
      console.error('Erreur lors du chargement des chauffeurs', error)
      setError("Erreur lors du chargement des chauffeurs.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChauffeurs()
  }, [refreshTrigger])

  useEffect(() => {
    const filtered = chauffeurs.filter(ch =>
      `${ch.utilisateur?.prenom} ${ch.utilisateur?.nom} ${ch.utilisateur?.mail} ${ch.telephone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    setFilteredChauffeurs(filtered)
  }, [searchTerm, chauffeurs])

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleOpenDeleteDialog = (chauffeur: Chauffeur) => {
    setChauffeurToDelete(chauffeur)
    setDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDialogOpen(false)
    setChauffeurToDelete(null)
  }

  // Gestion du dialogue edition
  const handleOpenEditDialog = (chauffeur: Chauffeur) => {
  setChauffeurToEdit(chauffeur)
  setEditDialogOpen(true)
}

  const handleCloseEditDialog = () => {
    setChauffeurToEdit(null)
    setEditDialogOpen(false)
  }
  // Gestion du dialogue profil
  const handleOpenProfileDialog = (chauffeurId: number) => {
  setSelectedChauffeurId(chauffeurId)
  setProfileDialogOpen(true)
}
  const handleCloseProfileDialog = () => {
    setSelectedChauffeurId(null)
    setProfileDialogOpen(false)
  }

  // Gestion de la suppression
  const handleConfirmDelete = (message: string) => {
    if (!chauffeurToDelete) return

    setChauffeurs(prev => prev.filter(c => c.id_chauffeur !== chauffeurToDelete.id_chauffeur))
    setFilteredChauffeurs(prev => prev.filter(c => c.id_chauffeur !== chauffeurToDelete.id_chauffeur))
    setDialogOpen(false)
    setChauffeurToDelete(null)
    setSuccessMessage(message)
  }

  // Quand la maj est terminée, recharge les chauffeurs
  const handleChauffeurUpdated = () => {
    fetchChauffeurs()
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <TextField
          label="Rechercher"
          variant="outlined"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearchTerm('')} size="small">
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ background: 'linear-gradient(90deg, #f5a3ae, #c4a9f3)' }}>
            <TableRow>
              <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Nom</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Prénom</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Camion</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Téléphone</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : filteredChauffeurs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun chauffeur trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filteredChauffeurs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(ch => (
                  <TableRow key={ch.id_chauffeur} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                        <StyledBadge
                          overlap="circular"
                          variant="dot"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: ch.disponibilite ? '#44b700' : '#d32f2f',
                            },
                          }}
                        >
                          <Avatar>
                            {ch.utilisateur?.prenom?.[0]}
                            {ch.utilisateur?.nom?.[0]}
                          </Avatar>
                        </StyledBadge>
                        {ch.utilisateur?.nom}
                      </Box>
                    </TableCell>
                    <TableCell>{ch.utilisateur?.prenom}</TableCell>
                    <TableCell>
                      {ch.camions && ch.camions.length > 0
                        ? ch.camions.map(c => c.matricule).join(', ')
                        : (
                          <Typography 
                            sx={{ 
                              color: '#E42422', 
                              fontStyle: 'italic', 
                              fontWeight: 'bold' 
                            }}
                          >
                            Non affectée
                          </Typography>
                        )}
                    </TableCell>
                    <TableCell>{ch.telephone}</TableCell>
                    <TableCell>{ch.utilisateur?.mail}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ fontSize: '12px', textTransform: 'none', background: '#3168B1' }}
                          onClick={() => handleOpenEditDialog(ch)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '12px', textTransform: 'none' }}
                          onClick={() => handleOpenProfileDialog(ch.id_chauffeur)}
                        >
                          Profil
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ fontSize: '12px', textTransform: 'none', background: '#E42422' }}
                          onClick={() => handleOpenDeleteDialog(ch)}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredChauffeurs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialogue modification chauffeur */}
      <DialogEditChauffeur
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        chauffeur={chauffeurToEdit}
        onUpdated={() => {
          handleChauffeurUpdated();
          setSuccessMessage("Chauffeur modifié avec succès !");
        }}
      />

      {/* Dialogue profil chauffeur */}
      <DialogProfileChauffeur
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        chauffeurId={selectedChauffeurId}
      />

      {/* Dialogue suppression */}
      <DialogChauffeurDelete
        open={dialogOpen}
        onClose={handleCloseDeleteDialog}
        chauffeur={chauffeurToDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Notification succès */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ChauffeurContent
