import axios from "axios";
import { UrlConfig } from "@/utils/Config";
import { Notification, PaginatedResponse, MarkAsReadResponse } from "@/types/notifications";

const BASE_URL = `${UrlConfig.apiBaseUrl}/notifications/notifications/`;

export const NotificationService = {
    async getNotifications(token: string, params?: {
        read?: boolean;
        type?: string;
        limit?: number;
        offset?: number;
    }): Promise<PaginatedResponse<Notification>> {
        try {
            // Construction des paramètres de requête
            const queryParams = new URLSearchParams();

            if (params?.read !== undefined) {
                queryParams.append("read", params.read.toString());
            }

            if (params?.type) {
                queryParams.append("type", params.type);
            }

            if (params?.limit) {
                queryParams.append("limit", params.limit.toString());
            }

            if (params?.offset) {
                queryParams.append("offset", params.offset.toString());
            }

            const response = await axios.get<PaginatedResponse<Notification>>(
                BASE_URL,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: queryParams,
                    paramsSerializer: params => params.toString() // Important pour la sérialisation
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },

    async getUnreadCount(token: string): Promise<{ count: number }> {
        try {
            const response = await axios.get<{ count: number }>(
                `${BASE_URL}unread_count/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching unread count:", error);
            throw error;
        }
    },

    async markAsRead(token: string, options: { id?: number; ids?: number[]; all?: boolean }): Promise<MarkAsReadResponse> {
        try {
            const response = await axios.patch<MarkAsReadResponse>(
                `${BASE_URL}mark_as_read/`,
                {
                    ...(options.id && { ids: [options.id] }),
                    ...(options.ids && { ids: options.ids }),
                    ...(options.all && { all: true }),
                },
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

    async markOneAsRead(token: string, notificationId: number): Promise<{ status: string; unread_count: number }> {
        try {
            const response = await axios.patch<{ status: string; unread_count: number }>(
                `${BASE_URL}${notificationId}/mark_one_as_read/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error marking notification ${notificationId} as read:`, error);
            throw error;
        }
    },

    async createNotification(token: string, data: {
        user_id: number;
        title: string;
        message: string;
        notification_type: string;
        metadata?: object;
    }): Promise<Notification> {
        try {
            const response = await axios.post<Notification>(
                BASE_URL,
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
            console.error("Error creating notification:", error);
            throw error;
        }
    },
};