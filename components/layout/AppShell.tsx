"use client";

import React from "react";
import { LenisProvider } from "./LenisProvider";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomPlayerBar } from "./BottomPlayerBar";
import { DirectLinkDrawer } from "./DirectLinkDrawer";
import { DirectPortalProvider, useDirectPortal } from "./DirectPortalContext";
import { RadarSyncProvider } from "./RadarSyncContext";

const ShellContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, openDrawer, closeDrawer } = useDirectPortal();

  return (
    <div className="relative flex min-h-screen bg-[#0B0D14] text-[#FFFFFF] antialiased">
      {/* Spotify Left Fixed Sidebar (Desktop) */}
      <Sidebar onOpenDirectLink={openDrawer} />

      {/* Main Right Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <Navbar onOpenDirectLink={openDrawer} />

        {/* Scrollable Center Canvas */}
        <main className="flex-1 pb-28">{children}</main>

        <Footer />
      </div>

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
