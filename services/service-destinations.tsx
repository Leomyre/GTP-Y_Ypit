// services/service-destinations.tsx

import axios from "axios";
import { UrlConfig } from "@/utils/Config";
import { Destination } from "@/types/Destinations"; // Assurez-vous que le type Destination est importé

export const DestinationService = {
    getDestinations: async (): Promise<Destination[]> => { // Préciser le type de retour
        try {
            const response = await axios.get(`${UrlConfig.apiBaseUrl}/voyages/destinations/`);
            return response.data.results; // Supposons que la réponse contient un tableau de destinations
        } catch (error) {
            console.error("Erreur lors de la récupération des destinations :", error);
            throw error;
        }
    },
};
