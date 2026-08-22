import { apiRequest } from './api';

export const userService = {
  /**
   * Fetch currently authenticated user profile from backend API.
   */
  async getCurrentUser() {
    const res = await apiRequest('/api/v1/users/me', {
      method: 'GET',
    });
    const user = res.data || res;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  /**
   * Update profile details for the authenticated user.
   * @param {Object} profileData - { name, email, phone, city, country, avatar_url }
   */
  async updateProfile(profileData) {
    const res = await apiRequest('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    const updatedUser = res.data || res;
    if (updatedUser) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return updatedUser;
  },
};

export default userService;
