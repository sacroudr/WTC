import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { documentScreenStyles as styles } from '../style/documentScreen.styles';
import Header from './header';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { addSuiviLivraison } from '../api/suiviApi';
import { saveLastScreen } from '../helpers/progressTracker';
import { RootStackParamList } from '../navigation/types';

type DocumentsRouteParam = {
  Documents: { id_livraison: number };
};

// type RootStackParamList = {
//   Voyages: undefined;
//   Documents: { id_livraison: number };
//   ChargementCamion: { id_livraison: number };
// };

export default function DocumentScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<DocumentsRouteParam, 'Documents'>>();
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
        'Pris en charge des documents',
        localisation,
        'Le chauffeur a pris en charge les documents.'
      );

      Alert.alert('Succès', 'Suivi ajouté avec votre position.');
      navigation.navigate('ChargementCamion', { id_livraison });
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
          Avez-vous pris en charge des documents ?
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOuiPress} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Oui'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={async () => {
                await saveLastScreen(id_livraison, 'Documents'); // ⬅️ On garde en mémoire que l’utilisateur a quitté à l'étape "document"
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
