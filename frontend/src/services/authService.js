import { apiRequest } from './api';

export const authService = {
  /**
   * Register a new user account.
   * @param {Object} userData - { name, email, password, profile_photo_url }
   */
  async register(userData) {
    const data = await apiRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  /**
   * Login with email and password.
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const data = await apiRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }
    return data;
  },

  /**
   * Fetch currently authenticated user profile.
   */
  async getCurrentUser() {
    const user = await apiRequest('/api/v1/users/me', {
      method: 'GET',
    });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  },

  /**
   * Clear authentication state and token.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get cached user profile.
   */
  getCachedUser() {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  },

  /**
   * Check if token exists in storage.
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;
