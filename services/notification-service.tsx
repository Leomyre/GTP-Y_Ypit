import axios from "axios";
import { UrlConfig } from "@/utils/Config"; // Base API URL

const BASE_URL = `${UrlConfig.apiBaseUrl}/notifications/`;

const NotificationService = {
    /**
     * Récupère toutes les notifications d'un utilisateur
     * @param token JWT token d'authentification
     * @param params Paramètres optionnels (limit, offset, etc.)
     */
    getNotifications: async (token: string, params = {}) => {
        try {
            const response = await axios.get(`${BASE_URL}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des notifications:", error);
            throw error;
        }
    },

    /**
     * Récupère le nombre de notifications non lues
     * @param token JWT token d'authentification
     */
    getUnreadCount: async (token: string) => {
        try {
            const response = await axios.get(`${BASE_URL}unread-count/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération du compteur de notifications:", error);
            throw error;
        }
    },

    /**
     * Marque une notification comme lue
     * @param notificationId ID de la notification
     * @param token JWT token d'authentification
     */
    markAsRead: async (notificationId: number, token: string) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}${notificationId}/mark-as-read/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Erreur lors du marquage de la notification ${notificationId} comme lue:`, error);
            throw error;
        }
    },

    /**
     * Marque toutes les notifications comme lues
     * @param token JWT token d'authentification
     */
    markAllAsRead: async (token: string) => {
        try {
            const response = await axios.patch(
                `${BASE_URL}mark-all-as-read/`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erreur lors du marquage de toutes les notifications comme lues:", error);
            throw error;
        }
    },

    /**
     * Crée une nouvelle notification (pour usage admin)
     * @param data Données de la notification
     * @param token JWT token d'authentification
     */
    createNotification: async (data: {
        user_id: number;
        title: string;
        message: string;
        type: string;
        metadata?: object;
    }, token: string) => {
        try {
            const response = await axios.post(`${BASE_URL}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de la notification:", error);
            throw error;
        }
    },

    /**
     * Supprime une notification
     * @param notificationId ID de la notification
     * @param token JWT token d'authentification
     */
    deleteNotification: async (notificationId: number, token: string) => {
        try {
            const response = await axios.delete(`${BASE_URL}${notificationId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la notification ${notificationId}:`, error);
            throw error;
        }
    }
};

export default NotificationService;