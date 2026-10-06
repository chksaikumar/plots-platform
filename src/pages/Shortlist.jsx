import { Link } from "react-router-dom";
import { useListings } from "../context/ListingsContext";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../context/AuthContext";
import PlotCard from "../components/PlotCard";
import Reveal from "../components/Reveal";

export default function Shortlist() {
  const { listings, loading } = useListings();
  const { favorites, clear } = useFavorites();
  const { isSignedIn } = useAuth();

  const saved = listings.filter((l) => favorites.includes(l.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">My shortlist</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            {isSignedIn
              ? "Your shortlist syncs to your account and is available on every device."
              : "Your shortlist is saved on this device. Sign in to sync it across devices."}
          </p>
        </div>
        <div className="flex gap-2">
          {!isSignedIn && (
            <Link to="/signin" className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-all hover:border-brand-400 hover:text-brand-800">
              Sign in to sync
            </Link>
          )}
          {saved.length > 0 && (
            <button onClick={clear} className="rounded-full bg-ink-50 px-5 py-2.5 text-sm font-semibold text-ink-600 ring-1 ring-inset ring-ink-100 transition-all hover:text-red-600">
              Clear all
            </button>
          )}
          {saved.length > 0 && (
            <Link to="/compare" className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800">
              Compare selected
            </Link>
          )}
        </div>
      </Reveal>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="rounded-2xl bg-white p-14 text-center shadow-card ring-1 ring-ink-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-50 text-ink-300">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold text-ink-950">Nothing shortlisted yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
              Tap the heart icon on any plot card to save it here for later comparison.
            </p>
            <Link to="/map" className="mt-6 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800">
              Explore plots
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((l, i) => (
              <Reveal key={l.id} delay={(i % 3) * 80}>
                <PlotCard listing={l} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
