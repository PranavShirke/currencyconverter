import { addFavorite, deleteFavorite, listFavorites } from '../repositories/favoritesRepository.js';
import { AppError } from '../utils/errors.js';

export function getFavorites(userId) {
  return listFavorites(userId);
}

export function createFavorite({ userId, base, target }) {
  return addFavorite(userId, base, target);
}

export function removeFavorite({ userId, favoriteId }) {
  const removed = deleteFavorite(favoriteId, userId);

  if (!removed) {
    throw new AppError(404, 'Favorite was not found');
  }
}
