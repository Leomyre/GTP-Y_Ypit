/**
 * Types pour le système de réservations et paiements
 */

// Interface de base pour une réservation
export interface Reservation {
    id: number;
    voyage: {
        id: number;
        titre: string;
        destination_nom: string;
        prix_par_personne: number;
        reduction_enfant?: boolean;
        responsable?: {
            id: number;
            nom: string;
            prenom: string;
            email: string;
        };
    };
    utilisateur: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    };
    nombre_adultes: number;
    nombre_enfants: number;
    special_requests?: string;
    date_reservation: string;
    date_depart: string;
    est_confirmee: boolean;
    prix_total: number;
    statut: string;
    statut_paiement?: string,
    paiements?: Paiement[];
}

// Interface pour un paiement
export interface ReservationCardProps {
    reservation: {
        id: number;
        voyage: {
            id: number;
            titre: string;
            destination_nom: string;
            destination: string;
            date_depart: string;
        };
        statut: string;
        prix_total: number;
        reference?: string
    }
}
export interface Paiement {
    id: number;
    reservation: number; // ID de la réservation
    montant: number;
    methode: 'carte' | 'virement' | 'paypal' | 'especes';
    statut: 'en_attente' | 'complete' | 'rembourse' | 'echoue' | 'annule';
    reference: string;
    date_paiement: string;
    date_mise_a_jour: string;
    details?: Record<string, unknown>;
}

// Interface pour la réponse paginée
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Interface pour les statistiques de réservations
export interface ReservationStats {
    total_reservations: number;
    total_reservations_confirmees: number;
    chiffre_affaire: number;
    moyenne_par_reservation: number;
    par_voyage: Array<{
        voyage_id: number;
        voyage_titre: string;
        nb_reservations: number;
        montant_total: number;
    }>;
    periode: {
        debut: string | null;
        fin: string | null;
    };
}

// Types pour les filtres de réservation
export interface ReservationFilters {
    voyage?: number;
    utilisateur?: number;
    responsable?: number;
    est_confirmee?: boolean;
    date_min?: string;
    date_max?: string;
    page?: number;
    page_size?: number;
}

// Types pour les filtres de paiement
export interface PaiementFilters {
    reservation?: number;
    statut?: string;
    methode?: string;
    date_min?: string;
    date_max?: string;
}

// Types pour la création/modification de réservation
export interface ReservationFormData {
    voyage: number;
    nombre_adultes: number;
    nombre_enfants: number;
    special_requests?: string;
}

// Types pour la création de paiement
export interface PaiementFormData {
    reservation: number;
    montant: number;
    methode: string;
    reference: string;
    details?: object;
}

// Types d'actions pour les paiements
export type PaiementAction = 'valider' | 'demander_remboursement';