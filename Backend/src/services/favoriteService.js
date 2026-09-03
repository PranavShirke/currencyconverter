import { addFavorite, deleteFavorite, listFavorites } from '../repositories/favoritesRepository.js';
import { getLatestRate } from './rateProvider.js';
import { AppError } from '../utils/errors.js';

export async function getFavorites(userId) {
  const favorites = listFavorites(userId);

  return Promise.all(
    favorites.map(async (favorite) => {
      const rate = await getLatestRate(favorite.base, favorite.target);

      return {
        ...favorite,
        amount: 1,
        convertedAmount: rate,
        rate
      };
    })
  );
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
