import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isDbEnabled } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

// Lead enquiry form. Saves to Firestore when configured, otherwise
// shows a local success state (front-end demo mode).
export default function EnquiryForm({ listingId = null, listingTitle = null }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", email: user?.email || "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const valid = form.name.trim().length >= 2 && /^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10));

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      if (isDbEnabled && db) {
        await addDoc(collection(db, "enquiries"), {
          listingId,
          userId: user ? user.uid : null,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || (user?.email ?? ""),
          message: form.message.trim(),
          status: "new",
          createdAt: serverTimestamp(),
        });
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setStatus("done");
    } catch (err) {
      setError("Something went wrong. Please try again or call us directly.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-brand-50 p-8 text-center ring-1 ring-inset ring-brand-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink-950">Enquiry received</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
          Thank you, {form.name.split(" ")[0]}. Our team will call you back shortly
          {listingTitle ? ` about ${listingTitle}` : ""}. We usually respond within 2 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <h3 className="font-display text-xl font-semibold text-ink-950">
        {listingTitle ? `Enquire about ${listingTitle}` : "Send an enquiry"}
      </h3>
      <p className="mt-1 text-xs text-ink-400">Share your details and our plot expert will call you back.</p>

      <div className="mt-5 space-y-3.5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-600">Full name</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={inputCls} />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-600">Phone</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile number" inputMode="tel" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-600">Email (optional)</label>
            <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" type="email" className={inputCls} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-600">Message (optional)</label>
          <textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="I am interested in this plot. Please share payment plans and site visit slots." rows={3} className={`${inputCls} resize-none`} />
        </div>
      </div>

      {status === "error" && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!valid || status === "sending"}
        className="mt-5 w-full rounded-xl bg-brand-700 px-4 py-3.5 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "sending" ? "Sending..." : "Request Callback"}
      </button>
      <p className="mt-2.5 text-center text-[11px] text-ink-400">
        By submitting, you agree to be contacted about this enquiry.
      </p>
    </form>
  );
}
