import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { colors, spacing, fontSizes, fonts } from '../theme';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

// Logo WTC
const WTCLogo = require('../assets/WTC_LOGO_JPG_v2_removed.png');

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Camions: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [mail, setmail] = useState('');
  const [mot_de_passe, set_mot_de_passe] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log('API_URL =', API_URL);
      const res = await axios.post(`${API_URL}/utilisateurs/login/chauffeur`, {
        mail: mail.trim().toLowerCase(),
        mot_de_passe: mot_de_passe,
      });

      const token = res.data.utilisateur.token;
      if (!token) {
        Alert.alert('Erreur', "Jeton d'accès manquant.");
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('token', token);
      navigation.replace('Camions');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
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
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Se connecter</Text>
                  <Icon name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                </>
              )}
            </View>
          </TouchableOpacity>

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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // ✅ centre verticalement
  },
  headerContainer: {
    marginTop:40,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: spacing.xLarge,
    paddingBottom: spacing.medium,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeText: {
    fontSize: fontSizes.xLarge,
    fontFamily: fonts.heading,
    color: colors.text,
    marginBottom: spacing.xSmall,
  },
  subtitleText: {
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: spacing.large,
    alignItems: 'center', // ✅ centre horizontalement
    marginTop: spacing.medium,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.large,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: '100%',
    maxWidth: 400, // ✅ largeur max pour limiter l'étalement
  },
  inputContainer: {
    marginBottom: spacing.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  inputIcon: {
    marginRight: spacing.small,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.medium,
    fontFamily: fonts.regular,
    color: colors.text,
    paddingVertical: spacing.small,
  },
  eyeIcon: {
    paddingLeft: spacing.small,
  },
  helpText: {
    fontSize: fontSizes.small,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: spacing.large,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryLight,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSizes.medium,
    fontFamily: fonts.bold,
    marginRight: spacing.small,
  },
  buttonIcon: {
    marginLeft: spacing.small,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEE2E6',
  },
  dividerText: {
    marginHorizontal: spacing.small,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
  },
  alternativeOptions: {
    marginTop: spacing.small,
  },
});
