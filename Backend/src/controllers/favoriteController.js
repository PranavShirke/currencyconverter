import { createFavorite, getFavorites, removeFavorite } from '../services/favoriteService.js';

export async function listFavoritesController(req, res, next) {
  try {
    res.json(await getFavorites(req.userId));
  } catch (error) {
    next(error);
  }
}

export function addFavoriteController(req, res) {
  const favorite = createFavorite({ userId: req.userId, ...req.body });
  res.status(201).json(favorite);
}

export function deleteFavoriteController(req, res, next) {
  try {
    removeFavorite({ userId: req.userId, favoriteId: req.validatedParams.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
