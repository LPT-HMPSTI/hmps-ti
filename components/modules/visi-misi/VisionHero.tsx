"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

export interface VisionHeroProps {
  currentPeriod: string;
}

/**
 * Header minimal atas halaman Visi & Misi HMPSTI SWU.
 */
export const VisionHero: React.FC<VisionHeroProps> = ({ currentPeriod }) => {
  return (
    <div className="space-y-3 pt-2 border-b border-white/10 pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="spotify" tilt="left">
          LANDASAN STRATEGIS
        </Badge>
        <span className="text-xs font-mono font-bold text-[#1DB954]">
          STMIK WIDYA UTAMA PERIODE {currentPeriod}
        </span>
      </div>
      <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
        Visi & Misi Organisasi
      </h1>
    </div>
  );
};
