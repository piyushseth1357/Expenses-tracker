import axios from 'axios';

// Flexibly read any environment key variation (VITEAPI, VITE_API_BASE_URL, VITE_API_URL, VITE_BACKEND_URL)
const envURL = import.meta.env.VITE_API_BASE_URL ||
               import.meta.env.VITEAPI ||
               import.meta.env.VITE_API_URL ||
               import.meta.env.VITE_BACKEND_URL ||
               '/api';

let baseURL = envURL.trim();

// Ensure /api is appended if raw domain like https://backend.onrender.com was entered
if (baseURL.startsWith('http')) {
  // Strip trailing slashes
  baseURL = baseURL.replace(/\/+$/, '');
  if (!baseURL.endsWith('/api')) {
    baseURL = baseURL + '/api';
  }
}

const API = axios.create({
  baseURL
});

// Interceptor to attach JWT Token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle unauthorized / expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
