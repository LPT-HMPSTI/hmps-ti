"use client";

import React, { createContext, useContext, useState } from "react";

interface DirectPortalContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const DirectPortalContext = createContext<DirectPortalContextType>({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const DirectPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <DirectPortalContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </DirectPortalContext.Provider>
  );
};

export const useDirectPortal = () => useContext(DirectPortalContext);
