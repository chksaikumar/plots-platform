import { localities, reraPortals } from "../data/reference";
import { db, isDbEnabled } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Map a Firestore listing document to the app's listing shape.
export function mapDbListing(id, data) {
  const d = data || {};
  return {
    id,
    title: d.title || "Untitled plot",
    venture: d.venture || "",
    developer: d.developer || "",
    state: d.state || "",
    city: d.city || "",
    locality: d.locality || "",
    lat: Number(d.lat),
    lng: Number(d.lng),
    price: Number(d.price) || 0,
    sizeSqYd: Number(d.sizeSqYd) || 0,
    pricePerSqYd: Number(d.pricePerSqYd) || 0,
    approvals: Array.isArray(d.approvals) ? d.approvals : [],
    facing: d.facing || "East",
    plotShape: d.plotShape || "rectangle",
    vastuFriendly: Boolean(d.vastuFriendly),
    amenities: Array.isArray(d.amenities) ? d.amenities : [],
    status: d.status || "available",
    description: d.description || "",
    landmarks: d.landmarks || {},
    priceTrend: Array.isArray(d.priceTrend) ? d.priceTrend : null,
    trendNote: d.trendNote || null,
    isActive: d.active !== false,
  };
}

// Returns { listings, localities, source: 'db' } on success, or
// { listings: [], localities, error } when Firebase is not configured
// or the query fails. Listings come ONLY from Firestore. There is no
// sample-data fallback.
export async function getListings() {
  if (!isDbEnabled || !db) {
    return {
      listings: [],
      localities,
      source: "db",
      error: "Firebase is not configured. Add your Firebase config to a .env file and rebuild.",
    };
  }
  try {
    const q = query(collection(db, "listings"), where("active", "==", true));
    const snap = await getDocs(q);
    return {
      listings: snap.docs.map((d) => mapDbListing(d.id, d.data())),
      localities,
      source: "db",
    };
  } catch (e) {
    return {
      listings: [],
      localities,
      source: "db",
      error: "Could not load listings from the database. Check your connection and try again.",
    };
  }
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

export { reraPortals };

export function uniqueValues(listings, key) {
  return [...new Set(listings.map((l) => l[key]).filter(Boolean))].sort();
}
