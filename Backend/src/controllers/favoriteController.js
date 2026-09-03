import { createFavorite, getFavorites, removeFavorite } from '../services/favoriteService.js';

export function listFavoritesController(req, res) {
  res.json(getFavorites(req.userId));
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
