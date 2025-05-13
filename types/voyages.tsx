import { ProgrammeJour } from "./ProgrammeJour";

export interface Voyage {
    id: number;
    titre: string;
    prix: string;
    agence_nom: string;
    images?: string;
    description?: string;
    likes?: number;
    ville_depart: string;
    niveau_confort: number;
    destination_nom: string;
    programmes_jour: ProgrammeJour[];
    is_responsable: boolean;
    date_consultation: string;
}
export interface CreateVoyage {
    titre: string;
    prix: string;
    image?: string;
    description?: string;
    ville_depart: string;
    niveau_confort: number;
}

export interface UpdateVoyage {
    titre: string;
    prix: string;
    image?: string;
    description?: string;
    ville_depart: string;
    niveau_confort: number;
    destination_id: number;
}
export interface VoyageWithStats extends Voyage {
    nb_reservations: number;
    reservations_confirmees: number;
    chiffre_affaire: number;
}

export interface VoyageReservation {
    id: number;
    utilisateur: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    };
    date_reservation: string;
    prix_total: number;
    statut: 'en_attente' | 'confirmee' | 'annulee';
}