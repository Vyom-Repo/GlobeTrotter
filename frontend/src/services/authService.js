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
    const payload = data.data || data;
    if (payload.access_token) {
      localStorage.setItem('token', payload.access_token);
      if (payload.user) {
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
    }
    return payload;
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
    const payload = data.data || data;
    if (payload.access_token) {
      localStorage.setItem('token', payload.access_token);
      if (payload.user) {
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
    }
    return payload;
  },

  /**
   * Fetch currently authenticated user profile.
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
