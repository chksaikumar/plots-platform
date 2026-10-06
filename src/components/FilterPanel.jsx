import { formatINRShort } from "../utils/format";

export const DEFAULT_FILTERS = {
  state: "all",
  city: "all",
  approvals: [],
  maxPrice: 10000000,
  minSize: 0,
  maxSize: 600,
  facing: "all",
  vastuOnly: false,
  developer: "all",
  status: "available-only",
};

const APPROVAL_OPTIONS = ["DTCP", "HMDA", "RERA", "CMDA", "BMRDA", "BDA"];
const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

export function applyFilters(listings, f) {
  return listings.filter((l) => {
    const approvals = Array.isArray(l.approvals) ? l.approvals : [];
    const price = Number(l.price) || 0;
    const size = Number(l.sizeSqYd) || 0;
    if (f.state !== "all" && l.state !== f.state) return false;
    if (f.city !== "all" && l.city !== f.city) return false;
    if (f.approvals.length > 0 && !f.approvals.every((a) => approvals.includes(a))) return false;
    if (price > f.maxPrice) return false;
    if (size < f.minSize || size > f.maxSize) return false;
    if (f.facing !== "all" && l.facing !== f.facing) return false;
    if (f.vastuOnly && !l.vastuFriendly) return false;
    if (f.developer !== "all" && l.developer !== f.developer) return false;
    if (f.status === "available-only" && l.status === "sold-out") return false;
    return true;
  });
}

function SliderRow({ label, value, min, max, step, onChange, format }) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-600">{label}</span>
        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-800">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ "--fill": `${fill}%` }}
      />
    </div>
  );
}

export default function FilterPanel({ filters, setFilters, states, cities, developers, onReset }) {
  const toggleApproval = (a) => {
    setFilters((prev) => ({
      ...prev,
      approvals: prev.approvals.includes(a)
        ? prev.approvals.filter((x) => x !== a)
        : [...prev.approvals, a],
    }));
  };

  const set = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const selectCls =
    "w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-800 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink-950">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-brand-700 transition-colors hover:text-brand-800 hover:underline"
        >
          Reset all
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-600">State</label>
          <select value={filters.state} onChange={(e) => set("state", e.target.value)} className={selectCls}>
            <option value="all">All states</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-600">City</label>
          <select value={filters.city} onChange={(e) => set("city", e.target.value)} className={selectCls}>
            <option value="all">All cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold text-ink-600">Approvals</label>
        <div className="flex flex-wrap gap-2">
          {APPROVAL_OPTIONS.map((a) => (
            <button
              key={a}
              onClick={() => toggleApproval(a)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                filters.approvals.includes(a)
                  ? "bg-brand-700 text-white shadow-card"
                  : "bg-ink-50 text-ink-600 ring-1 ring-inset ring-ink-200 hover:ring-brand-300"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <SliderRow
        label="Max price"
        value={filters.maxPrice}
        min={1000000}
        max={10000000}
        step={100000}
        onChange={(v) => set("maxPrice", v)}
        format={(v) => (v >= 10000000 ? "₹1 Cr+" : formatINRShort(v))}
      />

      <div className="grid grid-cols-2 gap-3">
        <SliderRow
          label="Min size (sq.yd.)"
          value={filters.minSize}
          min={0}
          max={500}
          step={10}
          onChange={(v) => set("minSize", v)}
          format={(v) => `${v}`}
        />
        <SliderRow
          label="Max size (sq.yd.)"
          value={filters.maxSize}
          min={100}
          max={600}
          step={10}
          onChange={(v) => set("maxSize", v)}
          format={(v) => `${v}`}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink-600">Facing direction</label>
        <select value={filters.facing} onChange={(e) => set("facing", e.target.value)} className={selectCls}>
          <option value="all">Any facing</option>
          {FACING_OPTIONS.map((f) => <option key={f} value={f}>{f} facing</option>)}
        </select>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gold-50 px-4 py-3 ring-1 ring-inset ring-gold-200 transition-all hover:ring-gold-300">
        <span className="flex items-center gap-2 text-sm font-semibold text-gold-800">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 2l2.6 6.9L22 9.3l-5.4 4.7 1.6 7.2L12 17.8 5.8 21.2l1.6-7.2L2 9.3l7.4-.4L12 2z" />
          </svg>
          Vastu friendly only
        </span>
        <input
          type="checkbox"
          checked={filters.vastuOnly}
          onChange={(e) => set("vastuOnly", e.target.checked)}
          className="h-5 w-5 accent-yellow-600"
        />
      </label>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink-600">Developer</label>
        <select value={filters.developer} onChange={(e) => set("developer", e.target.value)} className={selectCls}>
          <option value="all">All developers</option>
          {developers.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-ink-600">Availability</label>
        <select value={filters.status} onChange={(e) => set("status", e.target.value)} className={selectCls}>
          <option value="available-only">Hide sold out</option>
          <option value="all">Show all</option>
        </select>
      </div>
    </div>
  );
}
