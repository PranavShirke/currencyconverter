import { create } from 'zustand';

export const useConverterStore = create((set) => ({
  amount: '100',
  from: 'USD',
  to: 'EUR',
  isTravelBudget: false,
  travelCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'],
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
  setTravelBudget: (isTravelBudget) => set({ isTravelBudget })
}));
