import { apiClient } from './client.js';

export async function fetchCurrencies() {
  const response = await apiClient.get('/currencies');
  return response.data;
}
