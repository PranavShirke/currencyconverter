import { apiClient } from './client.js';

export async function fetchTrend({ base, target, days = 30 }) {
  const response = await apiClient.get('/rates/trend', {
    params: { base, target, days }
  });
  return response.data;
}
