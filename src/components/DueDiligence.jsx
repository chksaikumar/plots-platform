import { useState } from "react";
import { reraPortals } from "../lib/listings";

const CHECKS = [
  {
    title: "Verify RERA registration",
    detail: "Look up the project on your state's RERA portal and confirm the registration number, validity dates and promoter name match the developer's documents.",
  },
  {
    title: "Check layout approvals",
    detail: "Ask for the DTCP, HMDA, CMDA or BMRDA approved layout copy. The survey numbers on the approval must match the sale deed schedule.",
  },
  {
    title: "Title verification",
    detail: "Get an Encumbrance Certificate for at least 13 years and have a property lawyer verify the 30-year title chain and link documents.",
  },
  {
    title: "Confirm plot measurements on site",
    detail: "Visit the layout and verify the plot number, dimensions and facing with the approved layout plan. Check road widths and common areas physically.",
  },
  {
    title: "Tax receipts and NOCs",
    detail: "Confirm latest property tax receipts are paid, and collect NOCs for water, electricity and drainage connections before registration.",
  },
  {
    title: "Read the sale agreement carefully",
    detail: "Check the payment schedule, development timeline, penalty clauses and what happens if approvals lapse. Never pay in cash without receipts.",
  },
];

export default function DueDiligence({ state, approvals }) {
  const [done, setDone] = useState([]);
  const portal = reraPortals[state];

  const toggle = (i) =>
    setDone((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-ink-950">Legal Due-Diligence Checklist</h3>
          <p className="mt-1 text-xs text-ink-400">
            Work through this list before paying any advance. This venture lists {approvals.join(", ")} approval{approvals.length > 1 ? "s" : ""}.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800">
          {done.length}/{CHECKS.length} done
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {CHECKS.map((c, i) => {
          const checked = done.includes(i);
          return (
            <label
              key={i}
              className={`flex cursor-pointer gap-3.5 rounded-xl border p-4 transition-all duration-200 ${
                checked ? "border-brand-200 bg-brand-50/60" : "border-ink-100 bg-white hover:border-brand-200"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(i)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-green-700"
              />
              <span>
                <span className={`block text-sm font-semibold ${checked ? "text-brand-900 line-through decoration-brand-300" : "text-ink-900"}`}>
                  {c.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500">{c.detail}</span>
              </span>
            </label>
          );
        })}
      </div>

      {portal && (
        <a
          href={portal}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex items-center justify-between rounded-xl bg-ink-950 px-5 py-4 text-white transition-all duration-200 hover:bg-brand-800"
        >
          <span>
            <span className="block text-sm font-semibold">Check this project on the {state} RERA portal</span>
            <span className="mt-0.5 block text-xs text-white/60">Official registration lookup, free to use</span>
          </span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
        This checklist is general guidance, not legal advice. Always engage an independent property lawyer for verification.
      </p>
    </div>
  );
}
