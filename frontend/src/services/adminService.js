import { apiRequest } from './api';

export const adminService = {
  /**
   * List system users for administration.
   */
  async listUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/api/v1/admin/users?${query}`, { method: 'GET' });
  },

  /**
   * Deactivate a user account.
   */
  async deactivateUser(userId) {
    return await apiRequest(`/api/v1/admin/users/${userId}/deactivate`, { method: 'POST' });
  },

  /**
   * Reactivate a user account.
   */
  async reactivateUser(userId) {
    return await apiRequest(`/api/v1/admin/users/${userId}/reactivate`, { method: 'POST' });
  },

  /**
   * List public trips for moderation.
   */
  async listPublicTrips(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/api/v1/admin/public-trips?${query}`, { method: 'GET' });
  },

  /**
   * Unpublish a public trip.
   */
  async unpublishTrip(tripId) {
    return await apiRequest(`/api/v1/admin/public-trips/${tripId}/unpublish`, { method: 'POST' });
  },

  /**
   * Publish a public trip.
   */
  async publishTrip(tripId) {
    return await apiRequest(`/api/v1/admin/public-trips/${tripId}/publish`, { method: 'POST' });
  },

  /**
   * List reported items.
   */
  async listReports(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/api/v1/admin/reports?${query}`, { method: 'GET' });
  },

  /**
   * Resolve a report.
   */
  async resolveReport(reportId, resolveData) {
    return await apiRequest(`/api/v1/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(resolveData),
    });
  },

  /**
   * Submit a report (for regular users).
   */
  async submitReport(reportData) {
    return await apiRequest('/api/v1/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  /**
   * Get system statistics.
   */
  async getStats() {
    return await apiRequest('/api/v1/admin/stats', { method: 'GET' });
  },
};

export default adminService;
