// src/api/authApi.ts
import axios from 'axios';
import { API_URL } from '@env';

export const loginChauffeur = async (mail: string, mot_de_passe: string) => {
  const res = await axios.post(`${API_URL}/utilisateurs/login/chauffeur`, {
    mail: mail.trim().toLowerCase(),
    mot_de_passe,
  });

  return res.data.utilisateur; // ou juste `res.data` si tu préfères
};
