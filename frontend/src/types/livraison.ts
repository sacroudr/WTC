// export type Livraison = {
//     id_livraison: number;
//     id_voyage: number;
//     statut: string;
//     date_maj: Date;
//     localisation: string;
// };

export type Suivit = {
  date: Date;
  localisation: string;
  statut: string;
};

export type Livraison = {
  id_livraison: number;
  id_voyage: number;
  statut: string;
  date_maj: Date;
  localisation: string;
  numero_voyage?: string;
  suivits?: Suivit[];
};
