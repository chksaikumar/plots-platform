import { Link } from "react-router-dom";
import { formatINRShort, formatPerSqYd, statusLabel } from "../utils/format";
import { useFavorites } from "../hooks/useFavorites";

// Deterministic SVG placeholder artwork per listing (no external images).
export function PlotArtwork({ seed = "plot", className = "" }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  const hue = 140 + (hash % 40);
  const plots = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const taken = ((hash >> (r * 4 + c)) & 1) === 1;
      plots.push(
        <rect
          key={`${r}-${c}`}
          x={18 + c * 92}
          y={22 + r * 62}
          width={78}
          height={48}
          rx={6}
          fill={taken ? `hsl(${hue}, 45%, 62%)` : `hsl(${hue}, 35%, 88%)`}
          stroke={taken ? `hsl(${hue}, 50%, 45%)` : `hsl(${hue}, 25%, 75%)`}
          strokeWidth={2}
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 400 230" className={className} role="img" aria-label="Plot layout illustration" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${hash}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue}, 40%, 94%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 45%, 82%)`} />
        </linearGradient>
      </defs>
      <rect width="400" height="230" fill={`url(#sky-${hash})`} />
      <circle cx={330 + (hash % 30)} cy={36} r={22} fill="#f5d67b" opacity={0.9} />
      <ellipse cx={80} cy={200} rx={120} ry={26} fill={`hsl(${hue}, 30%, 78%)`} opacity={0.5} />
      {plots}
      <rect x={18} y={196} width={364} height={10} rx={5} fill={`hsl(${hue}, 20%, 70%)`} />
    </svg>
  );
}

export function VastuBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-semibold text-gold-800 ring-1 ring-inset ring-gold-200">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M12 2l2.6 6.9L22 9.3l-5.4 4.7 1.6 7.2L12 17.8 5.8 21.2l1.6-7.2L2 9.3l7.4-.4L12 2z" />
      </svg>
      Vastu Friendly
    </span>
  );
}

export function ApprovalBadges({ approvals }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {approvals.map((a) => (
        <span
          key={a}
          className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-800 ring-1 ring-inset ring-brand-200"
        >
          {a}
        </span>
      ))}
    </div>
  );
}

export function StatusPill({ status }) {
  const styles = {
    available: "bg-brand-600 text-white",
    "few-left": "bg-gold-500 text-white",
    "sold-out": "bg-ink-300 text-white",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status] || "bg-ink-200"}`}>
      {statusLabel(status)}
    </span>
  );
}

export default function PlotCard({ listing, compact = false }) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(listing.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
      <Link to={`/plot/${listing.id}`} className="relative block overflow-hidden">
        <PlotArtwork seed={listing.id} className="h-44 w-full transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <StatusPill status={listing.status} />
        </div>
        {listing.vastuFriendly && (
          <div className="absolute bottom-3 left-3">
            <VastuBadge />
          </div>
        )}
      </Link>

      <button
        onClick={() => toggle(listing.id)}
        aria-label={fav ? "Remove from shortlist" : "Add to shortlist"}
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-card backdrop-blur transition-all duration-200 active:scale-90 ${
          fav ? "bg-red-500 text-white" : "bg-white/90 text-ink-500 hover:text-red-500"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" width="18" height="18" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {listing.locality}, {listing.city}
        </div>
        <Link to={`/plot/${listing.id}`}>
          <h3 className={`mt-1 font-display font-semibold tracking-tight text-ink-950 transition-colors group-hover:text-brand-800 ${compact ? "text-lg" : "text-xl"}`}>
            {listing.title}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-ink-500">{listing.venture} by {listing.developer}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-ink-950">{formatINRShort(listing.price)}</span>
          <span className="text-xs text-ink-400">{formatPerSqYd(listing.pricePerSqYd)}</span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 8h16v12H4z M4 8l8-5 8 5" /></svg>
            {listing.sizeSqYd} sq.yd.
          </span>
          <span className="inline-flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 3v18 M3 12h18" /></svg>
            {listing.facing} facing
          </span>
        </div>

        <div className="mt-3">
          <ApprovalBadges approvals={listing.approvals} />
        </div>

        <Link
          to={`/plot/${listing.id}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
