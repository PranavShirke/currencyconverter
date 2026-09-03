import { create } from 'zustand';

const DEFAULT_TRAVEL_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
const SAVED_TRAVEL_SET_KEY = 'currency-converter-travel-set';

function getSavedTravelCurrencies() {
  try {
    if (typeof localStorage === 'undefined') {
      return DEFAULT_TRAVEL_CURRENCIES;
    }

    const savedValue = localStorage.getItem(SAVED_TRAVEL_SET_KEY);
    const savedCurrencies = savedValue ? JSON.parse(savedValue) : null;

    if (
      Array.isArray(savedCurrencies) &&
      savedCurrencies.length === 5 &&
      new Set(savedCurrencies).size === savedCurrencies.length
    ) {
      return savedCurrencies;
    }
  } catch {
    return DEFAULT_TRAVEL_CURRENCIES;
  }

  return DEFAULT_TRAVEL_CURRENCIES;
}

export const useConverterStore = create((set) => ({
  amount: '100',
  from: 'USD',
  to: 'EUR',
  isTravelBudget: false,
  travelCurrencies: getSavedTravelCurrencies(),
  setAmount: (amount) => set({ amount }),
  setFrom: (from) =>
    set((state) => ({
      from,
      to: from === state.to ? (from === 'USD' ? 'EUR' : 'USD') : state.to
    })),
  setTo: (to) =>
    set((state) => ({
      to,
      from: to === state.from ? (to === 'USD' ? 'EUR' : 'USD') : state.from
    })),
  swapCurrencies: () =>
    set((state) => ({
      from: state.to,
      to: state.from
    })),
  loadConversion: ({ amount, from, to }) =>
    set({
      amount: String(amount),
      from,
      to
    }),
  loadPair: ({ from, to }) =>
    set({
      from,
      to,
      isTravelBudget: false
    }),
  setTravelCurrency: (index, currency) =>
    set((state) => ({
      travelCurrencies: state.travelCurrencies.map((currentCurrency, currentIndex) =>
        currentIndex === index ? currency : currentCurrency
      )
    })),
  saveTravelSet: () =>
    set((state) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SAVED_TRAVEL_SET_KEY, JSON.stringify(state.travelCurrencies));
      }

      return {};
    }),
  setTravelBudget: (isTravelBudget) =>
    set((state) => ({
      isTravelBudget,
      travelCurrencies: isTravelBudget ? getSavedTravelCurrencies() : state.travelCurrencies
    }))
}));
