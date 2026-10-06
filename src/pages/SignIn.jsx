import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

function GoogleButton({ onClick, disabled, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5 text-sm font-semibold text-ink-800 shadow-card transition-all duration-200 hover:border-ink-300 hover:shadow-card-hover disabled:opacity-50"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 01-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0012 24z" />
        <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 014.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 000 10.76l3.98-3.1z" />
        <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42A11.98 11.98 0 0012 0 12 12 0 001.29 6.62l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
      </svg>
      {label}
    </button>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink-100 sm:p-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 font-display text-lg font-bold text-white">P</span>
          <span className="font-display text-xl font-semibold text-ink-950">Plot<span className="text-brand-700">Scape</span></span>
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink-950">{title}</h1>
        <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default function SignIn() {
  const { signIn, signInWithGoogle, dbEnabled } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!dbEnabled) {
    return (
      <AuthShell title="Sign in unavailable" subtitle="Connect Firebase to enable accounts. See FIREBASE_SETUP.md.">
        <Link to="/" className="block rounded-xl bg-ink-950 px-4 py-3 text-center text-sm font-semibold text-white">Back home</Link>
      </AuthShell>
    );
  }

  const go = async (fn) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      navigate("/");
    } catch (e) {
      setError(e.message?.replace("Firebase: ", "") || "Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to sync your shortlist and track enquiries.">
      <div className="space-y-3">
        <GoogleButton onClick={() => go(signInWithGoogle)} disabled={busy} label={busy ? "Signing in..." : "Continue with Google"} />
        <div className="flex items-center gap-3 py-1 text-xs text-ink-300">
          <span className="h-px flex-1 bg-ink-100" /> or <span className="h-px flex-1 bg-ink-100" />
        </div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className={inputCls} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className={inputCls} onKeyDown={(e) => e.key === "Enter" && go(() => signIn(email, password))} />
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        <button onClick={() => go(() => signIn(email, password))} disabled={busy || !email || !password} className="w-full rounded-xl bg-brand-700 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-40">
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="pt-1 text-center text-xs text-ink-500">
          New here? <Link to="/signup" className="font-semibold text-brand-700 hover:underline">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  );
}
