import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Home from "./Home";
import Playlist from "./Playlist";
import Upload from "./Upload";
import History from "./History";
import About from "./About";
import Auth from "./Auth";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is on auth page and is already logged in, redirect to home
  if (user && location.pathname === "/auth") {
    return <Navigate to="/" replace />;
  }

  // Auth page doesn't need sidebar
  if (location.pathname === "/auth") {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
};

export default Index;
