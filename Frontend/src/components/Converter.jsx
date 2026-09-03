import { ArrowLeftRight, RotateCcw, Star, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { convertCurrency } from '../api/convert.js';
import { saveFavorite } from '../api/favorites.js';
import { clearHistory, deleteHistoryEntry, fetchHistory } from '../api/history.js';
import { getApiError } from '../api/client.js';
import { useConverterStore } from '../store/useConverterStore.js';
import { useUserStore } from '../store/useUserStore.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import CurrencySelect from './CurrencySelect.jsx';
import { useEffect, useMemo, useState } from 'react';

export default function Converter({ currencies, onRequireSignIn }) {
  const queryClient = useQueryClient();
  const isRegistered = useUserStore((state) => state.isRegistered);
  const { amount, from, to, loadConversion, setAmount, setFrom, setTo, swapCurrencies } = useConverterStore();
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
    queryKey: ['history', 30],
    queryFn: () => fetchHistory(30)
  });

  const favoriteMutation = useMutation({
    mutationFn: saveFavorite,
    onSuccess: () => {
      setSaveMessage('Saved');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => setSaveMessage(getApiError(error, 'Could not save favorite'))
  });

  const deleteHistoryMutation = useMutation({
    mutationFn: deleteHistoryEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['history'] })
  });

  const clearHistoryMutation = useMutation({
    mutationFn: clearHistory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['history'] })
  });

  useEffect(() => {
    if (conversionQuery.data) {
      queryClient.invalidateQueries({ queryKey: ['history'] });
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
    <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
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
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink">Recent conversions</h2>
          {historyQuery.data?.length ? (
            <button
              className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending}
            >
              Clear
            </button>
          ) : null}
        </div>
        {historyQuery.isLoading ? (
          <div className="mt-4 space-y-3">
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
            <div className="h-12 animate-pulse rounded-md bg-slate-100" />
          </div>
        ) : historyQuery.data?.length ? (
          <ul className="mt-4 max-h-[390px] divide-y divide-slate-100 overflow-y-auto pr-1">
            {historyQuery.data.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-ink">
                    {entry.amount} {entry.fromCurrency} to {entry.toCurrency}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {entry.convertedAmount} {entry.toCurrency}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    className="grid h-8 w-8 place-items-center rounded-md text-slate-400 transition hover:bg-emerald-50 hover:text-accent"
                    type="button"
                    onClick={() =>
                      loadConversion({
                        amount: entry.amount,
                        from: entry.fromCurrency,
                        to: entry.toCurrency
                      })
                    }
                    aria-label={`Load ${entry.amount} ${entry.fromCurrency} to ${entry.toCurrency}`}
                    title="Load into converter"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    className="grid h-8 w-8 place-items-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    type="button"
                    onClick={() => deleteHistoryMutation.mutate(entry.id)}
                    disabled={deleteHistoryMutation.isPending}
                    aria-label={`Delete ${entry.amount} ${entry.fromCurrency} to ${entry.toCurrency}`}
                    title="Delete history entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
