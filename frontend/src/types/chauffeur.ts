import type { Camion } from "./camion";

export type Utilisateur = {
  nom: string;
  prenom: string;
};
export type Chauffeur = {
    id_chauffeur: number;
    id_utilisateur: number;
    num_permis: string;
    disponibilite: boolean;
    utilisateur?: Utilisateur;
    // Ajout de la propriété camions (optionnelle car parfois peut être absente)
    camions?: Camion[];
};