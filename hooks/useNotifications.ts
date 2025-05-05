import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@/services/service-notification';
import { useAuth } from './useAuth';
import { Notification, PaginatedResponse, MarkAsReadResponse } from '@/types/notifications';

interface NotificationPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
  limit: number;
  offset: number;
}

export const useNotifications = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<NotificationPagination, 'results'>>({
    count: 0,
    next: null,
    previous: null,
    limit: 20,
    offset: 0,
  });

  const fetchNotifications = useCallback(async (params?: {
    read?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
    refresh?: boolean;
  }) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await NotificationService.getNotifications(token, {
        limit: params?.limit || pagination.limit,
        offset: params?.offset || (params?.refresh ? 0 : pagination.offset),
        ...(params?.read !== undefined && { read: params.read }),
        ...(params?.type && { type: params.type }),
      });

      setNotifications(prev => 
        params?.refresh || params?.offset === 0 
          ? response.results 
          : [...prev, ...response.results]
      );

      setPagination(prev => ({
        ...prev,
        count: response.count,
        next: response.next,
        previous: response.previous,
        offset: params?.refresh ? response.results.length : prev.offset + response.results.length,
        limit: params?.limit || prev.limit,
      }));

      // Update unread count if needed
      if (params?.refresh || params?.read === false || params?.offset === 0) {
        const countResponse = await NotificationService.getUnreadCount(token);
        setUnreadCount(countResponse.count);
      }

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, pagination.limit]);

  const markAsRead = useCallback(async (options: { id?: number; ids?: number[]; all?: boolean }): Promise<MarkAsReadResponse> => {
    if (!token) throw new Error('Authentication required');

    try {
      const response = await NotificationService.markAsRead(token, options);
      
      // Optimistic UI updates
      if (options.all) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      } else if (options.ids) {
        setNotifications(prev => 
          prev.map(n => options.ids?.includes(n.id) ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - (options.ids?.length || 0)));
      } else if (options.id) {
        setNotifications(prev => 
          prev.map(n => n.id === options.id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      return response;
    } catch (err) {
      console.error('Failed to mark as read:', err);
      await fetchNotifications({ refresh: true }); // Re-sync with server
      throw err;
    }
  }, [token, fetchNotifications]);

  const markOneAsRead = useCallback(async (notificationId: number): Promise<{ status: string; unread_count: number }> => {
    if (!token) throw new Error('Authentication required');

    try {
      const response = await NotificationService.markOneAsRead(token, notificationId);
      
      // Optimistic UI update
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(response.unread_count);

      return response;
    } catch (err) {
      console.error(`Failed to mark notification ${notificationId} as read:`, err);
      throw err;
    }
  }, [token]);

  const loadMore = useCallback(async () => {
    if (pagination.next && !loading) {
      return fetchNotifications({
        offset: pagination.offset,
        limit: pagination.limit,
      });
    }
  }, [pagination.next, pagination.offset, pagination.limit, loading, fetchNotifications]);

  useEffect(() => {
    if (token) {
      fetchNotifications({ refresh: true });
    }
  }, [token, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination: {
      hasMore: !!pagination.next,
      total: pagination.count,
      limit: pagination.limit,
      offset: pagination.offset,
    },
    fetchNotifications,
    markAsRead,
    markOneAsRead,
    loadMore,
    refresh: () => fetchNotifications({ refresh: true }),
  };
};

export type UseNotificationsReturn = ReturnType<typeof useNotifications>;