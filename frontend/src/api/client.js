import axios from 'axios';

// Base URLs are read from Vite env vars (see .env.example). Never hardcode
// service hosts/ports here so the frontend can be deployed against any
// environment without code changes.
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8081';
const PRODUCT_BASE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8082';
const ORDER_BASE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:5001';
const CART_BASE_URL = import.meta.env.VITE_CART_SERVICE_URL || 'http://localhost:8000';

function createClient(baseURL) {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}

export const authApi = createClient(AUTH_BASE_URL);
export const productApi = createClient(PRODUCT_BASE_URL);
export const orderApi = createClient(ORDER_BASE_URL);
export const cartApi = createClient(CART_BASE_URL);
