import { apiRequest } from './api';

export const tripService = {
  // --- TRIPS ---
  async getTrips(page = 1, pageSize = 20) {
    return await apiRequest(`/api/v1/trips?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
    });
  },

  async getUserTrips(page = 1, pageSize = 20) {
    return await this.getTrips(page, pageSize);
  },

  async getTrip(tripId) {
    return await apiRequest(`/api/v1/trips/${tripId}`, {
      method: 'GET',
    });
  },

  async createTrip(tripData) {
    return await apiRequest('/api/v1/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  async updateTrip(tripId, tripData) {
    return await apiRequest(`/api/v1/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  },

  async deleteTrip(tripId) {
    return await apiRequest(`/api/v1/trips/${tripId}`, {
      method: 'DELETE',
    });
  },

  // --- DESTINATION STOPS ---
  async getStops(tripId) {
    return await apiRequest(`/api/v1/trips/${tripId}/stops`, {
      method: 'GET',
    });
  },

  async addStop(stopData) {
    return await apiRequest('/api/v1/trip-stops', {
      method: 'POST',
      body: JSON.stringify(stopData),
    });
  },

  async updateStop(stopId, stopData) {
    return await apiRequest(`/api/v1/trip-stops/${stopId}`, {
      method: 'PUT',
      body: JSON.stringify(stopData),
    });
  },

  async deleteStop(stopId) {
    return await apiRequest(`/api/v1/trip-stops/${stopId}`, {
      method: 'DELETE',
    });
  },

  async reorderStops(tripId, reorderItems) {
    return await apiRequest(`/api/v1/trips/${tripId}/stops/reorder`, {
      method: 'POST',
      body: JSON.stringify(reorderItems),
    });
  },

  // --- OFFLINE DISCOVERY (CITIES & ACTIVITIES) ---
  async searchCities(query = '', countryId = '', region = '', page = 1) {
    let url = `/api/v1/cities?page=${page}`;
    if (query) url += `&search=${encodeURIComponent(query)}`;
    if (countryId) url += `&country_id=${countryId}`;
    if (region) url += `&region=${encodeURIComponent(region)}`;

    return await apiRequest(url, { method: 'GET' });
  },

  async searchActivities({ cityId = '', search = '', activityType = '', maxCost = '', page = 1 }) {
    let url = `/api/v1/activities?page=${page}`;
    if (cityId) url += `&city_id=${cityId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (activityType) url += `&activity_type=${encodeURIComponent(activityType)}`;
    if (maxCost) url += `&max_cost=${maxCost}`;

    return await apiRequest(url, { method: 'GET' });
  },

  // --- ITINERARY ITEMS ---
  async getItineraryItems(stopId) {
    return await apiRequest(`/api/v1/trip-stops/${stopId}/itinerary`, {
      method: 'GET',
    });
  },

  async addItineraryItem(itemData) {
    return await apiRequest('/api/v1/itinerary', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  async updateItineraryItem(itemId, itemData) {
    return await apiRequest(`/api/v1/itinerary/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  async deleteItineraryItem(itemId) {
    return await apiRequest(`/api/v1/itinerary/${itemId}`, {
      method: 'DELETE',
    });
  },
};

export default tripService;
