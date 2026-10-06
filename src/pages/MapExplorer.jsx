import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import { uniqueValues } from "../lib/listings";
import MapView from "../components/MapView";
import FilterPanel, { DEFAULT_FILTERS, applyFilters } from "../components/FilterPanel";
import PlotCard from "../components/PlotCard";

export default function MapExplorer() {
  const { listings, loading } = useListings();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState("split"); // split | map | list
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Deep-link support: /map?city=Hyderabad&q=shadnagar&vastu=1
  useEffect(() => {
    const city = searchParams.get("city");
    const q = searchParams.get("q");
    const vastu = searchParams.get("vastu");
    setFilters((prev) => ({
      ...prev,
      city: city || "all",
      vastuOnly: vastu === "1" ? true : prev.vastuOnly,
    }));
    if (q) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [query, setQuery] = useState("");

  const states = useMemo(() => uniqueValues(listings, "state"), [listings]);
  const cities = useMemo(() => uniqueValues(listings, "city"), [listings]);
  const developers = useMemo(() => uniqueValues(listings, "developer"), [listings]);

  const filtered = useMemo(() => {
    let out = applyFilters(listings, filters);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((l) =>
        [l.title, l.locality, l.venture, l.developer, l.city].join(" ").toLowerCase().includes(q)
      );
    }
    return out;
  }, [listings, filters, query]);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col md:h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="z-[500] border-b border-ink-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-3 sm:px-6">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-all hover:border-brand-400 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M7 12h10m-7 6h4" />
            </svg>
            Filters
          </button>
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search locality, venture or developer"
              className="w-full rounded-full border border-ink-200 bg-ink-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="hidden items-center rounded-full bg-ink-50 p-1 ring-1 ring-inset ring-ink-100 sm:flex">
            {[
              { id: "split", label: "Split" },
              { id: "map", label: "Map" },
              { id: "list", label: "List" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  view === v.id ? "bg-white text-brand-800 shadow-card" : "text-ink-500 hover:text-ink-800"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <span className="hidden whitespace-nowrap rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800 md:inline-block">
            {filtered.length} plots
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Filter sidebar (desktop) */}
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-ink-100 bg-white p-5 lg:block">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            states={states}
            cities={cities}
            developers={developers}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        {/* Map */}
        {(view === "split" || view === "map") && (
          <div className={`relative min-h-0 ${view === "split" ? "hidden flex-1 md:block" : "flex-1"}`}>
            {loading ? (
              <div className="flex h-full items-center justify-center bg-[#e8efe9]">
                <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-card">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
                  <span className="text-sm font-medium text-ink-600">Loading map...</span>
                </div>
              </div>
            ) : (
              <MapView listings={filtered} />
            )}
            <div className="absolute bottom-4 left-4 z-[500] rounded-full bg-ink-950/85 px-4 py-2 text-xs font-medium text-white backdrop-blur">
              {filtered.length} plots match your filters
            </div>
          </div>
        )}

        {/* List */}
        {(view === "split" || view === "list") && (
          <div className={`min-h-0 overflow-y-auto bg-ink-50 p-4 sm:p-5 ${view === "split" ? "hidden w-[420px] shrink-0 md:block lg:w-[460px]" : "flex-1"}`}>
            {view === "list" && (
              <div className={(view === "split" ? "" : "") + " mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-3"}>
                {filtered.map((l) => (
                  <PlotCard key={l.id} listing={l} compact />
                ))}
              </div>
            )}
            {view === "split" && (
              <div className="space-y-4">
                {filtered.map((l) => (
                  <PlotCard key={l.id} listing={l} compact />
                ))}
              </div>
            )}
            {filtered.length === 0 && !loading && (
              <div className="rounded-2xl bg-white p-10 text-center shadow-card">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-ink-300">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-950">No plots match</h3>
                <p className="mt-1 text-sm text-ink-500">Try widening the price range or clearing some filters.</p>
                <button onClick={() => { setFilters(DEFAULT_FILTERS); setQuery(""); }} className="mt-4 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[1100] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-pop" style={{ animation: "fade-up 0.3s ease both" }}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink-200" />
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              states={states}
              cities={cities}
              developers={developers}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-brand-700 py-3.5 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Show {filtered.length} plots
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
