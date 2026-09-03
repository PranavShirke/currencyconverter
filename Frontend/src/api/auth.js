import { apiClient } from './client.js';

export async function signIn(payload) {
  const response = await apiClient.post('/auth/signin', payload);
  return response.data;
}

export async function fetchMe() {
  const response = await apiClient.get('/auth/me');
  return response.data;
}
