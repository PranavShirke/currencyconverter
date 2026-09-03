import { AppError } from '../utils/errors.js';

export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      next(new AppError(400, firstIssue?.message || 'Invalid request'));
      return;
    }

    if (source === 'body') {
      req.body = result.data;
    }

    if (source === 'query') {
      req.validatedQuery = result.data;
    }

    if (source === 'params') {
      req.validatedParams = result.data;
    }

    next();
  };
}
