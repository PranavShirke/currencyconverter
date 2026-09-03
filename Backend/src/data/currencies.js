export const currencies = [
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'lv' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kc' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zl' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
];

export const currencyCodes = new Set(currencies.map((currency) => currency.code));

export function normalizeCurrencyCode(code) {
  return String(code || '').trim().toUpperCase();
}

export function isSupportedCurrency(code) {
  return currencyCodes.has(normalizeCurrencyCode(code));
}
