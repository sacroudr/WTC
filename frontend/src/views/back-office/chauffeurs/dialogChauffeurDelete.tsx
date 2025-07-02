// src/components/DialogChauffeurDelete.tsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import axios from 'axios'

import type { Chauffeur } from '../../../types/chauffeur'

interface DialogChauffeurDeleteProps {
  open: boolean
  chauffeur: Chauffeur | null
  onClose: () => void
  onConfirm: (successMessage: string) => void
}

const DialogChauffeurDelete: React.FC<DialogChauffeurDeleteProps> = ({
  open,
  chauffeur,
  onClose,
  onConfirm,
}) => {
    const apiUrl = import.meta.env.VITE_API_BACK
    const handleConfirm = async () => {
    if (!chauffeur) return

    try {
        await axios.delete(`${apiUrl}/chauffeurs/delete/${chauffeur.id_chauffeur}`)
        onConfirm(`Le chauffeur ${chauffeur.utilisateur?.prenom} ${chauffeur.utilisateur?.nom} a été supprimé avec succès.`)
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
        alert(`Erreur: ${error.response?.data?.detail || 'Suppression impossible'}`)
        } else {
        alert(`Erreur inattendue: ${error}`)
        }
    }
    }


  return (
    <Dialog sx={{color: '#3168B1'}} open={open} onClose={onClose}>
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer{' '}
          <strong>
            {chauffeur?.utilisateur?.prenom} {chauffeur?.utilisateur?.nom}
          </strong>
          ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{color: '#3168B1'}}>Annuler</Button>
        <Button onClick={handleConfirm} sx={{background: '#E42422' }} variant="contained">
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogChauffeurDelete //1064  0617878595
