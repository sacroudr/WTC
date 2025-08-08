// helpers/progressTracker.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = 'voyage_progress';

type ProgressMap = {
  [id_livraison: string]: 'Documents' | 'ChargementCamion' | 'Port' | 'Map';
};

export const saveLastScreen = async (
  id_livraison: number,
  screen: 'Documents' | 'ChargementCamion' | 'Port' | 'Map'
) => {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  const progress: ProgressMap = raw ? JSON.parse(raw) : {};
  progress[id_livraison] = screen;
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getLastScreen = async (
  id_livraison: number
): Promise<'Documents' | 'ChargementCamion' | 'Port' | 'Map' | null> => {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  if (!raw) return null;
  const progress: ProgressMap = JSON.parse(raw);
  return progress[id_livraison] || null;
};

export const clearProgress = async (id_livraison: number) => {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  if (!raw) return;
  const progress: ProgressMap = JSON.parse(raw);
  delete progress[id_livraison];
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};
