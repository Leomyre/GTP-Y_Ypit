import axios from "axios";
import { UrlConfig } from "@/utils/Config";
import {
    Reservation,
    Paiement,
    ReservationStats,
    PaginatedResponse
} from "@/types/Reservation";

const BASE_URL = `${UrlConfig.apiBaseUrl}/reservations/`;

export const ReservationService = {
    createReservation: async (
        data: {
            voyage_id: number;
            nombre_adultes: number;
            nombre_enfants: number;
            special_requests?: string;
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