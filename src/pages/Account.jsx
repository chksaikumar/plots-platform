import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../context/ListingsContext";
import { getListingById } from "../lib/listings";
import { formatINRShort } from "../utils/format";
import PlotCard from "../components/PlotCard";
import Reveal from "../components/Reveal";

const STATUS_STYLES = {
  new: "bg-gold-100 text-gold-800",
  contacted: "bg-brand-100 text-brand-800",
  closed: "bg-ink-100 text-ink-500",
};

export default function Account() {
  const { user, isSignedIn, signOut, dbEnabled, isAdmin } = useAuth();
  const { listings } = useListings();
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/signin");
      return;
    }
    if (!dbEnabled || !db) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const q = query(collection(db, "enquiries"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        rows.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
        setEnquiries(rows);
      } catch {
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, dbEnabled, navigate]);

  if (!isSignedIn) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950">My account</h1>
          <p className="mt-2 text-sm text-ink-500">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Link to="/admin" className="rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-700">
              Admin panel
            </Link>
          )}
          <button onClick={() => { signOut(); navigate("/"); }} className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-all hover:border-red-300 hover:text-red-600">
            Sign out
          </button>
        </div>
      </Reveal>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-ink-950">My enquiries</h2>
        {loading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-ink-100" />
            ))}
          </div>
        ) : !dbEnabled ? (
          <p className="mt-4 rounded-2xl bg-white p-6 text-sm text-ink-500 shadow-card ring-1 ring-ink-100">
            Enquiry history needs the database. Connect Firebase to track your enquiries here.
          </p>
        ) : enquiries.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-ink-100">
            <p className="text-sm text-ink-500">You have not sent any enquiries yet.</p>
            <Link to="/map" className="mt-4 inline-flex rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
              Explore plots
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {enquiries.map((e) => {
              const listing = e.listingId ? getListingById(listings, e.listingId) : null;
              return (
                <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
                  <div>
                    <div className="text-sm font-semibold text-ink-950">
                      {listing ? (
                        <Link to={`/plot/${listing.id}`} className="hover:text-brand-700">{listing.title}</Link>
                      ) : (
                        "General enquiry"
                      )}
                    </div>
                    <div className="mt-1 text-xs text-ink-400">
                      {listing && `${formatINRShort(listing.price)} · `}
                      {e.createdAt?.toDate ? e.createdAt.toDate().toLocaleDateString("en-IN") : ""}
                      {e.message ? ` · "${e.message.slice(0, 60)}${e.message.length > 60 ? "..." : ""}"` : ""}
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[e.status] || STATUS_STYLES.new}`}>
                    {e.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        <Link to="/shortlist" className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-all hover:border-brand-400 hover:text-brand-800">
          My shortlist
        </Link>
        <Link to="/map" className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800">
          Explore plots
        </Link>
      </div>
    </div>
  );
}
