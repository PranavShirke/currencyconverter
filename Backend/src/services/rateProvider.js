import { getCachedRate, saveCachedRate } from '../repositories/rateCacheRepository.js';
import { AppError } from '../utils/errors.js';

const CACHE_TTL_MS = 10 * 60 * 1000;
const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6';
const EXCHANGE_RATE_FALLBACK_URL = 'https://open.er-api.com/v6/latest';
const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v1';

function isFresh(cacheEntry) {
  if (!cacheEntry) {
    return false;
  }

  const fetchedAt = new Date(cacheEntry.fetchedAt).getTime();
  return Number.isFinite(fetchedAt) && Date.now() - fetchedAt < CACHE_TTL_MS;
}

function roundRate(rate) {
  return Number(Number(rate).toPrecision(12));
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Rate provider returned ${response.status}`);
  }

  return response.json();
}

async function fetchLatestFromPrimary(baseCurrency, targetCurrency) {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    throw new Error('EXCHANGE_RATE_API_KEY is not configured');
  }

  const data = await fetchJson(`${EXCHANGE_RATE_BASE_URL}/${apiKey}/latest/${baseCurrency}`);
  const rate = data?.conversion_rates?.[targetCurrency];

  if (typeof rate !== 'number') {
    throw new Error('Primary provider response did not include the requested rate');
  }

  return rate;
}

async function fetchLatestFromFallback(baseCurrency, targetCurrency) {
  const data = await fetchJson(`${EXCHANGE_RATE_FALLBACK_URL}/${baseCurrency}`);
  const rate = data?.rates?.[targetCurrency];

  if (typeof rate !== 'number') {
    throw new Error('Fallback provider response did not include the requested rate');
  }

  return rate;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export async function getLatestRate(baseCurrency, targetCurrency) {
  if (baseCurrency === targetCurrency) {
    return 1;
  }

  const cachedRate = getCachedRate(baseCurrency, targetCurrency);
  if (isFresh(cachedRate)) {
    return cachedRate.rate;
  }

  let rate;
  try {
    rate = await fetchLatestFromPrimary(baseCurrency, targetCurrency);
  } catch {
    try {
      rate = await fetchLatestFromFallback(baseCurrency, targetCurrency);
    } catch {
      throw new AppError(502, 'Latest exchange rate data is unavailable right now');
    }
  }

  const roundedRate = roundRate(rate);
  saveCachedRate(baseCurrency, targetCurrency, roundedRate);
  return roundedRate;
}

export async function getTimeSeries(baseCurrency, targetCurrency, days) {
  if (baseCurrency === targetCurrency) {
    throw new AppError(400, 'Base and target currencies must be different');
  }

  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - Math.max(days - 1, 1));

  const url = `${FRANKFURTER_BASE_URL}/${formatDate(start)}..${formatDate(end)}?base=${baseCurrency}&symbols=${targetCurrency}`;
  let data;
  try {
    data = await fetchJson(url);
  } catch {
    throw new AppError(502, 'Historical exchange rate data is unavailable right now');
  }
  const rates = data?.rates || {};

  return Object.entries(rates)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, values]) => ({
      date,
      rate: roundRate(values[targetCurrency])
    }))
    .filter((entry) => Number.isFinite(entry.rate));
}
