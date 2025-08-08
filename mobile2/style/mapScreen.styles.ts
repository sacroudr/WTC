import { StyleSheet } from 'react-native';
export const mapScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(49, 104, 177, 0.11)',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    marginTop: 200,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: '#3168B1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
