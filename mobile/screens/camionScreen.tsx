import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env'

type Camion = {
  id_camion: number;
  matricule: string;
  marque: string;
  modele: string;
  // adapte selon la vraie structure retournée par ton API
};

export default function CamionScreen() {
  const [camions, setCamions] = useState<Camion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCamions = async () => {
      try {
        const res = await axios.get(`${API_URL}/camions/`);
        console.log('Réponse API:', res.data);
        if (res.data && Array.isArray(res.data.camions)) {
          setCamions(res.data.camions);
        } else {
          setCamions([]);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des camions.");
      } finally {
        setLoading(false);
      }
    };

    loadCamions();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={camions}
        keyExtractor={(item) => item.id_camion.toString()}
        renderItem={({ item }) => (
          <View style={styles.camionItem}>
            <Text style={styles.title}>{item.matricule}</Text>
            <Text>{item.marque} - {item.modele}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Aucun camion disponible.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
  camionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
});
