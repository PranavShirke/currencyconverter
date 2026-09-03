import { z } from 'zod';
import { currencyCodeSchema } from './common.js';

export const trendSchema = z
  .object({
    base: currencyCodeSchema,
    target: currencyCodeSchema,
    days: z.coerce
      .number()
      .int('Days must be a whole number')
      .min(2, 'Trend must be at least 2 days')
      .max(90, 'Trend cannot exceed 90 days')
      .default(30)
  })
  .refine((value) => value.base !== value.target, {
    message: 'Base and target currencies must be different',
    path: ['target']
  });
