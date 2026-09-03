"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Play,
  Pause,
  Disc,
  Music,
  Sparkles,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SiteSettings } from "@/types";

export interface MemberHeroProps {
  settings: SiteSettings;
  filteredCount: number;
  totalLikes: number;
  isLikedPlaylist: boolean;
  onTogglePlaylistLike: () => void;
  playlistReactionBadge: string | null;
  activePlayingId: string | null;
  onTogglePlayFirst: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: "Semua" | "Pengurus Aktif" | "Alumni" | "Dosen Penanggung Jawab";
  onSelectCategory: (cat: "Semua" | "Pengurus Aktif" | "Alumni" | "Dosen Penanggung Jawab") => void;
  selectedCohort: string;
  onSelectCohort: (cohort: string) => void;
  cohorts: string[];
}

/**
 * Komponen header Hero direktori keanggotaan bertema album playlist Spotify.
 * Dilengkapi animasi piringan hitam vinyl, kontrol play sorotan, like playlist,
 * pencarian multi-field, dan filter kategori serta angkatan.
 */
export const MemberHero: React.FC<MemberHeroProps> = ({
  settings,
  filteredCount,
  totalLikes,
  isLikedPlaylist,
  onTogglePlaylistLike,
  playlistReactionBadge,
  activePlayingId,
  onTogglePlayFirst,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedCohort,
  onSelectCohort,
  cohorts,
}) => {
  const categories = [
    "Semua",
    "Pengurus Aktif",
    "Alumni",
    "Dosen Penanggung Jawab",
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#121520] via-[#0E1017] to-[#0A0C10] p-6 sm:p-9 backdrop-blur-2xl shadow-2xl">
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#1DB954]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center gap-6 sm:gap-10">
        {/* Authentic Spotify Vinyl Record & Cover Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="group relative shrink-0 pr-4 sm:pr-8"
        >
          {/* Realistic Vinyl Record */}
          <div className="absolute left-6 top-3 h-40 w-40 sm:h-48 sm:w-48 rounded-full border-4 border-black bg-[#0d0d0d] shadow-2xl flex items-center justify-center transition-all duration-700 ease-out group-hover:translate-x-8 group-hover:rotate-45">
            <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-full border border-white/10 flex items-center justify-center">
              <div className="h-30 w-30 sm:h-38 sm:w-38 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                <div className="h-24 w-24 sm:h-30 sm:w-30 rounded-full border border-white/5 flex items-center justify-center">
                  <div className="h-14 w-14 sm:h-18 sm:w-18 rounded-full border-2 border-black bg-gradient-to-br from-[#1DB954] via-[#0e6f33] to-[#053d1b] flex flex-col items-center justify-center shadow-inner">
                    <span className="text-[7px] sm:text-[8px] font-mono font-black text-black tracking-widest uppercase">
                      HMPSTI
                    </span>
                    <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-black border border-white/30 my-0.5" />
                    <span className="text-[5px] sm:text-[6px] font-mono font-bold text-black/80">
                      {settings.current_period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Album Square Front Cover */}
          <div className="relative z-10 h-44 w-44 sm:h-52 sm:w-52 rounded-2xl border-4 border-black bg-gradient-to-br from-[#1DB954] via-[#0c7a36] to-[#043315] p-4 shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <Badge
                variant="spotify"
                tilt="left"
                noDot
                className="bg-black text-[#1DB954] border-white/20 text-[9px] py-0.5"
              >
                MEMBER LIST
              </Badge>
              <Disc
                size={20}
                className="text-black/80 animate-spin"
                style={{ animationDuration: "12s" }}
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-black font-mono font-black text-[11px] uppercase tracking-wider">
                <Music size={13} />
                <span>HMPSTI {settings.current_period}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black leading-tight tracking-tight">
                MEMBER DIRECTORY
              </h2>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-black/20 text-[9px] font-mono font-bold text-black/90">
              <span>STMIK WIDYA UTAMA</span>
              <span>PERIODE {settings.current_period}</span>
            </div>
          </div>
        </motion.div>

        {/* Playlist Metadata & Details */}
        <div className="flex-1 space-y-3 text-center md:text-left w-full min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <Badge variant="spotify" tilt="left">
              MEMBER DIRECTORY
            </Badge>
            <Badge variant="glass" tilt="right">
              PERIODE {settings.current_period}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Direktori Anggota <span className="text-[#1DB954]">HMPSTI</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Daftar resmi pengurus aktif, alumni, dan dosen penanggung jawab program studi Teknik Informatika STMIK Widya Utama.
          </p>

          {/* Streamlined Stats Bar */}
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-slate-300 flex-wrap pt-0.5">
            <span className="font-bold text-white flex items-center gap-1">
              HMPSTI SWU
            </span>
            <span>•</span>
            <span className="text-[#1DB954] font-bold">{filteredCount} Anggota Terdaftar</span>
            <span>•</span>
            <span className="text-slate-400">Periode {settings.current_period}</span>
          </div>
        </div>
      </div>

      {/* Action Controls & Interactive Filter Toolbar */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Spotify Play/Pause Controller & Heart Like */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlayFirst}
            className="h-11 w-11 rounded-full border-2 border-black bg-[#1DB954] text-black shadow-[3px_3px_0px_0px_#000000] hover:scale-105 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center cursor-pointer"
            title={activePlayingId ? "Jeda Sorotan" : "Sorot Anggota"}
          >
            {activePlayingId ? (
              <Pause size={18} className="fill-black" />
            ) : (
              <Play size={18} className="fill-black ml-0.5" />
            )}
          </button>

          {/* Like Playlist Button with Floating Reaction Badge */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={onTogglePlaylistLike}
              className="flex items-center gap-2 text-slate-400 hover:text-[#1DB954] transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-white/[0.05] border border-white/10"
              title="Sukai Direktori Ini"
            >
              <Heart size={18} className={isLikedPlaylist ? "fill-[#1DB954] text-[#1DB954]" : ""} />
              <span className="text-xs font-mono font-bold text-white">
                {totalLikes} <span className="hidden sm:inline font-normal text-slate-400">Suka</span>
              </span>
            </button>

            <AnimatePresence>
              {playlistReactionBadge && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: 5 }}
                  animate={{ opacity: 1, scale: 1, x: 10 }}
                  exit={{ opacity: 0, scale: 0.8, x: 5 }}
                  className="absolute left-full whitespace-nowrap px-2.5 py-0.5 rounded-md border-2 border-black bg-[#1DB954] text-black font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000000]"
                >
                  {playlistReactionBadge}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama, NIM, atau jabatan..."
              className="w-full rounded-full border border-white/15 bg-white/[0.05] py-2 pl-10 pr-8 text-xs font-mono text-white placeholder-slate-400 backdrop-blur-md focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
            />
            <Search size={18} strokeWidth={2.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono z-10 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#1DB954] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                    : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Cohort Selector Bar */}
      <div className="relative z-10 mt-3.5 flex items-center gap-2 overflow-x-auto pb-0.5">
        <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
          <SlidersHorizontal size={12} /> Angkatan:
        </span>
        {cohorts.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => onSelectCohort(year)}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedCohort === year
                ? "bg-[#FFD700] text-black border border-black shadow-[1.5px_1.5px_0px_0px_#000000]"
                : "bg-white/[0.03] text-slate-300 border border-white/10 hover:bg-white/[0.07]"
            }`}
          >
            {year === "Semua" ? "Semua Angkatan" : `Angkatan ${year}`}
          </button>
        ))}
      </div>
    </div>
  );
};
