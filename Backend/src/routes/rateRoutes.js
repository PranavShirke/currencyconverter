import { Router } from 'express';
import { getTrend } from '../controllers/rateController.js';
import { validate } from '../middleware/validate.js';
import { trendSchema } from '../validators/rateValidators.js';

const router = Router();

router.get('/trend', validate(trendSchema, 'query'), getTrend);

export default router;
