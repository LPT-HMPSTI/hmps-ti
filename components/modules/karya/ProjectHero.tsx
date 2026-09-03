"use client";

import React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface ProjectHeroProps {
  currentPeriod: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: string[];
}

/**
 * Banner header showcase karya inovasi mahasiswa TI SWU.
 * Menyediakan filter kategori dan pencarian kata kunci berdasarkan judul, teknologi, atau pembuat.
 */
export const ProjectHero: React.FC<ProjectHeroProps> = ({
  currentPeriod,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  filters,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121520] p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="cyan" tilt="left">
            KATALOG INOVASI & KARYA
          </Badge>
          <Badge variant="glass" tilt="right">
            PERIODE {currentPeriod}
          </Badge>
        </div>

        <h1 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
          Portal Karya <span className="text-[#1DB954]">Mahasiswa TI SWU</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Katalog showcase inovasi perangkat lunak, aplikasi mobile, kecerdasan buatan, dan proyek IoT karya mahasiswa Teknik Informatika STMIK Widya Utama.
        </p>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari judul karya, nama pembuat, atau teknologi..."
              className="w-full rounded-full border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-9 text-xs font-mono text-white placeholder-slate-400 backdrop-blur-md focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
            />
            <Search size={18} strokeWidth={2.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono z-10 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onFilterChange(f)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-[#1DB954] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                    : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
