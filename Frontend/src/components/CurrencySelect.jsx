export default function CurrencySelect({ label, value, currencies, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <select
        className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-base text-ink shadow-sm transition hover:border-slate-300"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </label>
  );
}
