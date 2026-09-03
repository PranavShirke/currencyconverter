import { buildTravelBudget, convertCurrency } from '../services/convertService.js';

export async function convert(req, res, next) {
  try {
    const result = await convertCurrency({ userId: req.userId, ...req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function travelBudget(req, res, next) {
  try {
    const result = await buildTravelBudget(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
