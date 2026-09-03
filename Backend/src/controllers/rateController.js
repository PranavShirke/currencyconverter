import { getTimeSeries } from '../services/rateProvider.js';

export async function getTrend(req, res, next) {
  try {
    const { base, target, days } = req.validatedQuery;
    const trend = await getTimeSeries(base, target, days);
    res.json(trend);
  } catch (error) {
    next(error);
  }
}
