import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import { formatINR, formatINRShort, formatPerSqYd } from "../utils/format";
import { VastuBadge, ApprovalBadges, PlotArtwork } from "../components/PlotCard";
import Reveal from "../components/Reveal";

const ROWS = [
  { label: "Total price", get: (l) => formatINR(l.price), highlight: "low" },
  { label: "Plot size", get: (l) => `${l.sizeSqYd} sq.yd.`, highlight: null },
  { label: "Price per sq.yd.", get: (l) => formatPerSqYd(l.pricePerSqYd), highlight: "low" },
  { label: "Facing", get: (l) => l.facing, highlight: null },
  { label: "Shape", get: (l) => l.plotShape, highlight: null },
  { label: "Vastu friendly", get: (l) => (l.vastuFriendly ? "Yes" : "No"), highlight: null },
  { label: "Status", get: (l) => (l.status === "available" ? "Available" : l.status === "few-left" ? "Few left" : "Sold out"), highlight: null },
  { label: "Developer", get: (l) => l.developer, highlight: null },
  { label: "Locality", get: (l) => `${l.locality}, ${l.city}`, highlight: null },
];

export default function Compare() {
  const { listings } = useListings();
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev));

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings
      .filter((l) => l.status !== "sold-out")
      .filter((l) => !q || [l.title, l.locality, l.city, l.developer].join(" ").toLowerCase().includes(q))
      .slice(0, 12);
  }, [listings, query]);

  const compared = useMemo(() => selected.map((id) => listings.find((l) => l.id === id)).filter(Boolean), [selected, listings]);

  const bestFor = (row) => {
    if (!row.highlight || compared.length < 2) return null;
    if (row.highlight === "low") {
      const vals = compared.map((l) => (row.label === "Total price" ? l.price : l.pricePerSqYd));
      const min = Math.min(...vals);
      return compared.find((l) => (row.label === "Total price" ? l.price : l.pricePerSqYd) === min)?.id;
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">Compare plots</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Select up to 3 plots and compare them side by side on price, size, approvals, vastu and more.
        </p>
      </Reveal>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plots to add"
          className="w-full rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((l) => {
            const active = selected.includes(l.id);
            return (
              <button
                key={l.id}
                onClick={() => toggle(l.id)}
                className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                  active ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100" : "border-ink-100 bg-white hover:border-brand-300"
                }`}
              >
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{l.title}</span>
                  <span className="mt-0.5 block text-xs text-ink-400">{l.locality}, {l.city} · {formatINRShort(l.price)}</span>
                </span>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${active ? "border-brand-600 bg-brand-600 text-white" : "border-ink-200 text-transparent"}`}>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {compared.length > 0 && (
        <Reveal className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 p-4 text-left align-bottom text-xs font-semibold uppercase tracking-wider text-ink-400">Feature</th>
                {compared.map((l) => (
                  <th key={l.id} className="p-4 align-top">
                    <div className="overflow-hidden rounded-xl ring-1 ring-ink-100">
                      <PlotArtwork seed={l.id} className="h-24 w-full" />
                    </div>
                    <Link to={`/plot/${l.id}`} className="mt-2 block font-display text-base font-semibold text-ink-950 hover:text-brand-800">
                      {l.title}
                    </Link>
                    <div className="mt-0.5 text-xs font-normal text-ink-400">{l.locality}, {l.city}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const best = bestFor(row);
                return (
                  <tr key={row.label} className="border-t border-ink-100">
                    <td className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-400">{row.label}</td>
                    {compared.map((l) => (
                      <td key={l.id} className={`p-4 font-medium ${best === l.id ? "text-brand-800" : "text-ink-700"}`}>
                        <span className={best === l.id ? "inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 ring-1 ring-inset ring-brand-200" : ""}>
                          {best === l.id && (
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M12 2l2.6 6.9L22 9.3l-5.4 4.7 1.6 7.2L12 17.8 5.8 21.2l1.6-7.2L2 9.3l7.4-.4L12 2z" /></svg>
                          )}
                          {row.get(l)}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="border-t border-ink-100">
                <td className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-400">Approvals</td>
                {compared.map((l) => (
                  <td key={l.id} className="p-4"><ApprovalBadges approvals={l.approvals} /></td>
                ))}
              </tr>
              <tr className="border-t border-ink-100">
                <td className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-400">Vastu</td>
                {compared.map((l) => (
                  <td key={l.id} className="p-4">{l.vastuFriendly ? <VastuBadge /> : <span className="text-ink-300">-</span>}</td>
                ))}
              </tr>
              <tr className="border-t border-ink-100">
                <td className="p-4 text-xs font-semibold uppercase tracking-wider text-ink-400">Amenities</td>
                {compared.map((l) => (
                  <td key={l.id} className="p-4 text-xs leading-relaxed text-ink-600">{(l.amenities || []).join(", ")}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>
      )}

      {compared.length === 0 && (
        <div className="mt-8 rounded-2xl bg-white p-12 text-center shadow-card ring-1 ring-ink-100">
          <p className="text-sm text-ink-500">Select plots above to start comparing.</p>
        </div>
      )}
    </div>
  );
}
