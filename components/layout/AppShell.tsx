"use client";

import React, { Suspense } from "react";
import { LenisProvider } from "./LenisProvider";
import { NavigationProgressBar } from "./NavigationProgressBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomPlayerBar } from "./BottomPlayerBar";
import { DirectLinkDrawer } from "./DirectLinkDrawer";
import { DirectPortalProvider, useDirectPortal } from "./DirectPortalContext";
import { RadarSyncProvider } from "./RadarSyncContext";
import { PageTransitionLoader } from "@/components/ui/PageTransitionLoader";

const ShellContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, openDrawer, closeDrawer } = useDirectPortal();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B0D14] text-[#FFFFFF] antialiased">
      {/* Global Page Transition Loading Overlay */}
      <Suspense fallback={null}>
        <PageTransitionLoader />
      </Suspense>

      {/* Laser Top Navigation Progress Bar */}
      <NavigationProgressBar />

      {/* Top Navbar */}
      <Navbar onOpenDirectLink={openDrawer} />

      {/* Scrollable Main Content */}
      <main className="flex-1 pb-28">{children}</main>

      <Footer />

      {/* Spotify Sticky Bottom Academic Player Dock */}
      <BottomPlayerBar onOpenDirectLink={openDrawer} />

      {/* Modul 10 Direct Link Drawer */}
      <DirectLinkDrawer isOpen={isOpen} onClose={closeDrawer} />
    </div>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LenisProvider>
      <DirectPortalProvider>
        <RadarSyncProvider>
          <ShellContent>{children}</ShellContent>
        </RadarSyncProvider>
      </DirectPortalProvider>
    </LenisProvider>
  );
};
