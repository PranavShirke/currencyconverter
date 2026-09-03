import { z } from 'zod';
import { currencyCodeSchema, positiveAmountSchema } from './common.js';

export const convertSchema = z
  .object({
    amount: positiveAmountSchema,
    from: currencyCodeSchema,
    to: currencyCodeSchema
  })
  .refine((value) => value.from !== value.to, {
    message: 'From and to currencies must be different',
    path: ['to']
  });

export const travelBudgetSchema = z.object({
  amount: positiveAmountSchema,
  baseCurrency: currencyCodeSchema
});
