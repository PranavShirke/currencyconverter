import { Save } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTravelBudget } from '../api/convert.js';
import { getApiError } from '../api/client.js';

export default function TravelBudgetPanel({
  amount,
  baseCurrency,
  currencies,
  selectedCurrencies,
  onCurrencyChange,
  onSaveSet
}) {
  const [saveMessage, setSaveMessage] = useState('');
  const numericAmount = Number(amount);
  const travelQuery = useQuery({
    queryKey: ['travel-budget', numericAmount, baseCurrency, selectedCurrencies],
    queryFn: () =>
      fetchTravelBudget({
        amount: numericAmount,
        baseCurrency,
        targetCurrencies: selectedCurrencies
      }),
    enabled: Number.isFinite(numericAmount) && numericAmount > 0 && selectedCurrencies.length === 5
  });

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">Travel budgeting</h2>
          {saveMessage ? <p className="mt-1 text-sm text-slate-500">{saveMessage}</p> : null}
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-[repeat(5,8rem)_auto]">
          {selectedCurrencies.map((selectedCurrency, index) => (
            <label key={index} className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Currency {index + 1}</span>
              <select
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-ink shadow-sm transition hover:border-slate-300 lg:w-32"
                value={selectedCurrency}
                onChange={(event) => onCurrencyChange(index, event.target.value)}
              >
                {currencies.map((currency) => {
                  const isSelectedElsewhere =
                    selectedCurrencies.includes(currency.code) && selectedCurrency !== currency.code;

                  return (
                    <option key={currency.code} value={currency.code} disabled={isSelectedElsewhere}>
                      {currency.code}
                    </option>
                  );
                })}
              </select>
            </label>
          ))}
          <button
            className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-md bg-accent px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            type="button"
            onClick={() => {
              onSaveSet();
              setSaveMessage('Travel set saved');
              window.setTimeout(() => setSaveMessage(''), 1800);
            }}
          >
            <Save size={16} />
            Save set
          </button>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-slate-50 text-sm text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Currency</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {travelQuery.isLoading ? (
              [0, 1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  <td className="px-4 py-4" colSpan={3}>
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : travelQuery.error ? (
              <tr>
                <td className="px-4 py-5 text-red-600" colSpan={3}>
                  {getApiError(travelQuery.error, 'Travel budget failed')}
                </td>
              </tr>
            ) : travelQuery.data?.breakdown?.length ? (
              travelQuery.data.breakdown.map((row) => (
                <tr key={row.currency}>
                  <td className="px-4 py-3 font-semibold text-ink">{row.currency}</td>
                  <td className="px-4 py-3 text-slate-700">{row.amount}</td>
                  <td className="px-4 py-3 text-slate-500">{row.rate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-5 text-slate-500" colSpan={3}>
                  Enter an amount greater than zero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
