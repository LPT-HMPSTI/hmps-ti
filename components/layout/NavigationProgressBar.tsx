"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ProgressBarInner: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Selesai loading saat route berubah
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept klik internal link untuk langsung tampilkan progress bar (0ms visual feedback)
  useEffect(() => {
    let t1: NodeJS.Timeout | null = null;
    let t2: NodeJS.Timeout | null = null;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Abaikan eksternal link, anchor link (#), atau new tab
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank"
      ) {
        return;
      }

      // Jika URL tujuan berbeda dengan current pathname
      const currentPath = window.location.pathname;
      if (href !== currentPath && href !== window.location.pathname + window.location.search) {
        setIsVisible(true);
        setProgress(35);

        if (t1) clearTimeout(t1);
        if (t2) clearTimeout(t2);

        t1 = setTimeout(() => setProgress(70), 120);
        t2 = setTimeout(() => setProgress(88), 350);
      }
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#1DB954] via-[#00F2FE] to-[#1DB954] shadow-[0_0_12px_#1DB954] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
};

export const NavigationProgressBar: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
};
