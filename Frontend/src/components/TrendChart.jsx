import { ArrowLeftRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchTrend } from '../api/rates.js';
import { getApiError } from '../api/client.js';

export default function TrendChart({ base, target }) {
  const [isInverted, setInverted] = useState(false);
  const chartBase = isInverted ? target : base;
  const chartTarget = isInverted ? base : target;

  useEffect(() => {
    setInverted(false);
  }, [base, target]);

  const trendQuery = useQuery({
    queryKey: ['trend', chartBase, chartTarget, 30],
    queryFn: () => fetchTrend({ base: chartBase, target: chartTarget, days: 30 }),
    enabled: chartBase !== chartTarget
  });

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">30-day trend</h2>
          <p className="mt-1 text-sm text-slate-500">
            1 {chartBase} in {chartTarget}
          </p>
        </div>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-accent"
          type="button"
          onClick={() => setInverted((value) => !value)}
        >
          <ArrowLeftRight size={16} />
          Show 1 {chartTarget} in {chartBase}
        </button>
      </div>
      <div className="mt-4 h-72">
        {trendQuery.isLoading ? (
          <div className="h-full animate-pulse rounded-md bg-slate-100" />
        ) : trendQuery.error ? (
          <div className="flex h-full items-center justify-center rounded-md bg-red-50 px-4 text-center text-sm text-red-700">
            {getApiError(trendQuery.error, 'Trend data is unavailable')}
          </div>
        ) : trendQuery.data?.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendQuery.data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
              <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} width={64} />
              <Tooltip
                formatter={(value) => [value, `${chartBase}/${chartTarget}`]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line type="monotone" dataKey="rate" stroke="#047857" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-md bg-slate-50 text-sm text-slate-500">
            No trend data returned.
          </div>
        )}
      </div>
    </section>
  );
}
