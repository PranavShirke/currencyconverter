import axios from 'axios';
import { useUserStore } from '../store/useUserStore.js';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 12_000
});

apiClient.interceptors.request.use((config) => {
  config.headers['X-User-Id'] = useUserStore.getState().userId;
  return config;
});

export function getApiError(error, fallback = 'Something went wrong') {
  return error?.response?.data?.error || error?.message || fallback;
}
