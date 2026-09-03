import { Router } from 'express';
import { convert, travelBudget } from '../controllers/convertController.js';
import { validate } from '../middleware/validate.js';
import { convertSchema, travelBudgetSchema } from '../validators/convertValidators.js';

const router = Router();

router.post('/', validate(convertSchema), convert);
router.post('/travel-budget', validate(travelBudgetSchema), travelBudget);

export default router;
