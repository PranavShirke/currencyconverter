import db from '../db/database.js';

const findStatement = db.prepare(
  'SELECT base_currency AS baseCurrency, target_currency AS targetCurrency, rate, fetched_at AS fetchedAt FROM rate_cache WHERE base_currency = ? AND target_currency = ?'
);

const upsertStatement = db.prepare(`
  INSERT INTO rate_cache (base_currency, target_currency, rate, fetched_at)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(base_currency, target_currency)
  DO UPDATE SET rate = excluded.rate, fetched_at = excluded.fetched_at
`);

export function getCachedRate(baseCurrency, targetCurrency) {
  return findStatement.get(baseCurrency, targetCurrency) || null;
}

export function saveCachedRate(baseCurrency, targetCurrency, rate) {
  const fetchedAt = new Date().toISOString();
  upsertStatement.run(baseCurrency, targetCurrency, rate, fetchedAt);
  return { baseCurrency, targetCurrency, rate, fetchedAt };
}
