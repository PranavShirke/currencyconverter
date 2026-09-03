import { AppError } from '../utils/errors.js';

export function notFoundHandler(_req, _res, next) {
  next(new AppError(404, 'Route was not found'));
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Something went wrong' : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  res.status(statusCode).json({ error: message });
}
