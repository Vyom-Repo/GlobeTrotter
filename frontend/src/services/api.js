const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Centralized API client for GlobeTrotter backend calls.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.detail || `HTTP Error ${response.status}`;
      const errorObj = new Error(errorMsg);
      errorObj.status = response.status;
      errorObj.code = data?.error?.code || 'API_ERROR';
      throw errorObj;
    }

    return data !== null ? data : {};
  } catch (err) {
    if (!err.status) {
      err.message = 'Unable to connect to GlobeTrotter backend service. Please check your connection.';
      err.code = 'NETWORK_ERROR';
    }
    throw err;
  }
}

export default apiRequest;
