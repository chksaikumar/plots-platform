import { useMemo, useState } from "react";
import { formatINR, formatINRShort } from "../utils/format";

// Standard reducing-balance EMI formula.
export default function EmiCalculator({ price }) {
  const downPct = 20;
  const [tenureYears, setTenureYears] = useState(15);
  const [rate, setRate] = useState(8.5);

  const result = useMemo(() => {
    const principal = price * (1 - downPct / 100);
    const r = rate / 12 / 100;
    const n = tenureYears * 12;
    const emi = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { principal, emi, totalInterest: emi * n - principal, downPayment: price * (downPct / 100) };
  }, [price, tenureYears, rate]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <h3 className="font-display text-xl font-semibold text-ink-950">EMI Calculator</h3>
      <p className="mt-1 text-xs text-ink-400">Plan a plot loan with {downPct}% down payment.</p>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-600">
            <span>Interest rate</span>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-800">{rate.toFixed(1)}%</span>
          </div>
          <input type="range" min={7} max={12} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" style={{ "--fill": `${((rate - 7) / 5) * 100}%` }} />
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-600">
            <span>Tenure</span>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-800">{tenureYears} yrs</span>
          </div>
          <input type="range" min={5} max={20} step={1} value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} className="w-full" style={{ "--fill": `${((tenureYears - 5) / 15) * 100}%` }} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-brand-950 p-4 text-white">
          <div className="text-[11px] uppercase tracking-wider text-brand-200">Monthly EMI</div>
          <div className="mt-1 font-display text-2xl font-bold">{formatINRShort(result.emi)}</div>
        </div>
        <div className="rounded-xl bg-ink-50 p-4 ring-1 ring-inset ring-ink-100">
          <div className="text-[11px] uppercase tracking-wider text-ink-400">Loan amount</div>
          <div className="mt-1 font-display text-2xl font-bold text-ink-950">{formatINRShort(result.principal)}</div>
        </div>
      </div>
      <div className="mt-3 flex justify-between text-xs text-ink-500">
        <span>Down payment: <strong className="text-ink-800">{formatINR(result.downPayment)}</strong></span>
        <span>Total interest: <strong className="text-ink-800">{formatINRShort(result.totalInterest)}</strong></span>
      </div>
    </div>
  );
}
