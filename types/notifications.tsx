export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    notification_type: string;
    read: boolean;
    created_at: string;
    metadata?: {
        link?: string;
        [key: string]: unknown;
    };
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface MarkAsReadResponse {
    marked: number;
    unread_count: number;
}

export type NotificationType =
    | "promotion"
    | "reservation"
    | "reminder"
    | "new_feature"
    | "info"
    | "alert";