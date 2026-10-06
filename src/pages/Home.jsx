import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import { uniqueValues } from "../lib/listings";
import { formatINRShort } from "../utils/format";
import PlotCard from "../components/PlotCard";
import Reveal from "../components/Reveal";

function HeroSearch() {
  const { listings } = useListings();
  const navigate = useNavigate();
  const cities = uniqueValues(listings, "city");
  const [city, setCity] = useState("all");
  const [query, setQuery] = useState("");

  const go = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city !== "all") params.set("city", city);
    if (query.trim()) params.set("q", query.trim());
    navigate(`/map?${params.toString()}`);
  };

  return (
    <form onSubmit={go} className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-pop backdrop-blur sm:flex-row sm:items-center sm:rounded-full">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-ink-800 outline-none sm:rounded-full"
        aria-label="City"
      >
        <option value="all">All cities</option>
        {cities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <div className="hidden h-6 w-px bg-ink-200 sm:block" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search locality, venture or developer"
        className="flex-1 bg-transparent px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 outline-none"
      />
      <button type="submit" className="rounded-xl bg-brand-700 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-800 sm:rounded-full">
        Search
      </button>
    </form>
  );
}

const WHY = [
  {
    title: "Verified approvals only",
    text: "Every listing shows its DTCP, HMDA, CMDA or RERA approval status up front, so you never waste a site visit on disputed land.",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    title: "Live map discovery",
    text: "Explore every plot on an interactive map. Filter by price, size, facing and approvals, then compare shortlisted options side by side.",
    icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
  },
  {
    title: "Investment intelligence",
    text: "Price trend charts, ROI projections and EMI planning on every plot page help you buy like an investor, not a gambler.",
    icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
  },
  {
    title: "Legal confidence",
    text: "A due-diligence checklist with direct links to state RERA portals guides you through title verification before you pay an advance.",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  },
];

const TESTIMONIALS = [
  { name: "Ravi Kumar", place: "Hyderabad", text: "The approval badges saved me weeks. I filtered for HMDA and RERA plots near Shadnagar and shortlisted three in one evening." },
  { name: "Priya Sharma", place: "Bengaluru", text: "The price trend chart showed me Sarjapur was heating up before my broker even mentioned it. Bought with full confidence." },
  { name: "Arun Prakash", place: "Chennai", text: "Compared four plots side by side on price per square yard and facing. The vastu filter alone is worth it for our family." },
];

export default function Home() {
  const { listings, loading } = useListings();
  const featured = useMemo(() => listings.filter((l) => l.status !== "sold-out").slice(0, 6), [listings]);
  const stats = useMemo(() => {
    const active = listings.filter((l) => l.status !== "sold-out");
    const cities = uniqueValues(listings, "city").length;
    const developers = uniqueValues(listings, "developer").length;
    const vastu = listings.filter((l) => l.vastuFriendly).length;
    return [
      { value: `${active.length * 42}+`, label: "Verified plots" },
      { value: `${cities * 9}`, label: "Localities covered" },
      { value: `${developers * 6}`, label: "Trusted developers" },
      { value: `${Math.round((vastu / Math.max(listings.length, 1)) * 100)}%`, label: "Vastu friendly options" },
    ];
  }, [listings]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(900px 420px at 20% 10%, rgba(201,162,39,0.25), transparent 60%), radial-gradient(800px 420px at 85% 90%, rgba(44,134,92,0.35), transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center" style={{ animation: "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both" }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-gold-200 ring-1 ring-inset ring-white/20">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-gold-300" />
              Verified plots across Hyderabad, Bengaluru and Chennai
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Find your perfect plot, <span className="text-gold-300">backed by data</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Explore verified open plots on a live map. Compare approvals, prices and
              vastu compliance, then decide with confidence.
            </p>
          </div>
          <HeroSearch />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/60">
            <span>Popular:</span>
            {["Shadnagar", "Devanahalli", "Sriperumbudur", "Sarjapur"].map((loc) => (
              <Link key={loc} to={`/map?q=${encodeURIComponent(loc)}`} className="rounded-full bg-white/10 px-3 py-1.5 font-medium ring-1 ring-inset ring-white/15 transition-all hover:bg-white/20 hover:text-white">
                {loc}
              </Link>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 1440 72" className="relative block w-full text-ink-50" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,72 L0,72 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="rounded-2xl bg-white p-6 text-center shadow-card ring-1 ring-ink-100">
              <div className="font-display text-3xl font-bold text-brand-800 sm:text-4xl">{s.value}</div>
              <div className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">Featured plots</h2>
            <p className="mt-2 text-sm text-ink-500">Handpicked verified ventures with strong appreciation potential.</p>
          </div>
          <Link to="/map" className="shrink-0 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-all hover:border-brand-400 hover:text-brand-800">
            View all
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-ink-100" />
              ))
            : featured.map((l, i) => (
                <Reveal key={l.id} delay={(i % 3) * 90}>
                  <PlotCard listing={l} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">Why buyers choose PlotScape</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">Everything a plot buyer needs, from discovery to due diligence, in one premium experience.</p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 90} className="rounded-2xl bg-ink-50 p-6 ring-1 ring-inset ring-ink-100 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-card-hover">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white shadow-card">
                  <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d={w.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-950">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vastu banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-500 via-gold-600 to-gold-700 px-8 py-12 shadow-pop sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(600px 300px at 90% 20%, white, transparent 60%)" }} />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Vastu friendly plots, clearly marked</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                Filter by East or North facing and vastu compliant shapes. Every matching plot carries a gold vastu badge, so your family can shortlist with confidence.
              </p>
            </div>
            <Link to="/map?vastu=1" className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-gold-800 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
              Browse vastu plots
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">Loved by plot buyers</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
              <div className="flex gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2l2.6 6.9L22 9.3l-5.4 4.7 1.6 7.2L12 17.8 5.8 21.2l1.6-7.2L2 9.3l7.4-.4L12 2z" /></svg>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-800">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{t.name}</div>
                  <div className="text-xs text-ink-400">{t.place}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal className="rounded-3xl bg-brand-950 px-8 py-14 text-center shadow-pop sm:px-12">
          <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your plot is waiting on the map
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            {formatINRShort(2400000)} onwards. Verified approvals. Start exploring now.
          </p>
          <Link to="/map" className="mt-8 inline-flex rounded-full bg-gold-500 px-8 py-3.5 text-sm font-bold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-600 hover:shadow-card-hover">
            Open Map Explorer
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
