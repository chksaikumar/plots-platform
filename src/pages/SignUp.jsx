import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthShell } from "./SignIn";

const inputCls =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-300 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function SignUp() {
  const { signUp, dbEnabled } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!dbEnabled) {
    return (
      <AuthShell title="Sign up unavailable" subtitle="Connect Firebase to enable accounts. See FIREBASE_SETUP.md.">
        <Link to="/" className="block rounded-xl bg-ink-950 px-4 py-3 text-center text-sm font-semibold text-white">Back home</Link>
      </AuthShell>
    );
  }

  const go = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await signUp(email, password);
      navigate("/");
    } catch (e) {
      setError(e.message?.replace("Firebase: ", "") || "Sign up failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Shortlist plots, sync across devices and track your enquiries.">
      <div className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className={inputCls} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" type="password" className={inputCls} onKeyDown={(e) => e.key === "Enter" && go()} />
        {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        <button onClick={go} disabled={busy || !email || !password} className="w-full rounded-xl bg-brand-700 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-800 disabled:opacity-40">
          {busy ? "Creating account..." : "Create account"}
        </button>
        <p className="pt-1 text-center text-xs text-ink-500">
          Already have an account? <Link to="/signin" className="font-semibold text-brand-700 hover:underline">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  );
}
