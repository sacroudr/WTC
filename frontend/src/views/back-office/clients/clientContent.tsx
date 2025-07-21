import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, CircularProgress, Alert,
  TextField, InputAdornment, Snackbar, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';


import type { ClientApiResponse } from '../../../types/client';
import { FiUser } from 'react-icons/fi';
import DialogClientInfo from './dialogClientInfo';
import DialogClientDelete from './dialogClientDelete';
import DialogClientEdit from './dialogClientEdit';

interface ClientContentProps {
  refreshTrigger: number;
}

const ClientContent: React.FC<ClientContentProps> = ({ refreshTrigger }) => {
  const apiUrl = import.meta.env.VITE_API_BACK;
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState<string|null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  //Constantes pour gestion du dialogue suppression
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  //Constantes pour gestion du dialogue editer
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState<number | null>(null);

  const handleTicketClick = (id_client: number) => {
  navigate(`/clients_back-office/${id_client}`);
};
  const handleOpenInfo = (id: number) => {
    setSelectedClientId(id);
    setInfoOpen(true);
    };

  const handleCloseInfo = () => {
    setInfoOpen(false);
    setSelectedClientId(null);
    };
    
    const handleOpenDelete = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteOpen(true);
    };

const handleCloseDelete = () => {
  setDeleteOpen(false);
  setSelectedDeleteId(null);
};

 const handleOpenEdit = (id: number) => {
    setSelectedEditId(id);
    setEditOpen(true);
    };

const handleCloseEdit = () => {
  setEditOpen(false);
  setSelectedEditId(null);
};

const handleClientUpdated = () => {
    fetchClients()
  }

const handleClientDeleted = () => {
  setClients(prev => prev.filter(c => c.id_client !== selectedDeleteId));
  setSuccessMsg("Client supprimé avec succès.");
};

    const fetchClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${apiUrl}/client/`);
            const sortedClients = res.data.clients.sort((a: ClientApiResponse, b: ClientApiResponse) => a.id_client - b.id_client);
            setClients(sortedClients);
        } catch (error) {
            console.error("Erreur lors du chargement des clients", error);
            setError("Impossible de charger les clients.");
        } finally {
            setLoading(false);
        }
        };


  useEffect(() => {
      fetchClients()
    }, [refreshTrigger])

  const filtered = clients.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.utilisateur.nom.toLowerCase().includes(q)
      || c.utilisateur.prenom.toLowerCase().includes(q)
      || c.entreprise.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page-1)*perPage, page*perPage);

  return (
    <Box sx={{ pt:3 }}>
      {/* Search */}
      <Box sx={{ mb:4 }}>
        <TextField
          placeholder="Rechercher un client, une entreprise..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: 600,
            backgroundColor: '#f9f9f9',
            borderRadius: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              paddingLeft: '12px',
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#ccc',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3168B1',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  sx={{
                    backgroundColor: '#eaeaea',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SearchIcon sx={{ color: '#888' }} />
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box textAlign="center"><CircularProgress/></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filtered.length === 0 ? (
        <Alert severity="info">Aucun client trouvé.</Alert>
      ) : (
        <>
          <Box sx={{ display:'flex', flexWrap:'wrap', gap:3 }}>
            {current.map(c => (
              <Box key={c.id_client} sx={{ width: 'calc(25% - 24px)', minWidth: 260 }}>
                <Paper
                elevation={4}
                onClick={() => handleTicketClick(c.id_client)}
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  p: 3,
                  height: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >

                  {/* bandeau dégradé */}
                  <Box sx={{
                    position:'absolute', top:0, left:0, width:'100%', height:7,
                    background: 'linear-gradient(90deg, #3168B1 0%, #E42422 100%)',
                    borderTopLeftRadius:4, borderTopRightRadius:4, zIndex:10
                  }}/>

                  {/* icônes action */}
                  <Box sx={{ position:'absolute', top:8, right:8, display:'flex', gap:1, zIndex:20 }}>
                    <EditOutlinedIcon sx={{cursor:'pointer', color:'#3168B1'}} titleAccess="Modifier" onClick={(e)=>{e.stopPropagation(); handleOpenEdit(c.id_client)}}/>
                    <InfoOutlinedIcon sx={{cursor:'pointer', color:'#3168B1'}} titleAccess="Infos" onClick={(e)=>{e.stopPropagation(); handleOpenInfo(c.id_client)}}/>
                    <DeleteOutlineIcon sx={{cursor:'pointer', color:'#E42422'}} titleAccess="Supprimer" onClick={(e)=>{e.stopPropagation(); handleOpenDelete(c.id_client)}}/>
                  </Box>

                  {/* contenu client */}
                  <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" gap={1} mt={2}>
                    <Box display="flex"  gap={1}>
                        <FiUser size={20} color="#E42422" />
                        <Typography variant="h6" color="text.primary" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        {c.utilisateur.prenom} {c.utilisateur.nom}
                        </Typography>
                    </Box>

                    <Typography variant="body2"><strong>Entreprise :</strong> {c.entreprise}</Typography>
                    <Typography variant="body2"><strong>Téléphone :</strong> {c.telephone}</Typography>
                    <Typography variant="body2" noWrap sx={{ textOverflow: 'ellipsis' }}>
                        <strong>Adresse :</strong> {c.adresse}
                    </Typography>
                    </Box>
                </Paper>
              </Box>
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ mt:4, display:'flex', justifyContent:'center' }}>
              <Pagination
                count={totalPages} page={page}
                onChange={(_,p)=>{setPage(p); window.scrollTo({top:0});}}
                color="secondary" shape="rounded"
              />
            </Box>
          )}
        </>
      )}

    <DialogClientInfo
        open={infoOpen}
        onClose={handleCloseInfo}
        idClient={selectedClientId}
        />
    <DialogClientDelete
        open={deleteOpen}
        handleClose={handleCloseDelete}
        idClient={selectedDeleteId}
        onClientDeleted={handleClientDeleted}
        />
    <DialogClientEdit
        open={editOpen}
        onClose={handleCloseEdit}
        idClient={selectedEditId}
        onClientUpdated={() => {
          handleClientUpdated();
          setSuccessMsg("Client modifié avec succès !");
        }}
        />


      {/* snackbar succès */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={()=>setSuccessMsg(null)}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
      >
        <Alert severity="success" onClose={()=>setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientContent;
