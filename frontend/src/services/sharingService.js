import { apiRequest } from './api';

export const sharingService = {
  /**
   * Generate a share token for a trip (owner only).
   */
  async createShare(tripId, permission = 'view', expiresAt = null) {
    return await apiRequest(`/api/v1/trip-shares?trip_id=${tripId}`, {
      method: 'POST',
      body: JSON.stringify({
        permission,
        expires_at: expiresAt,
      }),
    });
  },

  /**
   * List active shares for a trip (owner only).
   */
  async getTripShares(tripId) {
    return await apiRequest(`/api/v1/trips/${tripId}/shares`, {
      method: 'GET',
    });
  },

  /**
   * Revoke a share token (owner only).
   */
  async revokeShare(shareId) {
    return await apiRequest(`/api/v1/trip-shares/${shareId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Resolve a share token and return trip details (public, no auth).
   */
  async getSharedTrip(token) {
    return await apiRequest(`/api/v1/trip-shares/${token}`, {
      method: 'GET',
    });
  },

  /**
   * Search and discover public trips (public, no auth).
   */
  async getPublicTrips(filters = {}) {
    let url = '/api/v1/public/trips?page=' + (filters.page || 1) + '&page_size=' + (filters.pageSize || 12);
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.cityId) url += `&city_id=${filters.cityId}`;
    if (filters.countryId) url += `&country_id=${filters.countryId}`;

    return await apiRequest(url, {
      method: 'GET',
    });
  },

  /**
   * Get public trip detail by trip ID (public, no auth).
   */
  async getPublicTripDetail(tripId) {
    return await apiRequest(`/api/v1/public/trips/${tripId}`, {
      method: 'GET',
    });
  },
};

export default sharingService;
