import { Router } from 'express';
import {
  clearHistoryController,
  deleteHistoryController,
  listHistoryController
} from '../controllers/historyController.js';
import { validate } from '../middleware/validate.js';
import { historyIdSchema, historyQuerySchema } from '../validators/historyValidators.js';

const router = Router();

router.get('/', validate(historyQuerySchema, 'query'), listHistoryController);
router.delete('/', clearHistoryController);
router.delete('/:id', validate(historyIdSchema, 'params'), deleteHistoryController);

export default router;
