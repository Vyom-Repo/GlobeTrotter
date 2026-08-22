import { apiRequest } from './api';

export const searchService = {
  /**
   * Perform unified search across countries, cities, activities, and public trips.
   */
  async search(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/api/v1/search?${query}`, { method: 'GET' });
  },

  /**
   * Fetch personalized recommendations for the authenticated user.
   */
  async getRecommendations(type = 'all', limit = 20) {
    return await apiRequest(`/api/v1/recommendations?type=${type}&limit=${limit}`, { method: 'GET' });
  },

  /**
   * Related discovery endpoints.
   */
  async getRelatedCities(cityId) {
    return await apiRequest(`/api/v1/cities/${cityId}/related`, { method: 'GET' });
  },

  async getRelatedActivities(activityId) {
    return await apiRequest(`/api/v1/activities/${activityId}/related`, { method: 'GET' });
  },

  async getRelatedTrips(tripId) {
    return await apiRequest(`/api/v1/trips/${tripId}/related`, { method: 'GET' });
  },
};

export default searchService;
