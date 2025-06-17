export type Historique_suivi = {
    id_historique: number;
    id_livraison: number;
    statut: string;
    localisation: string;
    date_maj: Date;
    commentaire: string;
};