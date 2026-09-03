import { getHistory } from '../services/historyService.js';

export function listHistoryController(req, res) {
  res.json(getHistory(req.userId, req.validatedQuery.limit));
}
