import { clearHistory, deleteHistoryEntry, listHistory } from '../repositories/historyRepository.js';
import { AppError } from '../utils/errors.js';

export function getHistory(userId, limit) {
  return listHistory(userId, limit);
}

export function removeHistoryEntry(userId, historyId) {
  const removed = deleteHistoryEntry(historyId, userId);

  if (!removed) {
    throw new AppError(404, 'History entry was not found');
  }
}

export function removeAllHistory(userId) {
  clearHistory(userId);
}
