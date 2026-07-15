import axios from 'axios';

function createClient(baseURL) {
  const client = axios.create({
    baseURL,
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return client;
}

// Requests go to the frontend Nginx.
// Nginx will proxy these to the respective Kubernetes services.

const AUTH_BASE_URL = "http://192.168.49.2:32081/api/auth";
const PRODUCT_BASE_URL = "http://192.168.49.2:32082/api/products";
const CART_BASE_URL = "http://192.168.49.2:32083/api/cart";
const ORDER_BASE_URL = "http://192.168.49.2:32084/api/orders";

export const authApi = createClient(AUTH_BASE_URL);
export const productApi = createClient(PRODUCT_BASE_URL);
export const cartApi = createClient(CART_BASE_URL);
export const orderApi = createClient(ORDER_BASE_URL);