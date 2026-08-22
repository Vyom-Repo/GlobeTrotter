import { apiRequest } from './api';

export const notificationService = {
  /**
   * List notifications for the current authenticated user.
   */
  async getNotifications(page = 1, pageSize = 20, unreadOnly = false) {
    let url = `/api/v1/notifications?page=${page}&page_size=${pageSize}`;
    if (unreadOnly) url += '&unread_only=true';
    return await apiRequest(url, { method: 'GET' });
  },

  /**
   * Get unread notifications count.
   */
  async getUnreadCount() {
    return await apiRequest('/api/v1/notifications/unread-count', { method: 'GET' });
  },

  /**
   * Mark a specific notification as read.
   */
  async markAsRead(notificationId) {
    return await apiRequest(`/api/v1/notifications/${notificationId}/read`, { method: 'POST' });
  },

  /**
   * Mark all notifications as read.
   */
  async markAllAsRead() {
    return await apiRequest('/api/v1/notifications/read-all', { method: 'POST' });
  },
};

export default notificationService;
