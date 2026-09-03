import { Router } from 'express';
import { listHistoryController } from '../controllers/historyController.js';
import { validate } from '../middleware/validate.js';
import { historyQuerySchema } from '../validators/historyValidators.js';

const router = Router();

router.get('/', validate(historyQuerySchema, 'query'), listHistoryController);

export default router;
