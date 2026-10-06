import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ListingsProvider, useListings } from "./context/ListingsContext";
import { isDbEnabled } from "./lib/firebase";
import SetupScreen from "./components/SetupScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MapExplorer from "./pages/MapExplorer";
import PlotDetail from "./pages/PlotDetail";
import Ventures from "./pages/Ventures";
import Compare from "./pages/Compare";
import Shortlist from "./pages/Shortlist";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import Admin from "./pages/admin/Admin";

// Banner shown on every page when listings fail to load from Firestore.
function ListingsErrorNotice() {
  const { error, loading } = useListings();
  if (loading || !error) return null;
  return (
    <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
      {error}
    </div>
  );
}

export default function App() {
  // Firebase is the only data source. Without it, show only the setup screen.
  if (!isDbEnabled) {
    return <SetupScreen />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <ListingsProvider>
          <div className="flex min-h-screen flex-col bg-ink-50 font-sans text-ink-900 antialiased">
            <Navbar />
            <ListingsErrorNotice />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<MapExplorer />} />
                <Route path="/plot/:id" element={<PlotDetail />} />
                <Route path="/ventures" element={<Ventures />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/shortlist" element={<Shortlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ListingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
