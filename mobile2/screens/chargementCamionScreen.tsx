// ChargementCamionScreen.tsx
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { chargementCScreenStyles as styles } from '../style/chargementCScreen.styles';
import { addSuiviLivraison } from '../api/suiviApi';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Header from './header';
import * as Location from 'expo-location';
import { StackNavigationProp } from '@react-navigation/stack';
import { saveLastScreen } from '../helpers/progressTracker';
import { RootStackParamList } from '../navigation/types';

type ChargementCamionRouteParam = {
  ChargementCamion: { id_livraison: number };
};

// type RootStackParamList = {
//   Voyages: undefined;
//   // Documents: { id_livraison: number };
//   // ChargementCamion: { id_livraison: number };
// };

export default function ChargementCamionScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<ChargementCamionRouteParam, 'ChargementCamion'>>();
  const { id_livraison } = route.params;

  const { user, loadingUser } = useCurrentUser();
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
        'Chargement du camion',
        localisation,
        'Le camion a été chargé.'
      );

      Alert.alert('Succès', 'Suivi ajouté avec votre position.');
      // navigation.navigate('ChargementCamion', { id_livraison });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3168B1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header user={user} />

      <View style={styles.centerContainer}>
        <Text style={styles.questionText}>
          Le camion est-il chargé?
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
              await saveLastScreen(id_livraison, 'ChargementCamion');
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
