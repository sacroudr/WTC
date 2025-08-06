// frontend/components/styles/planning.styles.ts
import { StyleSheet } from 'react-native';

export const planningStyles = StyleSheet.create({
  planningContainer: {
    backgroundColor: '#3168B1',
    paddingTop: 20,
    paddingBottom: 40,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
 dateRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  // width: '100%',
  // paddingHorizontal: 20, // pour ne pas coller au bord
  },
  arrowButton: {
    width: 40, // largeur fixe pour les flèches
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },

  dateText: {
    fontSize: 16,
    color: '#fff',
  },
});
