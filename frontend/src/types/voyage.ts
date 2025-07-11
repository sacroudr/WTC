export type Voyage = {
  id_voyage: number;
  id_client: number;
  id_chauffeur: number;
  id_camion: number;
  numero_voyage: string;
  ice: string;
  date_depart: Date;
  adresse_depart: string;
  adresse_arrivee: string;
  statut: string;
  entreprise: string;

  nom_client: string;
  nom_chauffeur: string;
  matricule: string;
};