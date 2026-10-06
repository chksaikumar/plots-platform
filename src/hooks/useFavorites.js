import { useCallback, useEffect, useRef, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const KEY = "plotscape-favorites";

function readLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Favorites: synced to Firestore when signed in, localStorage for guests.
export function useFavorites() {
  const { user, dbEnabled } = useAuth();
  const [favorites, setFavorites] = useState(() => readLocal());
  const loadedFor = useRef(null);

  // Load the right source when the auth state changes.
  useEffect(() => {
    if (dbEnabled && user && db) {
      if (loadedFor.current === user.uid) return;
      loadedFor.current = user.uid;
      (async () => {
        try {
          const snap = await getDocs(collection(db, "favorites", user.uid, "items"));
          const ids = snap.docs.map((d) => d.data().listingId || d.id);
          // Merge any guest favorites made before sign-in.
          const local = readLocal();
          const merged = [...new Set([...ids, ...local])];
          for (const id of local) {
            if (!ids.includes(id)) {
              await setDoc(doc(db, "favorites", user.uid, "items", id), {
                listingId: id,
                createdAt: serverTimestamp(),
              });
            }
          }
          setFavorites(merged);
          localStorage.removeItem(KEY);
        } catch {
          setFavorites(readLocal());
        }
      })();
    } else {
      if (loadedFor.current !== "guest") {
        loadedFor.current = "guest";
        setFavorites(readLocal());
      }
    }
  }, [user, dbEnabled]);

  // Persist guest favorites locally.
  useEffect(() => {
    if (!dbEnabled || !user) {
      try {
        localStorage.setItem(KEY, JSON.stringify(favorites));
      } catch {
        // ignore
      }
    }
  }, [favorites, user, dbEnabled]);

  const toggle = useCallback(
    async (id) => {
      const removing = favorites.includes(id);
      setFavorites((prev) => (removing ? prev.filter((f) => f !== id) : [...prev, id]));
      if (dbEnabled && user && db) {
        try {
          const ref = doc(db, "favorites", user.uid, "items", id);
          if (removing) {
            await deleteDoc(ref);
          } else {
            await setDoc(ref, { listingId: id, createdAt: serverTimestamp() });
          }
        } catch {
          // optimistic UI already updated; a refresh will reconcile
        }
      }
    },
    [favorites, user, dbEnabled]
  );

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);
  const clear = useCallback(async () => {
    const ids = favorites;
    setFavorites([]);
    if (dbEnabled && user && db && ids.length > 0) {
      try {
        await Promise.all(ids.map((id) => deleteDoc(doc(db, "favorites", user.uid, "items", id))));
      } catch {
        // a refresh will reconcile
      }
    } else {
      try {
        localStorage.removeItem(KEY);
      } catch {
        // ignore
      }
    }
  }, [favorites, user, dbEnabled]);

  return { favorites, toggle, isFavorite, clear, count: favorites.length };
}
