import { apiClient } from './client.js';

export async function convertCurrency(payload) {
  const response = await apiClient.post('/convert', payload);
  return response.data;
}

export async function fetchTravelBudget(payload) {
  const response = await apiClient.post('/convert/travel-budget', payload);
  return response.data;
}
