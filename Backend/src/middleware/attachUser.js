import { z } from 'zod';
import { ensureUser } from '../repositories/usersRepository.js';
import { AppError } from '../utils/errors.js';

const userIdSchema = z.string().uuid();

export function attachUser(req, _res, next) {
  try {
    const rawUserId = req.get('X-User-Id');
    const userId = userIdSchema.parse(rawUserId);
    const user = ensureUser(userId);

    req.userId = userId;
    req.user = user;
    next();
  } catch {
    next(new AppError(400, 'A valid X-User-Id header is required'));
  }
}
