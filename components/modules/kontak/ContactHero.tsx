"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

export interface ContactHeroProps {
  currentPeriod: string;
}

/**
 * Banner header editorial halaman Kontak & Aspirasi Mahasiswa HMPSTI SWU.
 */
export const ContactHero: React.FC<ContactHeroProps> = ({ currentPeriod }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121520] p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
      <div className="relative z-10 space-y-3">
        <Badge variant="magenta" tilt="left">
          KONTAK & ASPIRASI {currentPeriod}
        </Badge>
        <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
          Kontak & <span className="text-[#1DB954]">Aspirasi Mahasiswa</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-mono">
          Sampaikan masukan, kritik, maupun aspirasi Anda secara terbuka atau anonim untuk kemajuan HMPSTI STMIK Widya Utama.
        </p>
      </div>
    </div>
  );
};
