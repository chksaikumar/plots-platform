import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 font-display text-lg font-bold text-white">
              P
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink-950">
              Plot<span className="text-brand-700">Scape</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">
            Discover verified open plots and premium ventures across India. Compare
            approvals, prices, plot sizes and developers on a live map, and make
            confident land buying decisions.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/map" className="text-ink-600 transition-colors hover:text-brand-700">Map Explorer</Link></li>
            <li><Link to="/ventures" className="text-ink-600 transition-colors hover:text-brand-700">Ventures</Link></li>
            <li><Link to="/compare" className="text-ink-600 transition-colors hover:text-brand-700">Compare Plots</Link></li>
            <li><Link to="/shortlist" className="text-ink-600 transition-colors hover:text-brand-700">My Shortlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/contact" className="text-ink-600 transition-colors hover:text-brand-700">Contact Us</Link></li>
            <li><span className="text-ink-400">List your venture with us</span></li>
            <li><span className="text-ink-400">Partner login</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-400 sm:flex-row sm:px-6">
          <span>PlotScape. Verified plots across India.</span>
          <span>Prices shown are indicative. Please verify approvals with the developer and state RERA portal.</span>
        </div>
      </div>
    </footer>
  );
}
