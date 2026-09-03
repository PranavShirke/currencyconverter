import { Router } from 'express';
import { getMe, signInController } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { signInSchema } from '../validators/authValidators.js';

const router = Router();

router.get('/me', getMe);
router.post('/signin', validate(signInSchema), signInController);

export default router;
