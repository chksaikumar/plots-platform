import { useMemo } from "react";
import { formatPerSqYd } from "../utils/format";

// SVG sparkline of the locality's 12-month price trend.
export default function PriceTrendChart({ trend, trendNote, locality }) {
  const { points, min, max, change } = useMemo(() => {
    const w = 560, h = 150, pad = 12;
    const minV = Math.min(...trend) * 0.995;
    const maxV = Math.max(...trend) * 1.005;
    const pts = trend.map((v, i) => {
      const x = pad + (i / (trend.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - minV) / (maxV - minV)) * (h - pad * 2);
      return [x, y];
    });
    const changePct = ((trend[trend.length - 1] - trend[0]) / trend[0]) * 100;
    return { points: pts, min: trend[0], max: trend[trend.length - 1], change: changePct };
  }, [trend]);

  const line = points.map((p) => p.join(",")).join(" ");
  const area = `12,150 ${line} 548,150`;
  const up = change >= 0;
  const stroke = up ? "#1d6c49" : "#b91c1c";
  const last = points[points.length - 1];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-950">Price Trend: {locality}</h3>
          <p className="mt-1 text-xs text-ink-400">Average price per sq. yd., last 12 months.</p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${up ? "bg-brand-50 text-brand-800" : "bg-red-50 text-red-700"}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            {up ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 4 4 5-6" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 4-4 5 6" />}
          </svg>
          {up ? "+" : ""}{change.toFixed(1)}%
        </div>
      </div>

      <svg viewBox="0 0 560 150" className="mt-4 w-full" role="img" aria-label={`Price trend for ${locality}`}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={12} x2={548} y1={150 * f} y2={150 * f} stroke="#e6e9e6" strokeDasharray="4 4" strokeWidth={1} />
        ))}
        <polygon points={area} fill="url(#trendFill)" />
        <polyline points={line} fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last[0]} cy={last[1]} r={6} fill={stroke} stroke="#fff" strokeWidth={3} />
      </svg>

      <div className="mt-2 flex items-center justify-between text-xs text-ink-400">
        <span>12 months ago: <strong className="text-ink-700">{formatPerSqYd(min)}</strong></span>
        <span>Now: <strong className="text-ink-700">{formatPerSqYd(max)}</strong></span>
      </div>
      {trendNote && <p className="mt-3 rounded-xl bg-ink-50 px-4 py-3 text-xs leading-relaxed text-ink-600">{trendNote}</p>}
    </div>
  );
}
