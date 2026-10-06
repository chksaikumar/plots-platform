import { createContext, useContext, useEffect, useState } from "react";
import { getListings } from "../lib/listings";

const ListingsContext = createContext({ listings: [], localities: {}, loading: true, error: null });

export function ListingsProvider({ children }) {
  const [state, setState] = useState({ listings: [], localities: {}, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    getListings().then((res) => {
      if (alive) setState({ listings: res.listings, localities: res.localities, error: res.error || null, loading: false });
    });
    return () => {
      alive = false;
    };
  }, []);

  return <ListingsContext.Provider value={state}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  return useContext(ListingsContext);
}
