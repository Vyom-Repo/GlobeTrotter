import { apiRequest } from './api';

const savedDestinationService = {
  async listSavedDestinations(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/saved-destinations?${query}`);
    return res;
  },

  async saveDestination(payload) {
    const res = await apiRequest('/saved-destinations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res;
  },

  async checkSavedState(entityType, entityId) {
    const res = await apiRequest(`/saved-destinations/check?entity_type=${entityType}&entity_id=${entityId}`);
    return res;
  },

  async removeSavedDestination(savedId) {
    const res = await apiRequest(`/saved-destinations/${savedId}`, {
      method: 'DELETE',
    });
    return res;
  },
};

export default savedDestinationService;
