import { useMemo, useState } from "react";
import { formatINRShort } from "../utils/format";

// Investment projection: compound appreciation on the plot price.
export default function RoiEstimator({ price }) {
  const [growth, setGrowth] = useState(8);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const future = price * Math.pow(1 + growth / 100, years);
    return { future, gain: future - price, multiple: future / price };
  }, [price, growth, years]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <h3 className="font-display text-xl font-semibold text-ink-950">Investment ROI Estimator</h3>
      <p className="mt-1 text-xs text-ink-400">A projection, not a promise. Land values move with the market.</p>

      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-600">
            <span>Expected annual appreciation</span>
            <span className="rounded-md bg-gold-100 px-2 py-0.5 font-bold text-gold-800">{growth}%</span>
          </div>
          <input type="range" min={0} max={20} step={0.5} value={growth} onChange={(e) => setGrowth(Number(e.target.value))} className="w-full" style={{ "--fill": `${(growth / 20) * 100}%` }} />
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-600">
            <span>Holding period</span>
            <span className="rounded-md bg-gold-100 px-2 py-0.5 font-bold text-gold-800">{years} yrs</span>
          </div>
          <input type="range" min={1} max={15} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" style={{ "--fill": `${((years - 1) / 14) * 100}%` }} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-gold-50 p-4 ring-1 ring-inset ring-gold-200">
          <div className="text-[11px] uppercase tracking-wider text-gold-700">Today</div>
          <div className="mt-1 font-display text-lg font-bold text-ink-950">{formatINRShort(price)}</div>
        </div>
        <div className="rounded-xl bg-brand-950 p-4 text-white">
          <div className="text-[11px] uppercase tracking-wider text-brand-200">In {years} yrs</div>
          <div className="mt-1 font-display text-lg font-bold">{formatINRShort(result.future)}</div>
        </div>
        <div className="rounded-xl bg-brand-50 p-4 ring-1 ring-inset ring-brand-200">
          <div className="text-[11px] uppercase tracking-wider text-brand-700">Total return</div>
          <div className="mt-1 font-display text-lg font-bold text-brand-800">+{formatINRShort(result.gain)}</div>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
        Projected value assumes steady {growth}% yearly compounding. Actual returns vary with location development, approvals and market cycles.
      </p>
    </div>
  );
}
