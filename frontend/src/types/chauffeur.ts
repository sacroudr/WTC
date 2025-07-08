import type { Camion } from "./camion";

export type Utilisateur = {
  nom: string;
  prenom: string;
  mail: string;
  carte_national: string;
};
export type Chauffeur = {
    id_chauffeur: number;
    id_utilisateur: number;
    num_permis: string;
    telephone: string;
    disponibilite: boolean;
    utilisateur?: Utilisateur;
    // Ajout de la propriété camions (optionnelle car parfois peut être absente)
    camions?: Camion[];
};