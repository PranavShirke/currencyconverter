import { findUserById } from '../repositories/usersRepository.js';
import { AppError } from '../utils/errors.js';

export function requireRegistered(req, _res, next) {
  const user = findUserById(req.userId);

  if (!user?.isRegistered) {
    next(new AppError(401, 'Sign in with a display name to use favorites'));
    return;
  }

  req.user = user;
  next();
}
