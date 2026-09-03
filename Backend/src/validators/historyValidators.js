import { z } from 'zod';

export const historyQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit cannot exceed 50')
    .default(10)
});
