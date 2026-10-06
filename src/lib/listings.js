import sample from "../data/listings.json";
import { db, isDbEnabled } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Map a Firestore listing document to the app's listing shape
// (identical to the shape in listings.json).
export function mapDbListing(id, data) {
  return {
    id,
    title: data.title,
    venture: data.venture,
    developer: data.developer,
    state: data.state,
    city: data.city,
    locality: data.locality,
    lat: data.lat,
    lng: data.lng,
    price: Number(data.price),
    sizeSqYd: Number(data.sizeSqYd),
    pricePerSqYd: Number(data.pricePerSqYd),
    approvals: data.approvals || [],
    facing: data.facing,
    plotShape: data.plotShape,
    vastuFriendly: Boolean(data.vastuFriendly),
    amenities: data.amenities || [],
    status: data.status,
    description: data.description,
    landmarks: data.landmarks || {},
    priceTrend: data.priceTrend || null,
    trendNote: data.trendNote || null,
    isActive: data.active !== false,
  };
}

// Returns { listings, localities, source: 'db' | 'sample' }.
// Uses Firestore when configured AND it has active listings,
// otherwise falls back to the sample JSON.
export async function getListings() {
  const localities = sample.localities;
  if (isDbEnabled && db) {
    try {
      const q = query(collection(db, "listings"), where("active", "==", true));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return {
          listings: snap.docs.map((d) => mapDbListing(d.id, d.data())),
          localities,
          source: "db",
        };
      }
    } catch {
      // fall through to sample data
    }
  }
  return { listings: sample.listings, localities, source: "sample" };
}

export function getListingById(listings, id) {
  return listings.find((l) => l.id === id);
}

export function getLocalityTrend(listing, localities) {
  if (listing.priceTrend && listing.priceTrend.length > 1) {
    return { trend: listing.priceTrend, note: listing.trendNote, locality: listing.locality };
  }
  const loc = localities[listing.locality];
  if (loc && loc.priceTrend) {
    return { trend: loc.priceTrend, note: loc.trendNote, locality: listing.locality };
  }
  return null;
}

export const reraPortals = sample._meta.reraPortals;

export function uniqueValues(listings, key) {
  return [...new Set(listings.map((l) => l[key]).filter(Boolean))].sort();
}
