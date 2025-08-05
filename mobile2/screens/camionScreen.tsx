import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // adapte si besoin
import DateTimePicker from '@react-native-community/datetimepicker';


type Voyage = {
  id_voyage: number;
  destination: string;
  date_depart: string;
  numero_voyage: string;
  adresse_depart: string;
  adresse_arrive: string;
};

type Utilisateur = {
  id_utilisateur: number;
  nom: string;
  prenom: string;
};

export default function VoyageScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);

const onChangeDate = (event: any, date?: Date) => {
  setShowDatePicker(false);
  if (date) {
    setSelectedDate(date);
  }
};



  const loadUser = async () => {
    setLoadingUser(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error("Token manquant");

      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const userId = payload.id_utilisateur;

      const res = await axios.get(`${API_URL}/utilisateurs/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.utilisateur);
    } catch (e) {
      console.error("Erreur récupération utilisateur", e);
    } finally {
      setLoadingUser(false);
    }
  };

  const loadVoyages = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error("Token manquant");

      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const userId = payload.id_utilisateur;

      const res = await axios.get(`${API_URL}/chauffeurs/${userId}/voyages` , {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Voyages récupérés:', res.data);
      if (res.data && Array.isArray(res.data)) {
        setVoyages(res.data);
      } else {
        setVoyages([]);
      }
    } catch (err) {
      console.error(err);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

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

  return (
  <View style={styles.container}>
    {/* Header utilisateur */}
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={50} color="#4a90e2" />
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

    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateSelectorButton}>
  <Text style={styles.dateSelectorText}>
    {selectedDate.toLocaleDateString()}
  </Text>
  <Ionicons name="calendar-outline" size={24} color="#4a90e2" />
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="default"
    onChange={onChangeDate}
  />
)}

<Text style={styles.titleVoyages}>Voyages du {selectedDate.toLocaleDateString()}</Text>


    {/* Titre avant la liste */}
    {/* <Text style={styles.titleVoyages}>Voyages d'aujourd'hui</Text> */}

    {/* Liste des voyages */}
    <FlatList
       data={voyagesFiltres}
       keyExtractor={(item) => item.id_voyage.toString()}
      renderItem={({ item }) => (
        <View style={styles.voyageCard}>
          <View style={styles.voyageHeader}>
            <Text style={styles.voyageTitle}>{item.destination || item.adresse_arrive}</Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>{new Date(item.date_depart).toLocaleDateString()}</Text>
            </View>
          </View>
          <Text style={styles.voyageNumber}>N° voyage : {item.numero_voyage}</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>Départ</Text>
              <Text style={styles.addressText}>{item.adresse_depart}</Text>
            </View>
            <View style={styles.addressBlock}>
              <Text style={styles.addressLabel}>Arrivée</Text>
              <Text style={styles.addressText}>{item.adresse_arrive}</Text>
            </View>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun voyage disponible.</Text>}
    />
  </View>
);

}

const styles = StyleSheet.create({
    dateSelectorButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  backgroundColor: '#e0eaff',
  alignSelf: 'center',
  shadowColor: '#4a90e2',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 3,
},

dateSelectorText: {
  fontSize: 18,
  fontWeight: '600',
  color: '#4a90e2',
  marginRight: 8,
},

    titleVoyages: {
  fontSize: 22,
  fontWeight: '700',
  color: '#2a2a72',
  marginBottom: 12,
  marginLeft: 4,
},

    voyageCard: {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  shadowColor: '#000',
  borderColor: 'black',
  borderWidth: 2,
},

voyageHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},

voyageTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#2a2a72',
  flexShrink: 1,
},

dateBadge: {
  backgroundColor: '#4a90e2',
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 20,
  shadowColor: '#2a2a72',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 3,
},

dateBadgeText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
},

voyageNumber: {
  color: '#555',
  marginBottom: 12,
  fontWeight: '600',
},

addressContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

addressBlock: {
  flex: 1,
  marginRight: 12,
},

addressLabel: {
  fontWeight: '700',
  color: '#888',
  marginBottom: 4,
},

addressText: {
  color: '#333',
  fontSize: 14,
},

  container: { flex: 1, padding: 16, paddingTop: 40, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
  voyageItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainer: {
    backgroundColor: '#e0eaff',
    borderRadius: 50,
    padding: 4,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
