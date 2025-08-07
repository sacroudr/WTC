import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { voyageScreenStyles as styles } from '../style/voyageScreen.styles';
import { LinearGradient } from 'expo-linear-gradient';
import type { Voyage } from '../types/voyage';
import * as Location from 'expo-location';

import Header from './header';
import Planning from './planning';import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getVoyagesByChauffeur } from '../api/voyageScreenApi';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getLastScreen } from '../helpers/progressTracker';
import { RootStackParamList } from '../navigation/types';

// type RootStackParamList = {
//   Voyages: undefined;
//   Documents: { id_livraison: number };
//   ChargementCamion: { id_livraison: number }; 
// };

export default function VoyageScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [voyages, setVoyages] = useState<Voyage[]>([]);

  const { user, loadingUser } = useCurrentUser();

  const [loadingVoyages, setLoadingVoyages] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const loadVoyages = async () => {
    setLoadingVoyages(true);
    try {
      const fetchedVoyages = await getVoyagesByChauffeur();
      setVoyages(fetchedVoyages);
    } catch (err) {
      setError("Erreur lors du chargement des voyages.");
    } finally {
      setLoadingVoyages(false);
    }
  };

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

  if (loadingVoyages || loadingUser) {
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

  const handleStartVoyage = async (id_livraison: number) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'La localisation est nécessaire pour commencer le voyage.');
      return;
    }

    const lastScreen = await getLastScreen(id_livraison);

    if (lastScreen === 'ChargementCamion') {
      navigation.navigate('ChargementCamion', { id_livraison });
    } else if (lastScreen === 'Documents') {
      navigation.navigate('Documents', { id_livraison });
    } else {
      // Aucun historique, début du parcours
      navigation.navigate('Documents', { id_livraison });
    }
  } catch (error: any) {
    Alert.alert('Erreur', error.message || 'Impossible de récupérer la localisation.');
  }
};


  return (
    <View style={styles.container}>
      <Header user={user} />

      <Planning onDateChange={(newDate) => setSelectedDate(newDate)} />

      <Text style={styles.titleVoyages}> Vos voyages:</Text>

      <FlatList
        data={voyagesFiltres}
        keyExtractor={(item) => item.id_livraison.toString()}
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
                    onPress={() => handleStartVoyage(item.id_livraison)}
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