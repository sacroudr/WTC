export type Utilisateur = {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  mail: string;
  mot_de_passe: string;
  role: string;
  date_creation: Date;
  carte_national: string;
};