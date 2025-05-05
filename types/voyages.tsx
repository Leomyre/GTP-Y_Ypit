import { ProgrammeJour } from "./ProgrammeJour";

export interface Voyage {
    id: number;
    titre: string;
    prix: string; // Note: c'est une string dans le JSON, pas un number
    agence_nom: string; // Dans le JSON c'est juste l'ID, pas un objet complet
    images?: string; // Rendre optionnel si pas toujours présent
    description?: string; // Rendre optionnel si pas toujours présent
    likes?: number; // Rendre optionnel si pas toujours présent
    ville_depart: string;
    niveau_confort: number;
    destination_nom: string;
    programmes_jour: ProgrammeJour[]; // Liste des programmes de chaque jour
    is_responsable: boolean; // Indique si l'utilisateur est responsable
}
export interface CreateVoyage {
    titre: string;
    prix: string; // Note: c'est une string dans le JSON, pas un number // Dans le JSON c'est juste l'ID, pas un objet complet
    image?: string; // Rendre optionnel si pas toujours présent
    description?: string; // Rendre optionnel si pas toujours présent
    ville_depart: string;
    niveau_confort: number;
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