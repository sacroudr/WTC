// api/suiviApi.ts
import axios from 'axios';
import { API_URL } from '@env';

export const addSuiviLivraison = async (
  id_livraison: number,
  statut: string,
  localisation: string,
  commentaire: string = ""
) => {
  try {
    const response = await axios.post(
      `${API_URL}/suivi/`,
      {
        id_livraison,
        statut,
        localisation,
        commentaire
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Erreur lors de l'ajout du suivi");
  }
};
