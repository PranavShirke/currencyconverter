import { listCurrencies } from '../services/currencyService.js';

export function getCurrencies(_req, res) {
  res.json(listCurrencies());
}
