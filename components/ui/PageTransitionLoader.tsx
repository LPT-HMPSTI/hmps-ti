"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/**
 * PageTransitionLoader — Overlay loading untuk navigasi client-side.
 *
 * Muncul sebagai full-screen overlay dengan LoadingSpinner ketika terjadi
 * pergantian route (pathname atau searchParams berubah). Auto-dismiss setelah
 * render selesai. Ditaruh di dalam AppShell agar selalu aktif secara global.
 */
export const PageTransitionLoader: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Simpan referensi URL sebelumnya
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    const currentUrl = pathname + searchParams.toString();

    if (prevUrl.current === null) {
      // Kunjungan pertama — jangan tampilkan overlay
      prevUrl.current = currentUrl;
      return;
    }

    if (prevUrl.current !== currentUrl) {
      // URL berubah — mulai loading
      setIsLoading(true);
      prevUrl.current = currentUrl;

      // Setelah DOM dirender, matikan loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0D14]/90 backdrop-blur-sm"
      aria-live="polite"
      aria-label="Memuat halaman"
    >
      <LoadingSpinner size={200} label="Memuat Halaman HMPS-TI SWU..." />
    </div>
  );
};
