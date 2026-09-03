import { z } from 'zod';
import { isSupportedCurrency, normalizeCurrencyCode } from '../data/currencies.js';

export const currencyCodeSchema = z
  .string()
  .transform(normalizeCurrencyCode)
  .refine(isSupportedCurrency, 'Currency is not supported');

export const positiveAmountSchema = z.coerce
  .number({ invalid_type_error: 'Amount must be a number' })
  .finite('Amount must be a valid number')
  .positive('Amount must be greater than 0');

export const pairSchema = z
  .object({
    base: currencyCodeSchema,
    target: currencyCodeSchema
  })
  .refine((value) => value.base !== value.target, {
    message: 'Base and target currencies must be different',
    path: ['target']
  });
