import { create } from 'zustand';

export const useConverterStore = create((set) => ({
  amount: '100',
  from: 'USD',
  to: 'EUR',
  isTravelBudget: false,
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
  setTravelBudget: (isTravelBudget) => set({ isTravelBudget })
}));
