import { Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { useListings } from "../context/ListingsContext";
import { getListingById, getLocalityTrend } from "../lib/listings";
import { formatINR, formatINRShort, formatPerSqYd, statusLabel } from "../utils/format";
import { useFavorites } from "../hooks/useFavorites";
import { PlotArtwork, VastuBadge, ApprovalBadges, StatusPill } from "../components/PlotCard";
import EmiCalculator from "../components/EmiCalculator";
import RoiEstimator from "../components/RoiEstimator";
import PriceTrendChart from "../components/PriceTrendChart";
import DueDiligence from "../components/DueDiligence";
import EnquiryForm from "../components/EnquiryForm";
import Reveal from "../components/Reveal";

const pinIcon = L.divIcon({
  html: `<div class="pin-marker" style="background:#1d6c49"><span class="pin-label">◆</span></div>`,
  className: "custom-pin",
  iconSize: [40, 40],
  iconAnchor: [20, 38],
});

const LANDMARK_ICONS = {
  highway: "M4 6h16M4 12h16M4 18h16",
  school: "M12 3L2 9l10 6 10-6-10-6zM2 9v6m20-6v6",
  hospital: "M12 5v14M5 12h14",
  railwayStation: "M4 17V7l8-4 8 4v10M4 17h16M8 21l-1-4m9 4l1-4",
};
const LANDMARK_LABELS = { highway: "Highway", school: "School", hospital: "Hospital", railwayStation: "Railway Station" };

export default function PlotDetail() {
  const { id } = useParams();
  const { listings, localities, loading } = useListings();
  const { toggle, isFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="h-10 w-2/3 animate-pulse rounded-xl bg-ink-100" />
        <div className="mt-6 h-80 animate-pulse rounded-3xl bg-ink-100" />
      </div>
    );
  }

  const listing = getListingById(listings, id);
  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-ink-950">Plot not found</h1>
        <p className="mt-3 text-sm text-ink-500">This listing may have been removed or the link is incorrect.</p>
        <Link to="/map" className="mt-6 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-800">
          Back to map
        </Link>
      </div>
    );
  }

  const fav = isFavorite(listing.id);
  const trend = getLocalityTrend(listing, localities);
  const related = listings.filter((l) => l.id !== listing.id && l.locality === listing.locality).slice(0, 3);

  return (
    <div className="bg-ink-50">
      {/* Breadcrumb + header */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-ink-400">
          <Link to="/" className="hover:text-brand-700">Home</Link>
          <span>/</span>
          <Link to="/map" className="hover:text-brand-700">Explore</Link>
          <span>/</span>
          <span className="font-medium text-ink-700">{listing.title}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={listing.status} />
              {listing.vastuFriendly && <VastuBadge />}
              <ApprovalBadges approvals={listing.approvals} />
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">{listing.title}</h1>
            <p className="mt-2 text-sm text-ink-500">
              {listing.venture} by <span className="font-semibold text-ink-800">{listing.developer}</span> · {listing.locality}, {listing.city}, {listing.state}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggle(listing.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-inset transition-all duration-200 active:scale-95 ${
                fav ? "bg-red-500 text-white ring-red-500" : "bg-white text-ink-700 ring-ink-200 hover:ring-red-300 hover:text-red-500"
              }`}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {fav ? "Shortlisted" : "Shortlist"}
            </button>
            <Link to="/compare" className="rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
              Compare
            </Link>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="overflow-hidden rounded-3xl shadow-card md:col-span-2">
            <PlotArtwork seed={listing.id} className="h-72 w-full sm:h-96" />
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="overflow-hidden rounded-3xl shadow-card">
              <PlotArtwork seed={`${listing.id}-a`} className="h-full min-h-36 w-full" />
            </div>
            <div className="overflow-hidden rounded-3xl shadow-card">
              <PlotArtwork seed={`${listing.id}-b`} className="h-full min-h-36 w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Price card */}
          <Reveal className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total price</div>
                <div className="mt-1 font-display text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">{formatINR(listing.price)}</div>
                <div className="mt-1.5 text-sm text-ink-500">{formatPerSqYd(listing.pricePerSqYd)} · {listing.sizeSqYd} sq.yd.</div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Facing", value: listing.facing },
                  { label: "Shape", value: listing.plotShape[0].toUpperCase() + listing.plotShape.slice(1) },
                  { label: "Status", value: statusLabel(listing.status) },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-ink-50 px-4 py-3 ring-1 ring-inset ring-ink-100">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{s.label}</div>
                    <div className="mt-0.5 text-sm font-bold text-ink-900">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink-600">{listing.description}</p>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Amenities</div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-medium text-ink-700 ring-1 ring-inset ring-ink-100">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {trend && (
            <Reveal>
              <PriceTrendChart trend={trend.trend} trendNote={trend.note} locality={trend.locality} />
            </Reveal>
          )}

          <Reveal>
            <RoiEstimator price={listing.price} />
          </Reveal>

          {/* Landmarks */}
          <Reveal className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8">
            <h3 className="font-display text-xl font-semibold text-ink-950">Nearby landmarks</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(listing.landmarks || {}).map(([key, lm]) => (
                <div key={key} className="flex items-center gap-3.5 rounded-xl bg-ink-50 p-4 ring-1 ring-inset ring-ink-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d={LANDMARK_ICONS[key] || LANDMARK_ICONS.school} />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{LANDMARK_LABELS[key] || key}</div>
                    <div className="truncate text-sm font-semibold text-ink-900">{lm.name}</div>
                    <div className="text-xs text-brand-700 font-medium">{lm.distanceKm} km away</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Location map */}
          <Reveal className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
            <div className="flex items-center justify-between p-6 pb-0">
              <h3 className="font-display text-xl font-semibold text-ink-950">Location</h3>
              <span className="text-xs text-ink-400">{listing.locality}, {listing.city}</span>
            </div>
            <div className="mt-4 h-72">
              <MapContainer center={[listing.lat, listing.lng]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[listing.lat, listing.lng]} icon={pinIcon} />
              </MapContainer>
            </div>
          </Reveal>

          <Reveal>
            <DueDiligence state={listing.state} approvals={listing.approvals} />
          </Reveal>
        </div>

        {/* Sidebar */}
        <div className="mt-8 space-y-6 lg:mt-0">
          <div className="lg:sticky lg:top-24 lg:space-y-6">
            <EnquiryForm listingId={listing.id} listingTitle={listing.title} />
            <EmiCalculator price={listing.price} />
            <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
              <h3 className="font-display text-xl font-semibold text-ink-950">Developer</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 font-display text-lg font-bold text-white">
                  {listing.developer[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink-950">{listing.developer}</div>
                  <div className="text-xs text-ink-400">{listing.venture}</div>
                </div>
              </div>
              <Link to={`/ventures`} className="mt-4 block rounded-xl bg-ink-50 px-4 py-2.5 text-center text-sm font-semibold text-ink-700 ring-1 ring-inset ring-ink-100 transition-all hover:bg-brand-50 hover:text-brand-800">
                All ventures
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">More in {listing.locality}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <PlotCard key={l.id} listing={l} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
