import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrencies } from '../api/currencies.js';
import Converter from '../components/Converter.jsx';
import TrendChart from '../components/TrendChart.jsx';
import TravelBudgetPanel from '../components/TravelBudgetPanel.jsx';
import CurrencySelect from '../components/CurrencySelect.jsx';
import { useConverterStore } from '../store/useConverterStore.js';
import { getApiError } from '../api/client.js';

export default function HomePage() {
  const { openSignIn } = useOutletContext();
  const { amount, from, to, isTravelBudget, setFrom, setTo, setTravelBudget } = useConverterStore();
  const currenciesQuery = useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies
  });

  if (currenciesQuery.isLoading) {
    return <div className="h-80 animate-pulse rounded-lg bg-white shadow-soft" />;
  }

  if (currenciesQuery.error) {
    return (
      <div className="rounded-lg bg-white p-6 text-red-600 shadow-soft">
        {getApiError(currenciesQuery.error, 'Could not load currencies')}
      </div>
    );
  }

  const currencies = currenciesQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-ink">Convert currencies instantly</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Live rates, recent conversions, favorites, and travel budgeting without making an account first.
          </p>
        </div>
        <label className="flex h-11 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink shadow-sm">
          <input
            className="h-4 w-4 accent-emerald-700"
            type="checkbox"
            checked={isTravelBudget}
            onChange={(event) => setTravelBudget(event.target.checked)}
          />
          Travel budgeting
        </label>
      </div>

      {isTravelBudget ? (
        <section className="rounded-lg bg-white p-5 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <CurrencySelect label="Base currency" value={from} currencies={currencies} onChange={setFrom} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600">Amount</span>
              <input
                className="h-12 w-full rounded-md border border-slate-200 px-3 text-base font-semibold shadow-sm"
                inputMode="decimal"
                value={amount}
                onChange={(event) => useConverterStore.getState().setAmount(event.target.value)}
              />
            </label>
          </div>
        </section>
      ) : (
        <Converter currencies={currencies} onRequireSignIn={openSignIn} />
      )}

      {isTravelBudget ? <TravelBudgetPanel amount={amount} baseCurrency={from} /> : <TrendChart base={from} target={to} />}
    </div>
  );
}
