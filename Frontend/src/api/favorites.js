import { apiClient } from './client.js';

export async function fetchFavorites() {
  const response = await apiClient.get('/favorites');
  return response.data;
}

export async function saveFavorite(payload) {
  const response = await apiClient.post('/favorites', payload);
  return response.data;
}

export async function deleteFavorite(id) {
  await apiClient.delete(`/favorites/${id}`);
}
