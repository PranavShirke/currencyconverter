import { ArrowLeftRight, Star } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { convertCurrency } from '../api/convert.js';
import { saveFavorite } from '../api/favorites.js';
import { fetchHistory } from '../api/history.js';
import { getApiError } from '../api/client.js';
import { useConverterStore } from '../store/useConverterStore.js';
import { useUserStore } from '../store/useUserStore.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import CurrencySelect from './CurrencySelect.jsx';
import { useEffect, useMemo, useState } from 'react';

export default function Converter({ currencies, onRequireSignIn }) {
  const queryClient = useQueryClient();
  const isRegistered = useUserStore((state) => state.isRegistered);
  const { amount, from, to, setAmount, setFrom, setTo, swapCurrencies } = useConverterStore();
  const debouncedAmount = useDebouncedValue(amount, 300);
  const numericAmount = Number(debouncedAmount);
  const [saveMessage, setSaveMessage] = useState('');

  const conversionQuery = useQuery({
    queryKey: ['conversion', numericAmount, from, to],
    queryFn: () => convertCurrency({ amount: numericAmount, from, to }),
    enabled: Number.isFinite(numericAmount) && numericAmount > 0 && from !== to,
    staleTime: 30_000
  });

  const historyQuery = useQuery({
    queryKey: ['history', 10],
    queryFn: () => fetchHistory(10)
  });

  const favoriteMutation = useMutation({
    mutationFn: saveFavorite,
    onSuccess: () => {
      setSaveMessage('Saved');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => setSaveMessage(getApiError(error, 'Could not save favorite'))
  });

  useEffect(() => {
    if (conversionQuery.data) {
      queryClient.invalidateQueries({ queryKey: ['history', 10] });
    }
  }, [conversionQuery.data, queryClient]);

  const result = conversionQuery.data;
  const invalidAmount = debouncedAmount !== '' && (!Number.isFinite(numericAmount) || numericAmount <= 0);

  const formattedResult = useMemo(() => {
    if (!result) {
      return '';
    }

    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(result.convertedAmount);
  }, [result]);

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-lg bg-white p-5 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
          <CurrencySelect label="From" value={from} currencies={currencies} onChange={setFrom} />
          <button
            className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-ink sm:mb-0"
            type="button"
            onClick={swapCurrencies}
            aria-label="Swap currencies"
            title="Swap currencies"
          >
            <ArrowLeftRight size={18} />
          </button>
          <CurrencySelect label="To" value={to} currencies={currencies} onChange={setTo} />
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-slate-600">Amount</span>
          <input
            className="h-14 w-full rounded-md border border-slate-200 px-4 text-2xl font-semibold text-ink shadow-sm"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Converted amount</p>
          <div className="mt-1 min-h-12">
            {conversionQuery.isFetching ? (
              <div className="h-10 w-56 animate-pulse rounded-md bg-slate-200" />
            ) : result ? (
              <p className="break-words text-3xl font-semibold text-ink">
                {formattedResult} {result.to}
              </p>
            ) : invalidAmount ? (
              <p className="text-sm text-red-600">Enter an amount greater than zero.</p>
            ) : (
              <p className="text-sm text-slate-500">Start with an amount to convert.</p>
            )}
          </div>
          {result ? (
            <p className="mt-3 text-sm text-slate-500">
              1 {result.from} = {result.rate} {result.to}
            </p>
          ) : null}
          {conversionQuery.error ? (
            <p className="mt-3 text-sm text-red-600">{getApiError(conversionQuery.error, 'Conversion failed')}</p>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={() => {
              if (!isRegistered) {
                onRequireSignIn();
                return;
              }
              favoriteMutation.mutate({ base: from, target: to });
            }}
            disabled={favoriteMutation.isPending}
          >
            <Star size={17} />
            Save pair
          </button>
          {saveMessage ? <p className="text-sm text-slate-600">{saveMessage}</p> : null}
        </div>
      </div>

      <aside className="rounded-lg bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-ink">Recent conversions</h2>
        {historyQuery.isLoading ? (
          <div className="mt-4 space-y-3">
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
          </div>
        ) : historyQuery.data?.length ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {historyQuery.data.map((entry) => (
              <li key={entry.id} className="py-3">
                <p className="text-sm font-medium text-ink">
                  {entry.amount} {entry.fromCurrency} to {entry.toCurrency}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {entry.convertedAmount} {entry.toCurrency}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Your conversions will appear here.</p>
        )}
      </aside>
    </section>
  );
}
