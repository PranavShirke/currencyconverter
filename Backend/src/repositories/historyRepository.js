import db from '../db/database.js';

const createStatement = db.prepare(`
  INSERT INTO conversion_history (
    user_id,
    base_currency,
    target_currency,
    amount,
    converted_amount,
    rate
  )
  VALUES (?, ?, ?, ?, ?, ?)
`);

const listStatement = db.prepare(`
  SELECT
    id,
    base_currency AS fromCurrency,
    target_currency AS toCurrency,
    amount,
    converted_amount AS convertedAmount,
    rate,
    created_at AS createdAt
  FROM conversion_history
  WHERE user_id = ?
  ORDER BY datetime(created_at) DESC, id DESC
  LIMIT ?
`);

const deleteStatement = db.prepare('DELETE FROM conversion_history WHERE id = ? AND user_id = ?');
const clearStatement = db.prepare('DELETE FROM conversion_history WHERE user_id = ?');

export function createHistoryEntry({ userId, from, to, amount, convertedAmount, rate }) {
  createStatement.run(userId, from, to, amount, convertedAmount, rate);
}

export function listHistory(userId, limit) {
  return listStatement.all(userId, limit);
}

export function deleteHistoryEntry(id, userId) {
  const result = deleteStatement.run(id, userId);
  return result.changes > 0;
}

export function clearHistory(userId) {
  clearStatement.run(userId);
}
