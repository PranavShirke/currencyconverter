import db from '../db/database.js';

const findByIdStatement = db.prepare('SELECT id, name, is_registered AS isRegistered, created_at AS createdAt FROM users WHERE id = ?');
const insertStatement = db.prepare('INSERT OR IGNORE INTO users (id) VALUES (?)');
const signInStatement = db.prepare('UPDATE users SET name = ?, is_registered = 1 WHERE id = ?');

export function findUserById(userId) {
  const user = findByIdStatement.get(userId);
  return user ? { ...user, isRegistered: Boolean(user.isRegistered) } : null;
}

export function ensureUser(userId) {
  insertStatement.run(userId);
  return findUserById(userId);
}

export function signInUser(userId, name) {
  signInStatement.run(name, userId);
  return findUserById(userId);
}
