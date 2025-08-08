// MapScreen.tsx
import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { mapScreenStyles as styles } from '../style/mapScreen.styles';
import { addSuiviLivraison } from '../api/suiviApi';
import Header from './header';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { clearProgress, saveLastScreen } from '../helpers/progressTracker';
import { RootStackParamList } from '../navigation/types';

type MapRouteParam = {
  Map: { id_livraison: number };
};

export default function MapScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<MapRouteParam, 'Map'>>();
  const { id_livraison } = route.params;

  const [loading, setLoading] = useState(false);

  const handleOuiPress = async () => {
    setLoading(true);
    try {
      // Récupération de la position
      const location = await Location.getCurrentPositionAsync({});
      const localisation = `${location.coords.latitude}, ${location.coords.longitude}`;

      // Envoi au backend
      await addSuiviLivraison(
        id_livraison,
        'Livraison effectuée',
        localisation,
        location.coords.latitude,
        location.coords.longitude,
        'La livraison a été effectuée.'
      );

      await clearProgress(id_livraison);

      Alert.alert('Succès', 'Suivi ajouté avec votre position.');
      navigation.navigate('Voyages');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.centerContainer}>
        <Text style={styles.questionText}>
          La livraison est-elle faite
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleOuiPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Oui'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={async () => {
              await saveLastScreen(id_livraison, 'Map');
              navigation.navigate('Voyages');
            }}
          >
            <Text style={styles.buttonText}>Non</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
