import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, MobileBottomNav } from "./Navbar";
import { Footer } from "./Footer";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { Disclaimer } from "../ui/Disclaimer";

export const AppShell: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-emerald-200">
      {!isOnline && <Disclaimer type="offline" className="sticky top-0 z-50" />}
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-24 md:pb-12">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
