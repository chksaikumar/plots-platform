import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isDbEnabled } from "../lib/firebase";

const AuthContext = createContext(null);

// Ensures a users/{uid} doc exists with a role. Defaults to 'user'.
// The first admin is promoted manually in the Firestore console.
async function ensureUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email || "",
      role: "user",
      createdAt: serverTimestamp(),
    });
    return "user";
  }
  return snap.data().role || "user";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(isDbEnabled);

  useEffect(() => {
    if (!isDbEnabled || !auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && db) {
        try {
          const r = await ensureUserDoc(u);
          setRole(r);
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Database not configured");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signUp = async (email, password) => {
    if (!auth) throw new Error("Database not configured");
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email, password) => {
    if (!auth) throw new Error("Database not configured");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (auth) await fbSignOut(auth);
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    isAdmin: role === "admin",
    isSignedIn: Boolean(user),
    dbEnabled: isDbEnabled,
    loading,
    signInWithGoogle,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
