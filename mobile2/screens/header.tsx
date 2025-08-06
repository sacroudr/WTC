// components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { headerStyles  as styles } from '../style/header.styles';
import type { Utilisateur } from '../types/utilisateur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface HeaderProps {
  user: Utilisateur | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleLogout = async () => {
    try {
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
          {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
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
