import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import DonationPage from "./pages/DonationPage";
import EventsPage from "./pages/EventsPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PravachanPage from "./pages/PravachanPage";
import VolunteerPage from "./pages/VolunteerPage";

export type Page =
  | "home"
  | "about"
  | "pravachan"
  | "events"
  | "donation"
  | "gallery"
  | "contact"
  | "volunteer"
  | "admin";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const [page, setPage] = useState<Page>("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);

  useEffect(() => {
    if (!actor || !identity) return;
    setCheckingUser(true);
    Promise.all([actor.isCallerAdmin(), actor.getCallerUserProfile()])
      .then(([admin, profile]) => {
        setIsAdmin(admin);
        setIsRegistered(!!profile);
      })
      .catch(() => {})
      .finally(() => setCheckingUser(false));
  }, [actor, identity]);

  if (isInitializing || checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-4">🕉️</div>
          <p className="text-muted-foreground">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <LoginPage
        onRegistered={() => setIsRegistered(true)}
        actor={actor}
        setPage={setPage}
      />
    );
  }

  if (!isRegistered && !isAdmin) {
    return (
      <LoginPage
        onRegistered={() => setIsRegistered(true)}
        actor={actor}
        setPage={setPage}
        showRegisterOnly
      />
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} actor={actor} isAdmin={isAdmin} />;
      case "about":
        return <AboutPage />;
      case "pravachan":
        return <PravachanPage actor={actor} />;
      case "events":
        return <EventsPage actor={actor} />;
      case "donation":
        return <DonationPage actor={actor} />;
      case "gallery":
        return <GalleryPage actor={actor} />;
      case "contact":
        return <ContactPage />;
      case "volunteer":
        return <VolunteerPage actor={actor} />;
      case "admin":
        return isAdmin ? (
          <AdminPage actor={actor} />
        ) : (
          <HomePage setPage={setPage} actor={actor} isAdmin={isAdmin} />
        );
      default:
        return <HomePage setPage={setPage} actor={actor} isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header page={page} setPage={setPage} isAdmin={isAdmin} />
      <main>{renderPage()}</main>
      <BottomNav page={page} setPage={setPage} />
      <Toaster />
    </div>
  );
}
