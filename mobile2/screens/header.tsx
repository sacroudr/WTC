// // components/Header.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { headerStyles as styles } from '../style/header.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  id_utilisateur: number;
  prenom: string;
  nom: string;
  // Ajoute d'autres champs si nécessaire
}

const Header: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const fetchUserFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          setUser(decoded);
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token :', error);
      }
    };

    fetchUserFromToken();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await SecureStore.setItemAsync('fingerprint_token', token);
      }
      await AsyncStorage.removeItem('token');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={50} color="#3168B1" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
        </Text>
        <Text style={styles.roleText}>Chauffeur</Text>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
