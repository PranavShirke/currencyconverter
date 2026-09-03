import { Router } from 'express';
import authRoutes from './authRoutes.js';
import convertRoutes from './convertRoutes.js';
import currencyRoutes from './currencyRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import historyRoutes from './historyRoutes.js';
import rateRoutes from './rateRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/convert', convertRoutes);
router.use('/currencies', currencyRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/history', historyRoutes);
router.use('/rates', rateRoutes);

export default router;
