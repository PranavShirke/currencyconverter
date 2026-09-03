import db from '../db/database.js';

const listStatement = db.prepare(`
  SELECT
    id,
    base_currency AS base,
    target_currency AS target,
    created_at AS createdAt
  FROM favorites
  WHERE user_id = ?
  ORDER BY datetime(created_at) DESC, id DESC
`);

const insertStatement = db.prepare(`
  INSERT OR IGNORE INTO favorites (user_id, base_currency, target_currency)
  VALUES (?, ?, ?)
`);

const findStatement = db.prepare(`
  SELECT
    id,
    base_currency AS base,
    target_currency AS target,
    created_at AS createdAt
  FROM favorites
  WHERE user_id = ? AND base_currency = ? AND target_currency = ?
`);

const deleteStatement = db.prepare('DELETE FROM favorites WHERE id = ? AND user_id = ?');

export function listFavorites(userId) {
  return listStatement.all(userId);
}

export function addFavorite(userId, base, target) {
  insertStatement.run(userId, base, target);
  return findStatement.get(userId, base, target);
}

export function deleteFavorite(id, userId) {
  const result = deleteStatement.run(id, userId);
  return result.changes > 0;
}
