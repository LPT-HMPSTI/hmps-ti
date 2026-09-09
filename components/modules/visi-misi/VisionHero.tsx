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
    <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2 w-full">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Badge variant="spotify" tilt="left">
          LANDASAN STRATEGIS
        </Badge>
        <Badge variant="yellow" tilt="right">
          PERIODE {currentPeriod}
        </Badge>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
        Visi & Misi Organisasi
      </h1>

      <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-xl leading-relaxed">
        Komitmen arah gerak, fondasi filosofis, dan manifesto perjuangan Himpunan Mahasiswa Program Studi Teknik Informatika STMIK Widya Utama.
      </p>
    </div>
  );
};
