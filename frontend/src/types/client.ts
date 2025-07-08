export type Client = {
    id_client: number;
    id_utilisateur: number;
    entreprise: string;
    adresse: string;
    telephone: string;
};

export type ClientUtilisateur = {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  mail: string;
  role: string;
  carte_national?: string;
  date_creation?: string;
  token?: string | null;
};

export type ClientApiResponse = Client & {
  utilisateur: ClientUtilisateur;
};