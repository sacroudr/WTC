import { StyleSheet } from 'react-native';

export const voyageScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(49, 104, 177, 0.11)',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  titleVoyages: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },

  // 🟩 Carte du voyage
  voyageCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E42422',
  },
  

  // 🕐 Ligne du haut avec heure et numéro
  voyageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  voyageHour: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a4a4a',
    lineHeight: 18,
  },
  voyageNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },

  // 👤 Client
  clientName: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 18,
    // marginTop: 1,
    color: '#333',
  },

  // 📍 Adresses
  addressContainer: {
    marginTop: 6,
    gap: 10,
  },
  addressBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap',
  },

  // 🕓 Heure avec icône
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 6, // ou paddingRight/marginRight si pas supporté
    marginBottom: 4,
  },
    timeText: {
      fontSize: 14,
      color: '#4a4a4a',
    },

    // Bouton démarrer (optionnel)
    startButton: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden', // important pour que le gradient respecte le radius
  },

  startButtonTouchable: {
    paddingVertical: 10,
    alignItems: 'center',
  },

  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});