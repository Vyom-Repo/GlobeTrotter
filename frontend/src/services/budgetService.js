import { apiRequest } from './api';

export const budgetService = {
  /**
   * Fetch aggregated budget summary for a trip.
   */
  async getBudgetSummary(tripId) {
    return await apiRequest(`/api/v1/trips/${tripId}/budget`, {
      method: 'GET',
    });
  },

  /**
   * List logged expenses for a trip with optional filters.
   */
  async getExpenses(tripId, filters = {}) {
    let url = `/api/v1/expenses?trip_id=${tripId}`;
    if (filters.category) url += `&category=${encodeURIComponent(filters.category)}`;
    if (filters.tripStopId) url += `&trip_stop_id=${filters.tripStopId}`;
    if (filters.itineraryItemId) url += `&itinerary_item_id=${filters.itineraryItemId}`;

    return await apiRequest(url, {
      method: 'GET',
    });
  },

  /**
   * Create a new expense.
   */
  async createExpense(expenseData) {
    return await apiRequest('/api/v1/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  },

  /**
   * Update an existing expense.
   */
  async updateExpense(expenseId, expenseData) {
    return await apiRequest(`/api/v1/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  },

  /**
   * Delete an expense.
   */
  async deleteExpense(expenseId) {
    return await apiRequest(`/api/v1/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  },
};

export default budgetService;
