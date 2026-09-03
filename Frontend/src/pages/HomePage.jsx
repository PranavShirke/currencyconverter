import { Plane } from 'lucide-react';
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
  const {
    amount,
    from,
    to,
    isTravelBudget,
    setAmount,
    setFrom,
    setTravelBudget,
    setTravelCurrency,
    saveTravelSet,
    travelCurrencies
  } = useConverterStore();
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
        <button
          className={`inline-flex h-12 items-center gap-3 rounded-full border px-4 text-sm font-semibold shadow-sm transition ${
            isTravelBudget
              ? 'border-emerald-700 bg-accent text-white shadow-emerald-900/10'
              : 'border-slate-200 bg-white text-ink hover:border-emerald-200 hover:bg-emerald-50'
          }`}
          type="button"
          role="switch"
          aria-checked={isTravelBudget}
          onClick={() => setTravelBudget(!isTravelBudget)}
        >
          <span
            className={`grid h-7 w-7 place-items-center rounded-full transition ${
              isTravelBudget ? 'bg-white/20 text-white' : 'bg-emerald-50 text-accent'
            }`}
          >
            <Plane size={16} />
          </span>
          Travel budgeting
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              isTravelBudget ? 'bg-white/30' : 'bg-slate-200'
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                isTravelBudget ? 'left-6' : 'left-1'
              }`}
            />
          </span>
        </button>
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
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>
          </div>
        </section>
      ) : (
        <Converter currencies={currencies} onRequireSignIn={openSignIn} />
      )}

      {isTravelBudget ? (
        <TravelBudgetPanel
          amount={amount}
          baseCurrency={from}
          currencies={currencies}
          selectedCurrencies={travelCurrencies}
          onCurrencyChange={setTravelCurrency}
          onSaveSet={saveTravelSet}
        />
      ) : (
        <TrendChart base={from} target={to} />
      )}
    </div>
  );
}
