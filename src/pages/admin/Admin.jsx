import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { formatINRShort } from "../../utils/format";

const APPROVALS = ["DTCP", "HMDA", "RERA", "CMDA", "BMRDA", "BDA"];
const FACINGS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const STATUSES = ["available", "few-left", "sold-out"];

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
const labelCls = "mb-1.5 block text-xs font-semibold text-ink-600";

const EMPTY_FORM = {
  slug: "", title: "", venture: "", developer: "", state: "Telangana",
  city: "Hyderabad", locality: "", lat: "", lng: "", price: "",
  sizeSqYd: "", pricePerSqYd: "", approvals: [], facing: "East",
  plotShape: "rectangle", vastuFriendly: false, amenities: "",
  status: "available", description: "", active: true, trendNote: "",
  priceTrend: "", highwayName: "", highwayKm: "", schoolName: "",
  schoolKm: "", hospitalName: "", hospitalKm: "", stationName: "", stationKm: "",
};

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ListingForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleApproval = (a) =>
    set("approvals", form.approvals.includes(a) ? form.approvals.filter((x) => x !== a) : [...form.approvals, a]);

  const submit = (e) => {
    e.preventDefault();
    const slug = form.slug || slugify(form.title);
    const num = (v) => (v === "" ? null : Number(v));
    onSave({
      slug,
      title: form.title.trim(),
      venture: form.venture.trim(),
      developer: form.developer.trim(),
      state: form.state,
      city: form.city.trim(),
      locality: form.locality.trim(),
      lat: num(form.lat),
      lng: num(form.lng),
      price: num(form.price),
      sizeSqYd: num(form.sizeSqYd),
      pricePerSqYd: num(form.pricePerSqYd),
      approvals: form.approvals,
      facing: form.facing,
      plotShape: form.plotShape,
      vastuFriendly: form.vastuFriendly || ["East", "North", "North-East"].includes(form.facing),
      amenities: form.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      status: form.status,
      description: form.description.trim(),
      active: form.active,
      trendNote: form.trendNote.trim(),
      priceTrend: form.priceTrend.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n)),
      landmarks: {
        highway: { name: form.highwayName.trim(), distanceKm: num(form.highwayKm) || 0 },
        school: { name: form.schoolName.trim(), distanceKm: num(form.schoolKm) || 0 },
        hospital: { name: form.hospitalName.trim(), distanceKm: num(form.hospitalKm) || 0 },
        railwayStation: { name: form.stationName.trim(), distanceKm: num(form.stationKm) || 0 },
      },
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <h3 className="font-display text-xl font-semibold text-ink-950">{initial ? "Edit listing" : "Add listing"}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Title *</label><input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inputCls} placeholder="Emerald Enclave" /></div>
        <div><label className={labelCls}>URL slug</label><input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="auto from title" /></div>
        <div><label className={labelCls}>Venture</label><input value={form.venture} onChange={(e) => set("venture", e.target.value)} className={inputCls} /></div>
        <div><label className={labelCls}>Developer *</label><input value={form.developer} onChange={(e) => set("developer", e.target.value)} required className={inputCls} /></div>
        <div>
          <label className={labelCls}>State</label>
          <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls}>
            <option>Telangana</option><option>Karnataka</option><option>Tamil Nadu</option>
          </select>
        </div>
        <div><label className={labelCls}>City *</label><input value={form.city} onChange={(e) => set("city", e.target.value)} required className={inputCls} placeholder="Hyderabad" /></div>
        <div><label className={labelCls}>Locality *</label><input value={form.locality} onChange={(e) => set("locality", e.target.value)} required className={inputCls} placeholder="Shadnagar" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Latitude *</label><input value={form.lat} onChange={(e) => set("lat", e.target.value)} required type="number" step="any" className={inputCls} /></div>
          <div><label className={labelCls}>Longitude *</label><input value={form.lng} onChange={(e) => set("lng", e.target.value)} required type="number" step="any" className={inputCls} /></div>
        </div>
        <div><label className={labelCls}>Price (INR) *</label><input value={form.price} onChange={(e) => set("price", e.target.value)} required type="number" className={inputCls} placeholder="2400000" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Size (sq.yd.) *</label><input value={form.sizeSqYd} onChange={(e) => set("sizeSqYd", e.target.value)} required type="number" className={inputCls} /></div>
          <div><label className={labelCls}>Price/sq.yd. *</label><input value={form.pricePerSqYd} onChange={(e) => set("pricePerSqYd", e.target.value)} required type="number" className={inputCls} /></div>
        </div>
        <div>
          <label className={labelCls}>Facing</label>
          <select value={form.facing} onChange={(e) => set("facing", e.target.value)} className={inputCls}>
            {FACINGS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Plot shape</label>
          <select value={form.plotShape} onChange={(e) => set("plotShape", e.target.value)} className={inputCls}>
            <option value="square">Square</option><option value="rectangle">Rectangle</option><option value="irregular">Irregular</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-6 pb-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
            <input type="checkbox" checked={form.vastuFriendly} onChange={(e) => set("vastuFriendly", e.target.checked)} className="h-4.5 w-4.5 accent-yellow-600" /> Vastu friendly
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-700">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4.5 w-4.5 accent-green-700" /> Active
          </label>
        </div>
      </div>

      <div>
        <label className={labelCls}>Approvals</label>
        <div className="flex flex-wrap gap-2">
          {APPROVALS.map((a) => (
            <button type="button" key={a} onClick={() => toggleApproval(a)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${form.approvals.includes(a) ? "bg-brand-700 text-white" : "bg-ink-50 text-ink-600 ring-1 ring-inset ring-ink-200"}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelCls}>Amenities (comma separated)</label>
        <input value={form.amenities} onChange={(e) => set("amenities", e.target.value)} className={inputCls} placeholder="Gated Community, Parks and Playgrounds, 24x7 Security" />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
      </div>

      <div>
        <label className={labelCls}>Landmarks</label>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["highway", "Highway"], ["school", "School"], ["hospital", "Hospital"], ["station", "Railway station"]].map(([k, label]) => (
            <div key={k} className="flex gap-2">
              <input value={form[`${k}Name`]} onChange={(e) => set(`${k}Name`, e.target.value)} placeholder={`${label} name`} className={inputCls} />
              <input value={form[`${k}Km`]} onChange={(e) => set(`${k}Km`, e.target.value)} placeholder="km" type="number" step="any" className={`${inputCls} w-24`} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Price trend (12 monthly values, comma separated)</label><input value={form.priceTrend} onChange={(e) => set("priceTrend", e.target.value)} className={inputCls} placeholder="10500, 10650, ..." /></div>
        <div><label className={labelCls}>Trend note</label><input value={form.trendNote} onChange={(e) => set("trendNote", e.target.value)} className={inputCls} /></div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-50">
          {saving ? "Saving..." : initial ? "Save changes" : "Add listing"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:border-ink-300">
          Cancel
        </button>
      </div>
    </form>
  );
}

function toFormValues(doc) {
  const d = doc.data();
  const lm = d.landmarks || {};
  return {
    slug: doc.id, title: d.title || "", venture: d.venture || "", developer: d.developer || "",
    state: d.state || "Telangana", city: d.city || "", locality: d.locality || "",
    lat: d.lat ?? "", lng: d.lng ?? "", price: d.price ?? "", sizeSqYd: d.sizeSqYd ?? "",
    pricePerSqYd: d.pricePerSqYd ?? "", approvals: d.approvals || [], facing: d.facing || "East",
    plotShape: d.plotShape || "rectangle", vastuFriendly: !!d.vastuFriendly,
    amenities: (d.amenities || []).join(", "), status: d.status || "available",
    description: d.description || "", active: d.active !== false, trendNote: d.trendNote || "",
    priceTrend: (d.priceTrend || []).join(", "),
    highwayName: lm.highway?.name || "", highwayKm: lm.highway?.distanceKm ?? "",
    schoolName: lm.school?.name || "", schoolKm: lm.school?.distanceKm ?? "",
    hospitalName: lm.hospital?.name || "", hospitalKm: lm.hospital?.distanceKm ?? "",
    stationName: lm.railwayStation?.name || "", stationKm: lm.railwayStation?.distanceKm ?? "",
  };
}

const LEAD_STATUS = ["new", "contacted", "closed"];

export default function Admin() {
  const { isAdmin, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [listings, setListings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState("all");
  const [editing, setEditing] = useState(null); // doc snapshot or "new"
  const [saving, setSaving] = useState(false);
  const [opError, setOpError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/signin");
  }, [authLoading, isAdmin, navigate]);

  const refresh = async () => {
    setLoading(true);
    try {
      const [lSnap, eSnap, fSnap] = await Promise.all([
        getDocs(query(collection(db, "listings"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "enquiries"), orderBy("createdAt", "desc"))),
        getDocs(collectionGroup(db, "items")),
      ]);
      setListings(lSnap.docs);
      setLeads(eSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setFavCount(fSnap.size);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const saveListing = async (values) => {
    setSaving(true);
    setOpError("");
    try {
      const { slug, ...data } = values;
      const payload = { ...data, updatedAt: serverTimestamp() };
      if (editing && editing !== "new") {
        await updateDoc(doc(db, "listings", editing.id), payload);
      } else {
        await setDoc(doc(db, "listings", slug), {
          ...payload,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
      }
      setEditing(null);
      refresh();
    } catch {
      setOpError("Could not save the listing. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const removeListing = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setOpError("");
    try {
      await deleteDoc(doc(db, "listings", id));
      refresh();
    } catch {
      setOpError("Could not delete the listing. Check your connection and try again.");
    }
  };

  const toggleActive = async (d) => {
    setOpError("");
    try {
      await updateDoc(doc(db, "listings", d.id), { active: !(d.data().active !== false), updatedAt: serverTimestamp() });
      refresh();
    } catch {
      setOpError("Could not update the listing. Check your connection and try again.");
    }
  };

  const setLeadStatus = async (id, status) => {
    setOpError("");
    try {
      await updateDoc(doc(db, "enquiries", id), { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch {
      setOpError("Could not update the lead. Check your connection and try again.");
    }
  };

  const filteredListings = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((d) => {
      if (!q) return true;
      const data = d.data();
      return [data.title, data.locality, data.city, data.developer].join(" ").toLowerCase().includes(q);
    });
  }, [listings, search]);

  const filteredLeads = useMemo(
    () => leads.filter((l) => leadFilter === "all" || l.status === leadFilter),
    [leads, leadFilter]
  );

  const stats = useMemo(() => {
    const active = listings.filter((d) => d.data().active !== false).length;
    const fresh = leads.filter((l) => l.status === "new").length;
    return [
      { label: "Total listings", value: listings.length },
      { label: "Active listings", value: active },
      { label: "Total enquiries", value: leads.length },
      { label: "New leads", value: fresh },
      { label: "Shortlists saved", value: favCount },
    ];
  }, [listings, leads, favCount]);

  if (authLoading || !isAdmin) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
        <p className="mt-4 text-sm text-ink-500">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950">Admin panel</h1>
          <p className="mt-1 text-sm text-ink-500">Signed in as {user?.email}</p>
        </div>
        <Link to="/" className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-800">
          View site
        </Link>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "listings", label: "Listings" },
          { id: "leads", label: `Leads inbox${leads.filter((l) => l.status === "new").length ? ` (${leads.filter((l) => l.status === "new").length})` : ""}` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setEditing(null); }}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${tab === t.id ? "bg-ink-950 text-white shadow-card" : "bg-white text-ink-600 ring-1 ring-inset ring-ink-200 hover:ring-brand-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {opError && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200">
          {opError}
        </div>
      )}

      {tab === "dashboard" && (
        <div className="mt-8">          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-6 text-center shadow-card ring-1 ring-ink-100">
                <div className="font-display text-4xl font-bold text-brand-800">{loading ? "-" : s.value}</div>
                <div className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-ink-400">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
              <h3 className="font-display text-lg font-semibold text-ink-950">Latest leads</h3>
              <div className="mt-4 space-y-3">
                {leads.slice(0, 5).map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-ink-900">{l.name} · {l.phone}</div>
                      <div className="truncate text-xs text-ink-400">{l.message || "No message"}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-bold text-gold-800">{l.status}</span>
                  </div>
                ))}
                {leads.length === 0 && !loading && <p className="text-sm text-ink-400">No enquiries yet.</p>}
              </div>
            </div>
            <div className="rounded-2xl bg-brand-950 p-6 text-white shadow-card">
              <h3 className="font-display text-lg font-semibold">Quick actions</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => { setTab("listings"); setEditing("new"); }} className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-gold-600">
                  Add listing
                </button>
                <button onClick={() => setTab("leads")} className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 transition-all hover:bg-white/20">
                  Review leads
                </button>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-white/60">
                Listings marked inactive are hidden from the public site. Deleting a listing is permanent.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "listings" && (
        <div className="mt-8">
          {editing ? (
            <ListingForm
              initial={editing === "new" ? null : toFormValues(editing)}
              onSave={saveListing}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search listings"
                  className="min-w-60 flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <button onClick={() => setEditing("new")} className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-800">
                  Add listing
                </button>
              </div>
              <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
                <table className="w-full min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-400">
                      <th className="p-4">Title</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Active</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((d) => {
                      const l = d.data();
                      const active = l.active !== false;
                      return (
                        <tr key={d.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/50">
                          <td className="p-4">
                            <div className="font-semibold text-ink-950">{l.title}</div>
                            <div className="text-xs text-ink-400">{d.id}</div>
                          </td>
                          <td className="p-4 text-ink-600">{l.locality}, {l.city}</td>
                          <td className="p-4 font-semibold text-ink-900">{formatINRShort(Number(l.price))}</td>
                          <td className="p-4"><span className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-600">{l.status}</span></td>
                          <td className="p-4">
                            <button onClick={() => toggleActive(d)} className={`relative h-6 w-11 rounded-full transition-colors ${active ? "bg-brand-600" : "bg-ink-200"}`} aria-label="Toggle active">
                              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${active ? "left-[22px]" : "left-0.5"}`} />
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <Link to={`/plot/${d.id}`} className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-800">View</Link>
                              <button onClick={() => setEditing(d)} className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-800">Edit</button>
                              <button onClick={() => removeListing(d.id, l.title)} className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-300">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredListings.length === 0 && !loading && (
                  <p className="p-10 text-center text-sm text-ink-400">No listings found. Add your first listing to get started.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {tab === "leads" && (
        <div className="mt-8">
          <div className="flex gap-2">
            {["all", ...LEAD_STATUS].map((s) => (
              <button
                key={s}
                onClick={() => setLeadFilter(s)}
                className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition-all ${leadFilter === s ? "bg-ink-950 text-white" : "bg-white text-ink-600 ring-1 ring-inset ring-ink-200"}`}
              >
                {s === "all" ? `All (${leads.length})` : `${s} (${leads.filter((l) => l.status === s).length})`}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {filteredLeads.map((l) => (
              <div key={l.id} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-ink-950">{l.name}</div>
                    <div className="mt-0.5 text-xs text-ink-500">{l.phone}{l.email ? ` · ${l.email}` : ""}</div>
                    {l.message && <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">"{l.message}"</p>}
                    <div className="mt-2 text-[11px] text-ink-400">
                      {l.createdAt?.toDate ? l.createdAt.toDate().toLocaleString("en-IN") : ""}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {LEAD_STATUS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setLeadStatus(l.id, s)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${l.status === s ? "bg-brand-700 text-white shadow-card" : "bg-ink-50 text-ink-500 ring-1 ring-inset ring-ink-200 hover:ring-brand-300"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filteredLeads.length === 0 && !loading && (
              <p className="rounded-2xl bg-white p-10 text-center text-sm text-ink-400 shadow-card ring-1 ring-ink-100">No leads in this state.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
