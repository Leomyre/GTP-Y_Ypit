import axios from "axios";
import { UrlConfig } from "@/utils/Config";
import { Notification, PaginatedResponse, MarkAsReadResponse } from "@/types/notifications";

const BASE_URL = `${UrlConfig.apiBaseUrl}/notifications/notifications/`; // Note: J'ai retiré le doublon 'notifications/'

export const NotificationService = {
    /**
     * Récupère les notifications paginées avec filtres
     * @param token JWT token
     * @param params Paramètres de requête (read, type, limit, offset)
     */
    async getNotifications(
        token: string,
        params?: {
            read?: boolean;
            type?: string;
            limit?: number;
            offset?: number;
        }
    ): Promise<PaginatedResponse<Notification>> {
        try {
            const queryParams = {
                ...(params?.read !== undefined && { read: params.read.toString() }),
                ...(params?.type && { type: params.type }),
                ...(params?.limit && { limit: params.limit }),
                ...(params?.offset && { offset: params.offset }),
            };

            const response = await axios.get<PaginatedResponse<Notification>>(
                BASE_URL,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: queryParams,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },

    /**
     * Récupère le nombre de notifications non lues
     */
    async getUnreadCount(token: string): Promise<{ count: number }> {
        try {
            const response = await axios.get<{ count: number }>(
                `${BASE_URL}unread_count/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching unread count:", error);
            throw error;
        }
    },

    /**
     * Marque une notification comme lue
     */
    async markAsRead(
        token: string,
        options: { id?: number; ids?: number[]; all?: boolean }
    ): Promise<MarkAsReadResponse> {
        try {
            const data = {
                ...(options.id && { ids: [options.id] }),
                ...(options.ids && { ids: options.ids }),
                ...(options.all && { all: true }),
            };

            const response = await axios.patch<MarkAsReadResponse>(
                `${BASE_URL}mark_as_read/`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error marking notifications as read:", error);
            throw error;
        }
    },

    /**
     * Marque une notification spécifique comme lue
     */
    async markOneAsRead(
        token: string,
        notificationId: number
    ): Promise<{ status: string; unread_count: number }> {
        try {
            const response = await axios.patch<{ status: string; unread_count: number }>(
                `${BASE_URL}${notificationId}/mark_one_as_read/`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error marking notification ${notificationId} as read:`, error);
            throw error;
        }
    },

    /**
     * Crée une nouvelle notification (admin seulement)
     */
    async createNotification(
        token: string,
        data: {
            user_id: number;
            title: string;
            message: string;
            notification_type: string;
            metadata?: object;
        }
    ): Promise<Notification> {
        try {
            const response = await axios.post<Notification>(BASE_URL, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    },
};