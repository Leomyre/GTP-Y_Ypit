// services/service-destinations.tsx

import axios from "axios";
import { UrlConfig } from "@/utils/Config";
import { Destination } from "@/types/Destinations";

export const DestinationService = {
    getDestinations: async (): Promise<Destination[]> => {
        try {
            const response = await axios.get(`${UrlConfig.apiBaseUrl}/voyages/destinations/`);
            return response.data.results;
        } catch (error) {
            console.error("Erreur lors de la récupération des destinations :", error);
            throw error;
        }
    },

    createDestination: async (data: any, token: string) => {
        const res = await axios.post(`${UrlConfig.apiBaseUrl}/voyages/destinations/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    },

    // ✅ Récupérer une destination par ID
    getDestinationById: async (id: string, token: string): Promise<Destination> => {
        const res = await axios.get(`${UrlConfig.apiBaseUrl}/voyages/destinations/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    },

    // ✅ Mettre à jour une destination
    updateDestination: async (id: string, formData: FormData, token: string): Promise<Destination> => {
        const res = await axios.put(`${UrlConfig.apiBaseUrl}/voyages/destinations/${id}/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    // ✅ Supprimer une destination
    deleteDestination: async (id: number, token: string): Promise<void> => {
        await axios.delete(`${UrlConfig.apiBaseUrl}/voyages/destinations/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    getRevenueStats: async (): Promise<DestinationRevenueStats> => {
        try {
            const response = await axios.get(`${UrlConfig.apiBaseUrl}/voyages/destinations/revenue_stats/`);

            if (!response.data.success) {
                throw new Error(response.data.error || 'Erreur inconnue');
            }

            return {
                success: true,
                data: {
                    totalRevenue: response.data.data.total_revenue || 0,
                    byDestination: response.data.data.by_destination.map((item: any) => ({
                        id: item.id,
                        name: item.nom,
                        country: item.pays,
                        adultReservations: item.adult_reservations || 0,
                        childReservations: item.child_reservations || 0,
                        adultRevenue: item.adult_revenue || 0,
                        childRevenue: item.child_revenue || 0,
                        totalRevenue: item.total_revenue || 0
                    })),
                    byCountry: response.data.data.by_country.map((item: any) => ({
                        country: item.pays,
                        totalRevenue: item.total_revenue || 0,
                        destinationCount: item.destination_count || 0,
                        voyageCount: item.voyage_count || 0
                    })),
                    monthlyTrend: response.data.data.monthly_trend.map((item: any) => ({
                        month: item.month,
                        totalRevenue: item.total_revenue || 0,
                        reservationCount: item.reservation_count || 0
                    }))
                }
            };
        } catch (error) {
            console.error('Error fetching revenue stats:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
};

// Types TypeScript
interface DestinationRevenueStats {
    success: boolean;
    data?: {
        totalRevenue: number;
        byDestination: Array<{
            id: number;
            name: string;
            country: string;
            adultReservations: number;
            childReservations: number;
            adultRevenue: number;
            childRevenue: number;
            totalRevenue: number;
        }>;
        byCountry: Array<{
            country: string;
            totalRevenue: number;
            destinationCount: number;
            voyageCount: number;
        }>;
        monthlyTrend: Array<{
            month: string;
            totalRevenue: number;
            reservationCount: number;
        }>;
    };
    error?: string;
}

