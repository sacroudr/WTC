// api/suiviApi.ts
import axios from 'axios';
import { API_URL } from '@env';
import { Alert } from 'react-native';

export const addSuiviLivraison = async (
  id_livraison: number,
  statut: string,
  localisation: string,
  latitude: number,
  longitude: number,
  commentaire: string = ""
) => {
  try {
    const response = await axios.post(
      `${API_URL}/suivi/`,
      {
        id_livraison,
        statut,
        localisation,
        latitude,
        longitude,
        commentaire
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erreur complète:", error); // Ajouté
    Alert.alert('Erreur', error.response?.data?.detail || error.message || 'Une erreur est survenue');
    // throw new Error(error.response?.data?.detail || "Erreur lors de l'ajout du suivi");
  }
};
