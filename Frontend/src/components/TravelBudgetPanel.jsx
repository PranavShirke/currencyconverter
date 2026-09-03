import { useQuery } from '@tanstack/react-query';
import { fetchTravelBudget } from '../api/convert.js';
import { getApiError } from '../api/client.js';

export default function TravelBudgetPanel({ amount, baseCurrency }) {
  const numericAmount = Number(amount);
  const travelQuery = useQuery({
    queryKey: ['travel-budget', numericAmount, baseCurrency],
    queryFn: () => fetchTravelBudget({ amount: numericAmount, baseCurrency }),
    enabled: Number.isFinite(numericAmount) && numericAmount > 0
  });

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <h2 className="text-base font-semibold text-ink">Travel budgeting</h2>
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
