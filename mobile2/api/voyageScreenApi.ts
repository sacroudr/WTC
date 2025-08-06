import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import type { Voyage } from '../types/voyage';
import type { Utilisateur } from '../types/utilisateur';

export const getCurrentUser = async (): Promise<Utilisateur | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token manquant');

    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const userId = payload.id_utilisateur;

    const res = await axios.get(`${API_URL}/utilisateurs/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.utilisateur;
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur :', error);
    throw error;
  }
};

export const getVoyagesByChauffeur = async (): Promise<Voyage[]> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Token manquant');

    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const userId = payload.id_utilisateur;

    const res = await axios.get(`${API_URL}/chauffeurs/${userId}/voyages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.voyages ?? [];
  } catch (error) {
    console.error('Erreur lors de la récupération des voyages :', error);
    throw error;
  }
};
