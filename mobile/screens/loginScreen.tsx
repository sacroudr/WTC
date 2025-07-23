import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

type RootStackParamList = {
  Login: undefined;
  Camions: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [mail, setmail] = useState('');
  const [mot_de_passe, set_mot_de_passe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/utilisateurs/login/`, {
        mail: mail,
        mot_de_passe: mot_de_passe,
      });

      const token = res.data.utilisateur.token;
        if (!token) {
        Alert.alert('Erreur', "Jeton d'accès manquant.");
        return;
        }

        await AsyncStorage.setItem('token', token);


      navigation.replace('Camions'); // redirige vers CamionScreen
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={mail}
        autoCapitalize="none"
        onChangeText={setmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={mot_de_passe}
        onChangeText={set_mot_de_passe}
      />
      <Button title={loading ? 'Connexion...' : 'Se connecter'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
});
