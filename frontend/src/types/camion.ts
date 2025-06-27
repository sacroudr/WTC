// export type Camion = {
//     id_camion: number;
//     matricule: string;
//     modele: string;
//     assurance: string;
//     fin_validite_assurance: string;
//     visite_technique: string;
//     fin_visite_technique: string;
//     carte_grise: string;
//     fin_carte_grise: string;
//     extincteur: boolean;
//     fin_extincteur: string;
// };

export type Camion = {
  id_camion: number;
  matricule: string;
  modele: string;
  assurance: string;
  fin_validite_assurance: string;
  visite_technique: string;
  fin_visite_technique: string;
  carte_grise: string;
  fin_carte_grise: string;
  extincteur: boolean;
  fin_extincteur: string;

  chauffeur_camion?: {
    chauffeur?: {
      id_chauffeur: number;
      num_permis: string;
      disponibilite: boolean;
      utilisateur?: {
        nom: string;
        prenom: string;
      };
    };
  }[];
};
