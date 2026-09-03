import { getLatestRate } from './rateProvider.js';
import { createHistoryEntry } from '../repositories/historyRepository.js';
import { AppError } from '../utils/errors.js';

const TRAVEL_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];

function roundMoney(amount) {
  return Number((Math.round((amount + Number.EPSILON) * 100) / 100).toFixed(2));
}

export async function convertCurrency({ userId, amount, from, to }) {
  const rate = await getLatestRate(from, to);
  const convertedAmount = roundMoney(amount * rate);
  const timestamp = new Date().toISOString();

  createHistoryEntry({
    userId,
    from,
    to,
    amount,
    convertedAmount,
    rate
  });

  return {
    rate,
    convertedAmount,
    from,
    to,
    amount,
    timestamp
  };
}

export async function buildTravelBudget({ amount, baseCurrency, targetCurrencies }) {
  const defaultTargets = TRAVEL_CURRENCIES.includes(baseCurrency)
    ? TRAVEL_CURRENCIES.map((currency) => (currency === baseCurrency ? 'AUD' : currency))
    : TRAVEL_CURRENCIES;

  const currenciesToConvert = targetCurrencies?.length ? targetCurrencies : defaultTargets;
  const uniqueTargets = [...new Set(currenciesToConvert)];

  if (uniqueTargets.length === 0) {
    throw new AppError(400, 'No travel budget target currencies are available');
  }

  const breakdown = await Promise.all(
    uniqueTargets.map(async (currency) => {
      const rate = await getLatestRate(baseCurrency, currency);
      return {
        currency,
        amount: roundMoney(amount * rate),
        rate
      };
    })
  );

  return {
    baseCurrency,
    amount,
    breakdown
  };
}
