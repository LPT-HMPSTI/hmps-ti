"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

export interface AdminHeaderProps {
  onLogout?: () => void;
}

/**
 * Banner header konsol backoffice Admin HMPSTI SWU.
 */
export const AdminHeader: React.FC<AdminHeaderProps> = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121520] p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-1.5 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-hmpsti.webp" alt="Logo HMPSTI" className="h-full w-full object-contain" />
            </div>
            <Badge variant="spotify" tilt="left">
              ADMIN CMS CONSOLE
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
            Control Center <span className="text-[#1DB954]">HMPSTI SWU</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kelola informasi penting, struktur divisi, direktori keanggotaan, berita, karya mahasiswa, visi misi, galeri, dan aspirasi secara real-time.
          </p>
        </div>
      </div>
    </div>
  );
};
