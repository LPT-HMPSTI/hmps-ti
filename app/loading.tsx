import React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/**
 * Global Route Loading Screen untuk Next.js App Router.
 * Ditampilkan otomatis saat navigasi antar halaman (Suspense boundary).
 * Menggunakan LoadingSpinner premium berbasis logo HMPSTI.
 */
export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#0B0D14] flex items-center justify-center">
      <LoadingSpinner
        size={275}
        label="Memuat Halaman HMPS-TI SWU..."
      />
    </div>
  );
}

