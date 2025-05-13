import axios from "axios";
import { UrlConfig } from "@/utils/Config";
import {
    Reservation,
    Paiement,
    ReservationStats,
    PaginatedResponse,

} from "@/types/Reservation";
import { Client } from "@/types/users";

const BASE_URL = `${UrlConfig.apiBaseUrl}/reservations/`;

export const ReservationService = {
    createReservation: async (
        data: {
            voyage_id: number;
            nombre_adultes: number;
            nombre_enfants: number;
            date_depart?: string;
        },
        token: string
    ): Promise<Reservation> => {
        const response = await axios.post<Reservation>(`${BASE_URL}reservations/`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Récupérer toutes les réservations de l'utilisateur connecté
    getReservations: async (token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}reservations/`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajout du token dans les en-têtes
                },
            });
            console.log("Reservations response:", response.data);

            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des réservations:", error);
            throw error;
        }
    },

    getAll: async (
        token: string,
        params?: {
            voyage?: number;
            responsable?: number;
            est_confirmee?: boolean;
            date_min?: string;
            date_max?: string;
            page?: number;
        }
    ): Promise<PaginatedResponse<Reservation>> => {
        const response = await axios.get<PaginatedResponse<Reservation>>(`${BASE_URL}reservations/`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                ...params,
                date_reservation__gte: params?.date_min,
                date_reservation__lte: params?.date_max,
            }
        });
        console.log("Reservations response:", response.data);

        return response.data;
    },

    /**
     * Vérifie l'état de réservation pour un voyage
     * Retourne:
     * - status: 'nouvelle_reservation' | 'paiement_requis' | 'deja_reserve'
     * - message: string descriptif
     * - reservation_id?: number (si réservation existe)
     * - montant_restant?: number (si paiement requis)
     */
    verifierReservation: async (
        voyageId: number,
        token: string
    ): Promise<{
        status: 'nouvelle_reservation' | 'paiement_requis' | 'deja_reserve';
        message: string;
        reservation_id?: number;
        montant_restant?: number;
    }> => {
        try {
            const response = await axios.post(
                `${BASE_URL}verifier-reservation/`,
                { voyage: voyageId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la vérification de réservation:", error);
            throw error;
        }
    },


    getMyVoyages: async (token: string): Promise<VoyageWithStats[]> => {
        try {
            const response = await axios.get(`${BASE_URL}mes-voyages/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Voyages responsibles:", response.data);

            return response.data;
        } catch (error) {
            console.error("Error fetching responsible voyages:", error);
            throw error;
        }
    },

    /**
     * Récupère les réservations pour un voyage spécifique
     */
    getVoyageReservations: async (voyageId: number, token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}${voyageId}/reservations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching reservations for voyage ${voyageId}:`, error);
            throw error;
        }
    },

    getClients: async (
        token: string,
        params?: {
            min_reservations?: number;
            min_amount?: number;
            date_min?: string;
            date_max?: string;
            page?: number;
        }
    ): Promise<Client> => {
        try {
            const response = await axios.get<Client>(`${BASE_URL}clients/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    ...params,
                    date_reservation__gte: params?.date_min,
                    date_reservation__lte: params?.date_max,
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching clients:", error);
            throw error;
        }
    },

    getReservationsDistribution: async (
        token: string,
        params?: {
            date_min?: string;
            date_max?: string;
        }
    ): Promise<{ username: string, count: number }[]> => {
        try {
            const response = await axios.get(`${BASE_URL}clients/distribution/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    ...params,
                    date_reservation__gte: params?.date_min,
                    date_reservation__lte: params?.date_max,
                }
            });
            console.log(response.data);

            return response.data;
        } catch (error) {
            console.error("Error fetching reservations distribution:", error);
            throw error;
        }
    },

    getStats: async (
        token: string,
        params?: {
            responsable?: number;
            date_min?: string;
            date_max?: string;
        }
    ): Promise<ReservationStats> => {
        const response = await axios.get<ReservationStats>(`${BASE_URL}reservations/stats/`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                ...params,
                date_reservation__gte: params?.date_min,
                date_reservation__lte: params?.date_max,
            }
        });
        console.log("Reservation stats response:", response.data);

        return response.data;
    },

    paiements: {
        create: async (
            data: {
                reservation: number;
                montant: number;
                methode: string;
                reference: string;
            },
            token: string
        ): Promise<Paiement> => {
            const response = await axios.post<Paiement>(`${BASE_URL}paiements/`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        }
    }
};