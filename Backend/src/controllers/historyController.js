import { getHistory, removeAllHistory, removeHistoryEntry } from '../services/historyService.js';

export function listHistoryController(req, res) {
  res.json(getHistory(req.userId, req.validatedQuery.limit));
}

export function deleteHistoryController(req, res, next) {
  try {
    removeHistoryEntry(req.userId, req.validatedParams.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function clearHistoryController(req, res) {
  removeAllHistory(req.userId);
  res.status(204).send();
}
