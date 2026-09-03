import { Router } from 'express';
import {
  addFavoriteController,
  deleteFavoriteController,
  listFavoritesController
} from '../controllers/favoriteController.js';
import { requireRegistered } from '../middleware/requireRegistered.js';
import { validate } from '../middleware/validate.js';
import { favoriteIdSchema, favoriteSchema } from '../validators/favoriteValidators.js';

const router = Router();

router.use(requireRegistered);
router.get('/', listFavoritesController);
router.post('/', validate(favoriteSchema), addFavoriteController);
router.delete('/:id', validate(favoriteIdSchema, 'params'), deleteFavoriteController);

export default router;
