const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '').endsWith('/api/v1')
  ? RAW_BASE_URL.replace(/\/+$/, '')
  : `${RAW_BASE_URL.replace(/\/+$/, '')}/api/v1`;

/**
 * Centralized API client for GlobeTrotter backend calls.
 */
export async function apiRequest(endpoint, options = {}) {
  let cleanEndpoint = endpoint;
  if (cleanEndpoint.startsWith('/api/v1/')) {
    cleanEndpoint = cleanEndpoint.substring(8);
  } else if (cleanEndpoint.startsWith('api/v1/')) {
    cleanEndpoint = cleanEndpoint.substring(7);
  }

  if (!cleanEndpoint.startsWith('/')) {
    cleanEndpoint = '/' + cleanEndpoint;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;

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
