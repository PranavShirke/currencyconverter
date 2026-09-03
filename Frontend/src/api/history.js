import { apiClient } from './client.js';

export async function fetchHistory(limit = 10) {
  const response = await apiClient.get('/history', {
    params: { limit }
  });
  return response.data;
}

export async function deleteHistoryEntry(id) {
  await apiClient.delete(`/history/${id}`);
}

export async function clearHistory() {
  await apiClient.delete('/history');
}
