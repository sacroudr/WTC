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
  Box,
  // Avatar,
  // Badge,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
} from '@mui/material'
// import { styled } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import type { Utilisateur } from '../../../types/utilisateur'
import DialogDeleteBo from './dialogDeleteBo'
import DialogProfileBo from './dialogProfileBo'
import DialogEditBo from './dialogEditBo'

interface ChauffeurContentProps {
  refreshTrigger: number;
}


const BoContent: React.FC<ChauffeurContentProps> = ({ refreshTrigger }) => {
  const apiUrl = import.meta.env.VITE_API_BACK
  const [backOffices, setBackOffices] = useState<Utilisateur[]>([])
  const [filteredBackOffices, setFilteredBackOffices] = useState<Utilisateur[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Constantes pour gestion du dialogue suppression
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedBo, setSelectedBo] = useState<Utilisateur | null>(null)

  //Constantes pour gestion du dialogue profil
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [selectedBoId, setSelectedBoId] = useState<number | null>(null);

  //Constantes pour gestion du dialogue editer
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBoEdit, setSelectedBoEdit] = useState<Utilisateur | null>(null);


  const handleOpenDeleteDialog = (bo: Utilisateur) => {
    setSelectedBo(bo)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setSelectedBo(null)
    setOpenDeleteDialog(false)
  }

  const handleConfirmDelete = (message: string) => {
    fetchBackOffices()
    setSuccessMessage(message)
    // Affiche éventuellement une snackbar ici
  }

  const handleOpenProfileDialog = (bo: Utilisateur) => {
    setSelectedBoId(bo.id_utilisateur);
    setOpenProfileDialog(true);
  };

  const handleCloseProfileDialog = () => {
    setSelectedBoId(null);
    setOpenProfileDialog(false);
  };

  const handleOpenEditDialog = (bo: Utilisateur) => {
    setSelectedBoEdit(bo);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedBoEdit(null);
    setOpenEditDialog(false);
  };

  const handleUpdateSuccess = () => {
    fetchBackOffices(); // refresh data
    setSuccessMessage("Back-office mis à jour avec succès");
  };



  const fetchBackOffices = async () => {
  setLoading(true)
  setError(null)
  try {
    const response = await axios.get(`${apiUrl}/backoffice/`)
    const users = response.data.backoffice_users.utilisateurs.sort((a: Utilisateur, b: Utilisateur) => a.id_utilisateur - b.id_utilisateur)
    setBackOffices(users)
    setFilteredBackOffices(users)
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs', error)
    setError("Erreur lors du chargement des utilisateurs.")
  } finally {
    setLoading(false)
  }
}



  useEffect(() => {
    fetchBackOffices()
  }, [refreshTrigger])

  useEffect(() => {
  const filtered = backOffices.filter(u =>
    `${u.prenom} ${u.nom} ${u.mail} ${u.carte_national}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  setFilteredBackOffices(filtered)
}, [searchTerm, backOffices])


  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage)
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
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
    <TableCell sx={{ fontWeight: 600 }}>Nom</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>Prénom</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>Carte Nationale</TableCell>
    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
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
  ) : filteredBackOffices.length === 0 ? (
    <TableRow>
      <TableCell colSpan={5} align="center">
        Aucun utilisateur trouvé.
      </TableCell>
    </TableRow>
  ) : (
    filteredBackOffices
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map(user => (
        <TableRow key={user.id_utilisateur} hover>
          <TableCell>{user.nom}</TableCell>
          <TableCell>{user.prenom}</TableCell>
          <TableCell>{user.mail}</TableCell>
          <TableCell>{user.carte_national}</TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                sx={{ fontSize: '12px', textTransform: 'none', background: '#3168B1' }}
                onClick={() => handleOpenEditDialog(user)}
              >
                MODIFIER
              </Button>
              <Button size="small" variant="outlined" color="primary" onClick={() => handleOpenProfileDialog(user)}>Profil</Button>
              <Button size="small" variant="contained" color="error" onClick={() => handleOpenDeleteDialog(user)}>Supprimer</Button>
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
          count={filteredBackOffices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Notification d'erreur éventuelle */}
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
      <DialogProfileBo
        open={openProfileDialog}
        onClose={handleCloseProfileDialog}
        backOfficeId={selectedBoId}
      />

      <DialogDeleteBo
        open={openDeleteDialog}
        backOffice={selectedBo}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <DialogEditBo
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        backOffice={selectedBoEdit}
        onUpdated={handleUpdateSuccess}
      />

    </Box>
  )
}

export default BoContent
