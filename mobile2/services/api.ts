import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Met ici l’URL de ton backend FastAPI
  timeout: 5000,
});

export default api;


export const fetchcamion = async () => {
  const response = await api.get('/camions/');
  return response.data;
};
