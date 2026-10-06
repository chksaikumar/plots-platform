import { createContext, useContext, useEffect, useState } from "react";
import { getListings } from "../lib/listings";

const ListingsContext = createContext({ listings: [], localities: {}, source: "sample", loading: true });

export function ListingsProvider({ children }) {
  const [state, setState] = useState({ listings: [], localities: {}, source: "sample", loading: true });

  useEffect(() => {
    let alive = true;
    getListings().then((res) => {
      if (alive) setState({ ...res, loading: false });
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
