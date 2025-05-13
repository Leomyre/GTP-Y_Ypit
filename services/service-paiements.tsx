// services/service-paiements.ts
import axios from "axios";
import { UrlConfig } from "@/utils/Config"; // Si tu as une configuration d'URL

const BASE_URL = `${UrlConfig.apiBaseUrl}/reservations/paiements`;

const PaiementService = {
    // Créer un paiement pour une réservation
    createPaiement: async (data: {
        reservation: number;
        montant: number;
        methode: string;
        statut: string;
        details: {
            numeroCarte: string;
            nomCarte: string;
            dateExpiration: string;
            cvc: string;
        };
    }, token: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création du paiement:", error);
            throw error;
        }
    },

    // Récupérer les paiements par réservation
    getPaiementsByReservation: async (reservationId: number, token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/?reservation=${reservationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des paiements:", error);
            throw error;
        }
    }
};

export default PaiementService;
