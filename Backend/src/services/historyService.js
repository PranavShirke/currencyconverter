import { listHistory } from '../repositories/historyRepository.js';

export function getHistory(userId, limit) {
  return listHistory(userId, limit);
}
