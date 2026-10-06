import { Link, NavLink, useLocation } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Explore Map" },
  { to: "/ventures", label: "Ventures" },
  { to: "/compare", label: "Compare" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count } = useFavorites();
  const { isSignedIn, isAdmin, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-[1000] border-b border-ink-100 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 font-display text-lg font-bold text-white shadow-card">
            P
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink-950">
            Plot<span className="text-brand-700">Scape</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-950"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/shortlist"
            className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
              location.pathname === "/shortlist"
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-ink-100 bg-white text-ink-600 hover:border-brand-200 hover:text-brand-700"
            }`}
            aria-label="Shortlist"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill={count > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/map"
            className="hidden rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-800 hover:shadow-card-hover sm:inline-flex"
          >
            Find Plots
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`hidden rounded-full px-4 py-2.5 text-sm font-semibold transition-all sm:inline-flex ${
                location.pathname === "/admin"
                  ? "bg-ink-950 text-white"
                  : "border border-ink-200 text-ink-700 hover:border-ink-950"
              }`}
            >
              Admin
            </Link>
          )}
          {isSignedIn ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                to="/account"
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink-700 transition-all hover:bg-ink-50"
              >
                Account
              </Link>
              <button
                onClick={signOut}
                className="rounded-full px-3 py-2.5 text-sm font-medium text-ink-400 transition-all hover:text-ink-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="hidden rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-all hover:border-brand-400 hover:text-brand-800 sm:inline-flex"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-ink-100 px-3 py-2 md:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-800" : "text-ink-600"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/shortlist" className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-ink-600">
          Shortlist{count > 0 ? ` (${count})` : ""}
        </Link>
      </nav>
    </header>
  );
}
