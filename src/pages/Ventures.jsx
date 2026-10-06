import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import { formatINRShort } from "../utils/format";
import Reveal from "../components/Reveal";

export default function Ventures() {
  const { listings, loading } = useListings();

  const ventures = useMemo(() => {
    const map = new Map();
    listings.forEach((l) => {
      if (!map.has(l.developer)) {
        map.set(l.developer, { developer: l.developer, listings: [], cities: new Set(), minPrice: Infinity });
      }
      const v = map.get(l.developer);
      v.listings.push(l);
      v.cities.add(l.city);
      v.minPrice = Math.min(v.minPrice, l.price);
    });
    return [...map.values()].sort((a, b) => b.listings.length - a.listings.length);
  }, [listings]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">Ventures and developers</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Meet the developers behind our verified listings. Browse every venture, compare their projects and shortlist your favourites.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-ink-100" />)
          : ventures.map((v, i) => (
              <Reveal key={v.developer} delay={(i % 2) * 90}>
                <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-700 font-display text-2xl font-bold text-white shadow-card">
                        {(v.developer || "?")[0]}
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">{v.developer}</h2>
                        <p className="mt-0.5 text-xs text-ink-400">{[...v.cities].join(", ")}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800">
                      {v.listings.length} plot{v.listings.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-ink-50 p-3.5 text-center ring-1 ring-inset ring-ink-100">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Starts at</div>
                      <div className="mt-1 font-display text-lg font-bold text-ink-950">{Number.isFinite(v.minPrice) ? formatINRShort(v.minPrice) : "-"}</div>
                    </div>
                    <div className="rounded-xl bg-ink-50 p-3.5 text-center ring-1 ring-inset ring-ink-100">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Cities</div>
                      <div className="mt-1 font-display text-lg font-bold text-ink-950">{v.cities.size}</div>
                    </div>
                    <div className="rounded-xl bg-ink-50 p-3.5 text-center ring-1 ring-inset ring-ink-100">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Vastu plots</div>
                      <div className="mt-1 font-display text-lg font-bold text-ink-950">{v.listings.filter((l) => l.vastuFriendly).length}</div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {v.listings.slice(0, 4).map((l) => (
                      <Link key={l.id} to={`/plot/${l.id}`} className="rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-medium text-ink-700 ring-1 ring-inset ring-ink-100 transition-all hover:bg-brand-50 hover:text-brand-800 hover:ring-brand-200">
                        {l.title}
                      </Link>
                    ))}
                    {v.listings.length > 4 && (
                      <span className="rounded-full px-3.5 py-1.5 text-xs font-medium text-ink-400">+{v.listings.length - 4} more</span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
      </div>
    </div>
  );
}
