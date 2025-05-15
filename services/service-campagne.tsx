// services/relances-clients/RelanceService.ts
import axios from 'axios';
import { UrlConfig } from '@/utils/Config';
import { ModeleEmail, NewCampagne } from '@/types/Campagnes';

const BASE_URL = `${UrlConfig.apiBaseUrl}/campagnes`;

export const RelanceService = {
    // Récupère toutes les campagnes
    getCampagnes: async (token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/campagnes/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.results || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des campagnes:', error);
            throw error;
        }
    },

    // Récupère une campagne spécifique
    getCampagne: async (id: number, token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/campagnes/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la campagne ${id}:`, error);
            throw error;
        }
    },

    // Crée une nouvelle campagne
    createCampagne: async (data: NewCampagne, token: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/campagnes/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la campagne:', error);
            throw error;
        }
    },

    // Met à jour une campagne existante
    updateCampagne: async (id: number, data: Partial<NewCampagne>, token: string) => {
        try {
            const response = await axios.put(`${BASE_URL}/campagnes/${id}/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la campagne ${id}:`, error);
            throw error;
        }
    },

    // Change le statut d'une campagne (active/inactive)
    toggleCampagneStatus: async (id: number, token: string) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/campagnes/${id}/toggle-status/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Erreur lors du changement de statut de la campagne ${id}:`, error);
            throw error;
        }
    },

    // Supprime une campagne
    deleteCampagne: async (id: number, token: string) => {
        try {
            await axios.delete(`${BASE_URL}/campagnes/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error(`Erreur lors de la suppression de la campagne ${id}:`, error);
            throw error;
        }
    },

    // Récupère tous les modèles d'email
    getModeles: async (token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/modeles/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.results || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des modèles:', error);
            throw error;
        }
    },

    // Récupère un modèle spécifique
    getModele: async (id: number, token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/modeles/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du modèle ${id}:`, error);
            throw error;
        }
    },

    // Crée un nouveau modèle
    createModele: async (data: Omit<ModeleEmail, 'id'>, token: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/modeles/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du modèle:', error);
            throw error;
        }
    },

    // Met à jour un modèle existant
    updateModele: async (id: number, data: Partial<ModeleEmail>, token: string) => {
        try {
            const response = await axios.put(`${BASE_URL}/modeles/${id}/`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du modèle ${id}:`, error);
            throw error;
        }
    },

    // Supprime un modèle
    deleteModele: async (id: number, token: string) => {
        try {
            await axios.delete(`${BASE_URL}/modeles/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error(`Erreur lors de la suppression du modèle ${id}:`, error);
            throw error;
        }
    },

    // Récupère les statistiques des campagnes
    getStats: async (token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/statistiques/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    },

    // Teste l'envoi d'une campagne
    testCampagne: async (id: number, emails: string[], token: string) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/campagnes/${id}/test/`,
                { emails },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Erreur lors du test de la campagne ${id}:`, error);
            throw error;
        }
    }
};

export default RelanceService;