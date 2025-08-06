import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { voyageScreenStyles as styles } from '../style/voyageScreen.styles';
import { LinearGradient } from 'expo-linear-gradient';
import type { Voyage } from '../types/voyage';
import type { Utilisateur } from '../types/utilisateur';
import Header from './header';
import Planning from './planning';
import { getCurrentUser, getVoyagesByChauffeur } from '../api/voyageScreenApi';


export default function VoyageScreen() {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [user, setUser] = useState<Utilisateur | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const loadUser = async () => {
    setLoadingUser(true);
    try {
      const fetchedUser = await getCurrentUser();
      setUser(fetchedUser);
    } catch (e) {
      console.error("Erreur récupération utilisateur", e);
    } finally {
      setLoadingUser(false);
    }
  };

  const loadVoyages = async () => {
    setLoading(true);
    try {
      const fetchedVoyages = await getVoyagesByChauffeur();
      setVoyages(fetchedVoyages);
    } catch (err) {
      setError("Erreur lors du chargement des voyages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user?.id_utilisateur) {
      loadVoyages();
    }
  }, [user]);

  const voyagesFiltres = voyages.filter(voyage => {
    const voyageDate = new Date(voyage.date_depart);
    return (
      voyageDate.getFullYear() === selectedDate.getFullYear() &&
      voyageDate.getMonth() === selectedDate.getMonth() &&
      voyageDate.getDate() === selectedDate.getDate()
    );
  });

  if (loading || loadingUser) {
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

  const handleStartVoyage = (id_voyage: number) => {
  // Tu peux naviguer ou changer le statut ici
  console.log("Commencer le voyage ID:", id_voyage);
  // navigation.navigate('DetailVoyage', { id_voyage });
};


  return (
    <View style={styles.container}>
      <Header user={user} />

      <Planning onDateChange={(newDate) => setSelectedDate(newDate)} />

      <Text style={styles.titleVoyages}> Vos voyages:</Text>

      <FlatList
        data={voyagesFiltres}
        keyExtractor={(item) => item.id_voyage.toString()}
        renderItem={({ item }) => (
          <View style={styles.voyageCard}>
            <View style={styles.voyageHeader}>
              <View style={styles.iconWithText}>
                <Ionicons name="time-outline" size={18} color="#3168B1" />
                <Text style={styles.voyageHour}>{item.heure_depart}</Text>
              </View>
              <View style={styles.iconWithText}>
                <Ionicons name="document-text-outline" size={18} color="#3168B1" style={{ marginRight: 6 }} />
                <Text style={styles.voyageNumber}>{item.numero_voyage}</Text>
              </View>
            </View>

            <View style={styles.iconWithText}>
              <Ionicons name="business-outline" size={18} color="#3168B1" style={{ marginRight: 6 }} />
              <Text style={styles.clientName}>Entreprise : {item.entreprise}</Text>
            </View>

            <View style={styles.addressContainer}>
              <View style={styles.addressBlock}>
                <Ionicons name="navigate" size={18} color="#3168B1" />
                <Text style={styles.addressText}>Départ : {item.adresse_depart}</Text>
              </View>

              <View style={styles.addressBlock}>
                <Ionicons name="flag" size={18} color="#3168B1" />
                <Text style={styles.addressText}>Arrivée : {item.adresse_arrive}</Text>
              </View>
            </View>
            {
              selectedDate.toDateString() === new Date().toDateString() && (
                <LinearGradient
                  colors={['#E42422', '#3168B1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startButton}
                >
                  <TouchableOpacity
                    onPress={() => handleStartVoyage(item.id_voyage)}
                    style={styles.startButtonTouchable}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.startButtonText}>Commencer le voyage</Text>
                  </TouchableOpacity>
                </LinearGradient>
              )
            }
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun voyage disponible.</Text>}
      />
    </View>
  );
}