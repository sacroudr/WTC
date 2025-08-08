export type RootStackParamList = {
  Login: undefined;
  Voyages: undefined;
  Documents: { id_livraison: number };
  ChargementCamion: { id_livraison: number };
  Port: { id_livraison: number };
  Map: { id_livraison: number };
  // Ajoute ici tous les écrans que tu as
};
