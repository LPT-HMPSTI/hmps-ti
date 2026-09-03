"use client";

import React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface GalleryHeroProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

/**
 * Komponen header banner galeri dokumentasi foto kegiatan HMPSTI SWU.
 * Menyediakan fitur pencarian foto dengan kaca pembesar dan tombol-tombol pill kategori dinamis.
 */
export const GalleryHero: React.FC<GalleryHeroProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery = "",
  onSearchChange,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121520] p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
      <div className="relative z-10 space-y-3">
        <Badge variant="yellow" tilt="left">
          DOKUMENTASI FOTO
        </Badge>
        <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
          Galeri Kegiatan <span className="text-[#1DB954]">HMPSTI SWU</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-mono">
          Dokumentasi foto dan rekaman jejak kegiatan resmi HMPSTI STMIK Widya Utama.
        </p>

        {/* Search Bar & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari dokumentasi kegiatan..."
                className="w-full rounded-full border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-9 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
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
          )}

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#1DB954] text-black font-bold shadow-lg"
                    : "bg-white/[0.05] text-slate-300 border border-white/10 hover:bg-white/[0.1]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
