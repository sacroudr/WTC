import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../style/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { loginScreenStyles as styles } from '../style/loginScreen.styles';
import { loginChauffeur } from '../api/authapi';
import { RootStackParamList } from '../navigation/types';

// Logo WTC
const WTCLogo = require('../assets/WTC_LOGO_JPG_v2_removed.png');


// type RootStackParamList = {
//   Login: undefined;
//   Voyages: undefined;
// };

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [mail, setmail] = useState('');
  const [mot_de_passe, set_mot_de_passe] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authentification biométrique',
      fallbackLabel: 'Utiliser le code',
    });

    if (biometricAuth.success) {
      const savedToken = await SecureStore.getItemAsync('fingerprint_token');
      if (savedToken) {
        await AsyncStorage.setItem('token', savedToken); // 💾 restaurer la session
        navigation.reset({ index: 0, routes: [{ name: 'Voyages' }] }); // ou 'Accueil', ou autre
      } else {
        Alert.alert("Erreur", "Aucun token biométrique enregistré.");
      }
    }
  };


  const handleLogin = async () => {
    if (!mail || !mot_de_passe) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const utilisateur = await loginChauffeur(mail, mot_de_passe);

      const token = utilisateur.token;
      if (!token) {
        Alert.alert('Erreur', "Jeton d'accès manquant.");
        return;
      }

      await AsyncStorage.setItem('token', token);
      setmail('');
      set_mot_de_passe('');
      navigation.replace('Voyages');
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.detail || 'Email ou mot de passe incorrect.';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      {/* Header simple */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image source={WTCLogo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.welcomeText}>Bienvenue</Text>
          <Text style={styles.subtitleText}>Connectez-vous à votre compte</Text>
        </View>
      </View>

      {/* Formulaire de connexion */}
      <View style={styles.formContainer}>
        <View style={styles.card}>
          {/* Input Email */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor={colors.textSecondary}
                value={mail}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setmail}
              />
            </View>
          </View>

          {/* Input Mot de passe */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Mot de passe"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                value={mot_de_passe}
                onChangeText={set_mot_de_passe}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bouton de connexion */}
          <View style={[styles.loginButtonWrapper, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <LinearGradient
              colors={
                !mail || !mot_de_passe
                  ? ['#a0a0a0', '#a0a0a0']
                  : ['#E42422', '#3168B1']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.loginButton, { flex: 1, marginRight: 10 }]}
            >
              <TouchableOpacity
                disabled={loading || !mail || !mot_de_passe}
                onPress={handleLogin}
                style={[
                  styles.buttonContent,
                  (loading || !mail || !mot_de_passe) && styles.buttonDisabled,
                ]}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Se connecter</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
                
            <LinearGradient
              colors={
                ['#E42422', '#3168B1']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20, padding: 10 }}
            >
              <TouchableOpacity
                onPress={handleBiometricAuth}
                activeOpacity={0.8}
              >
                <Icon name="finger-print-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

          </View>
          
          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          {/* Options alternatives (optionnel) */}
          <View style={styles.alternativeOptions}>
            <Text style={styles.helpText}>
              Besoin d'aide ? Contactez votre administrateur
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}