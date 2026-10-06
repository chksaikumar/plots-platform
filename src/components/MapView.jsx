import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { formatINRShort } from "../utils/format";
import { PlotArtwork, VastuBadge, ApprovalBadges, StatusPill } from "./PlotCard";

function pinIcon(listing) {
  const bg = listing.vastuFriendly ? "#1d6c49" : "#334155";
  const label = formatINRShort(listing.price).replace("₹", "");
  const html = `<div class="pin-marker ${listing.vastuFriendly ? "vastu" : ""}" style="background:${bg}"><span class="pin-label">${label}</span></div>`;
  return L.divIcon({
    html,
    className: "custom-pin",
    iconSize: [40, 40],
    iconAnchor: [20, 38],
    popupAnchor: [0, -36],
  });
}

// Fits the map to the visible listings whenever they change.
function FitBounds({ listings }) {
  const map = useMap();
  useEffect(() => {
    if (listings.length === 0) return;
    const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng]));
    map.fitBounds(bounds.pad(0.15), { animate: true });
  }, [listings, map]);
  return null;
}

const INDIA_CENTER = [20.6, 78.9];

export default function MapView({ listings }) {
  const icons = useMemo(() => {
    const map = new Map();
    listings.forEach((l) => {
      if (!map.has(l.id)) map.set(l.id, pinIcon(l));
    });
    return map;
  }, [listings]);

  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={5}
      scrollWheelZoom
      className="h-full w-full"
      style={{ minHeight: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds listings={listings} />
      {listings.map((l) => (
        <Marker key={l.id} position={[l.lat, l.lng]} icon={icons.get(l.id)}>
          <Popup>
            <div className="overflow-hidden">
              <div className="relative">
                <PlotArtwork seed={l.id} className="h-28 w-full" />
                <div className="absolute left-2 top-2">
                  <StatusPill status={l.status} />
                </div>
              </div>
              <div className="p-3.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {l.locality}, {l.city}
                </div>
                <div className="mt-0.5 font-display text-base font-semibold text-ink-950">{l.title}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-lg font-bold text-brand-800">{formatINRShort(l.price)}</span>
                  <span className="text-[11px] text-ink-400">{l.sizeSqYd} sq.yd.</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <ApprovalBadges approvals={l.approvals.slice(0, 2)} />
                  {l.vastuFriendly && <VastuBadge />}
                </div>
                <Link
                  to={`/plot/${l.id}`}
                  className="mt-3 block rounded-lg bg-brand-700 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
