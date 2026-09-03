import { z } from 'zod';
import { pairSchema } from './common.js';

export const favoriteSchema = pairSchema;

export const favoriteIdSchema = z.object({
  id: z.coerce.number().int().positive('Favorite id must be valid')
});
