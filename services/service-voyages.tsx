import axios from 'axios';
import { UrlConfig } from '@/utils/Config';
import { CreateVoyage } from '@/types/voyages';
import { ProgrammeJour } from '@/types/ProgrammeJour';

const BASE_URL = `${UrlConfig.apiBaseUrl}/voyages`;

export const VoyageService = {

    // Récupère tous les jours du programme d’un voyage
    getProgrammeVoyage: async (voyageId: number) => {
        try {
            const response = await axios.get(`${BASE_URL}/voyages/${voyageId}/programmes/`);
            return response.data; // Supposé être un tableau
        } catch (error) {
            console.error(`Erreur lors de la récupération du programme pour le voyage ${voyageId} :`, error);
            throw error;
        }
    },

    // Récupère un jour spécifique du programme d’un voyage
    getProgrammeJour: async (voyageId: number, jourId: number) => {
        try {
            const response = await axios.get(`${BASE_URL}/voyages/${voyageId}/programmes/${jourId}/`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du jour ${jourId} du programme pour le voyage ${voyageId} :`, error);
            throw error;
        }
    },

    createProgrammeJour: async (voyageId: number, data: ProgrammeJour, token: string) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/voyages/${voyageId}/programmes/`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log(response.data);

            return response.data;
        }
        catch (error) {
            console.error(`Erreur lors de la création du jour du programme :`, error);
            throw error;
        }
    },

    // Mise à jour d’un jour du programme
    updateProgrammeJour: async (voyageId: number, jourId: number, data: ProgrammeJour, token: string) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/voyages/${voyageId}/programmes/${jourId}/`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du jour ${jourId} du programme :`, error);
            throw error;
        }
    },

    // Mise à jour du service pour récupérer les voyages
    getVoyages: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/voyages/`);

            // Vérifier si la réponse est bien un tableau
            if (Array.isArray(response.data.results)) {
                return response.data.results; // Si c'est un tableau, on le retourne
            } else {
                console.error('Réponse invalide : Les données des voyages ne sont pas un tableau', response.data);
                return []; // Retourner un tableau vide si ce n'est pas un tableau
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des voyages :', error);
            return [];  // Retourner un tableau vide en cas d'erreur
        }
    },


    // Create a new voyage
    createVoyage: async (formData: FormData, token: string) => {
        console.log(formData);

        try {
            const response = await axios.post(`${BASE_URL}/voyages/`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating voyage:', error);
            throw error;
        }
    },

    // Fetch details of a specific voyage by ID
    getVoyageDetails: async (id: number) => {
        try {
            const response = await axios.get(`${BASE_URL}/voyages/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching voyage details for ID ${id}:`, error);
            throw error;
        }
    },

    updateVoyage: async (id: number, voyageData: Partial<CreateVoyage>, token: string) => {
        try {
            const response = await axios.put(`${BASE_URL}/voyages/${id}/`, voyageData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du voyage ${id} :`, error);
            throw error;
        }
    },

    enregistrerConsultation: async (voyageId: number, token: string) => {
        try {
            const response = await axios.post(
                `${UrlConfig.apiBaseUrl}/voyages/consultations/`,
                { voyage: voyageId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l’enregistrement du voyage consulté :', error);
            throw error;
        }
    },

    getConsultation: async (token: string) => {
        try {
            const response = await axios.get(
                `${UrlConfig.apiBaseUrl}/voyages/consultations/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la recuperation des voyages consulté :', error);
            throw error;
        }
    },

    // Fetch the list of popular voyages
    getPopularVoyages: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/populaires/`);
            return response.data.results;
        } catch (error) {
            console.error('Error fetching popular voyages:', error);
            throw error;
        }
    },

    // Fetch the list of recommandes voyages
    getRecommandesVoyages: async (token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/recommandes/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);

            return response.data;
        } catch (error) {
            console.error('Error fetching recommandes voyages:', error);
            throw error;
        }
    },

    // Fetch the list of available voyages
    getAvailableVoyages: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/disponibles/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching available voyages:', error);
            throw error;
        }
    },

};

export default VoyageService;