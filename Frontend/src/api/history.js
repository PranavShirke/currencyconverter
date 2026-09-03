import { apiClient } from './client.js';

export async function fetchHistory(limit = 10) {
  const response = await apiClient.get('/history', {
    params: { limit }
  });
  return response.data;
}
