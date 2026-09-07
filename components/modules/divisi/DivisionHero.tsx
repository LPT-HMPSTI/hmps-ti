"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Heart,
  Share2,
  MoreHorizontal,
  CheckCircle,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  Disc,
  ArrowLeft,
} from "lucide-react";
import { DivisionMember } from "@/types";
import { OrgSocialButtons } from "@/components/modules/struktur/OrgSocialButtons";

export interface DivisionMeta {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  desc: string;
}

export interface DivisionHeroProps {
  division: DivisionMeta;
  members: DivisionMember[];
  currentPeriod: string;
  isLikedHero: boolean;
  onToggleLikeHero: () => void;
  activeLeader: DivisionMember | null;
  activeLeaderIndex: number;
  setActiveLeaderIndex: (index: number) => void;
  isPlayingHero: boolean;
  setIsPlayingHero: (playing: boolean) => void;
  officersCount: number;
  prokerCount: number;
  completionRate: number;
  onScrollToSection: (id: string) => void;
}

const divisionList = [
  { slug: "bph", name: "BPH" },
  { slug: "psdm", name: "PSDM" },
  { slug: "lpt", name: "LPT" },
  { slug: "kwu", name: "KWU" },
  { slug: "medkominfo", name: "MEDKOMINFO" },
  { slug: "humas", name: "HUMAS" },
];

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

/**
 * Hero Section Divisi dengan gaya Spotify Dual Leadership Carousel,
 * identik dengan halaman Struktur Organisasi (/struktur).
 */
export const DivisionHero: React.FC<DivisionHeroProps> = ({
  division,
  members,
  currentPeriod,
  isLikedHero,
  onToggleLikeHero,
  activeLeader,
  activeLeaderIndex,
  setActiveLeaderIndex,
  isPlayingHero,
  setIsPlayingHero,
  officersCount,
  prokerCount,
  completionRate,
  onScrollToSection,
}) => {
  const [isShuffleHero, setIsShuffleHero] = useState<boolean>(true);
  const [isRepeatHero, setIsRepeatHero] = useState<boolean>(false);
  const [reactionBadge, setReactionBadge] = useState<string | null>(null);

  // Top 2 Leaders of this division
  const isBph = division.slug.toLowerCase() === "bph";

  const leader1 = members.find((m) => {
    const r = (m.role || "").toLowerCase();
    return (r.includes("ketua") || r.includes("koordinator")) && !r.includes("wakil");
  }) || members[0];

  const leader2 = members.find((m) => {
    const r = (m.role || "").toLowerCase();
    return r.includes("wakil") || r.includes("sekretaris");
  }) || (members.length > 1 ? members[1] : members[0]);

  const currentLeader = activeLeader || (activeLeaderIndex === 0 ? leader1 : leader2) || members[0];

  const triggerReaction = (badgeText: string) => {
    setReactionBadge(badgeText);
    setTimeout(() => {
      setReactionBadge(null), 2500;
    });
  };

  const handleShareClick = () => {
    triggerReaction(";) Shared!");
  };

  const handleMoreClick = () => {
    triggerReaction(`:D ${division.short} SWU!`);
  };

  const handleToggleShuffle = () => {
    const next = !isShuffleHero;
    setIsShuffleHero(next);
    triggerReaction(next ? ":) Shuffle ON" : ":( Shuffle OFF");
  };

  const handleToggleRepeat = () => {
    const next = !isRepeatHero;
    setIsRepeatHero(next);
    triggerReaction(next ? ";) Repeat ON" : ":( Repeat OFF");
  };

  return (
    <section
      id="hero-leadership"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1DB954]/25 via-[#121212] to-[#121212] p-6 sm:p-10 border border-white/15 shadow-2xl space-y-8 scroll-mt-36 sm:scroll-mt-40"
    >
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#1DB954]/15 blur-3xl pointer-events-none" />

      {/* Top Bar: Navigasi Kembali & Switcher Divisi */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <Link
          href="/struktur"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} className="stroke-[2.5]" />
          <span>Struktur Organisasi</span>
        </Link>

        {/* Division Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 uppercase mr-1 whitespace-nowrap">
            Divisi:
          </span>
          {divisionList.map((item) => {
            const isActive = item.slug === division.slug;
            return (
              <Link key={item.slug} href={`/divisi/${item.slug}`}>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? "bg-[#1DB954] text-black border-black shadow-[2px_2px_0px_0px_#000000] scale-105"
                      : "bg-white/[0.04] text-slate-300 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ALBUM HEADER DETAILS (DUAL SPOTLIGHT IDENTIK DENGAN /STRUKTUR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
        {/* DUAL ALBUM COVER ARTWORK */}
        <div className="lg:col-span-5 flex justify-center sm:justify-start gap-4 sm:gap-6 relative">
          {/* LEADER 1 COVER */}
          <div
            onClick={() => setActiveLeaderIndex(0)}
            className="relative group cursor-pointer"
          >
            <div
              className={`relative aspect-square w-40 sm:w-48 rounded-2xl overflow-hidden shadow-2xl bg-black transition-all duration-500 ${
                activeLeaderIndex === 0
                  ? "scale-105 border-4 border-[#1DB954] shadow-[0_0_30px_rgba(29,185,84,0.5)] opacity-100 z-20"
                  : "scale-95 border-2 border-white/20 opacity-40 grayscale hover:grayscale-0 hover:opacity-75 z-10"
              }`}
            >
              <img
                src={leader1?.avatar || PLACEHOLDER_IMAGE}
                alt={leader1?.name}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span
                  className={`text-[9px] font-mono font-extrabold uppercase tracking-wider block ${
                    activeLeaderIndex === 0 ? "text-[#1DB954]" : "text-slate-400"
                  }`}
                >
                  {isBph ? "KETUA UMUM" : "KOORDINATOR"} {activeLeaderIndex !== 0 && "(Klik)"}
                </span>
                <h4 className="text-xs font-black text-white truncate">{leader1?.name}</h4>
              </div>
            </div>

            {/* Spinning Vinyl Accent Behind Active Cover */}
            {activeLeaderIndex === 0 && (
              <div
                className={`absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-950 shadow-2xl -z-10 flex items-center justify-center ${
                  isPlayingHero ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "10s" }}
              >
                <div className="w-10 h-10 rounded-full bg-[#1DB954] border-2 border-black flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black" />
                </div>
              </div>
            )}
          </div>

          {/* LEADER 2 COVER */}
          <div
            onClick={() => setActiveLeaderIndex(1)}
            className="relative group cursor-pointer mt-4 sm:mt-6"
          >
            <div
              className={`relative aspect-square w-36 sm:w-44 rounded-2xl overflow-hidden shadow-2xl bg-black transition-all duration-500 ${
                activeLeaderIndex === 1
                  ? "scale-105 border-4 border-cyan-400 shadow-[0_0_30px_rgba(0,242,254,0.5)] opacity-100 z-20"
                  : "scale-95 border-2 border-white/20 opacity-40 grayscale hover:grayscale-0 hover:opacity-75 z-10"
              }`}
            >
              <img
                src={leader2?.avatar || PLACEHOLDER_IMAGE}
                alt={leader2?.name}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <span
                  className={`text-[9px] font-mono font-extrabold uppercase tracking-wider block ${
                    activeLeaderIndex === 1 ? "text-cyan-300" : "text-slate-400"
                  }`}
                >
                  {isBph ? "WAKIL KETUA" : "WAKIL / SEKRETARIS"} {activeLeaderIndex !== 1 && "(Klik)"}
                </span>
                <h4 className="text-xs font-black text-white truncate">{leader2?.name}</h4>
              </div>
            </div>

            {/* Spinning Vinyl Accent Behind Active Cover */}
            {activeLeaderIndex === 1 && (
              <div
                className={`absolute -right-4 top-1/2 -translate-y-1/2 w-30 h-30 rounded-full bg-slate-900 border-4 border-slate-950 shadow-2xl -z-10 flex items-center justify-center ${
                  isPlayingHero ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "10s" }}
              >
                <div className="w-10 h-10 rounded-full bg-cyan-400 border-2 border-black flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC HERO METADATA */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLeaderIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Leader Badge */}
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 border-2 border-black font-mono text-xs font-extrabold px-3 py-1 rounded-md shadow-[2.5px_2.5px_0px_0px_#000000] uppercase tracking-wider transition-all duration-200 cursor-pointer hover:rotate-0 hover:scale-105 ${
                    activeLeaderIndex === 0
                      ? "bg-[#1DB954] text-black -rotate-2"
                      : "bg-cyan-400 text-black rotate-2"
                  }`}
                >
                  <CheckCircle size={14} className="fill-black text-white" />
                  {activeLeaderIndex === 0
                    ? isBph ? "This is Our Leader" : "Koordinator Divisi"
                    : isBph ? "This is Our Co-Leader" : "Wakil / Pengurus Inti"}
                </span>
              </div>

              {/* Leader Name */}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none">
                {currentLeader?.name}
              </h1>

              {/* Leader Role, NIM & Social Links */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-slate-300">
                <span className="text-[#1DB954] font-extrabold">{currentLeader?.role}</span>
                <span>•</span>
                <span>
                  NIM: <strong className="text-white">{currentLeader?.nim || "STI2023"}</strong>
                </span>

                {currentLeader && (
                  <div className="ml-2">
                    <OrgSocialButtons member={currentLeader} />
                  </div>
                )}
              </div>

              {/* Division Narrative */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-sans pt-1">
                {division.desc}
              </p>

              {/* Metadata Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 border-t border-white/10 pt-3">
                <span className="text-white font-bold">{division.name}</span>
                <span>•</span>
                <span className="text-[#1DB954] font-bold">Periode {currentPeriod}</span>
                <span>•</span>
                <span>{officersCount} Pengurus</span>
                <span>•</span>
                <span>{prokerCount} Program Kerja</span>
                <span>•</span>
                <span className="text-[#1DB954] font-bold">{completionRate}% Selesai</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* SPOTIFY CONTROLS BAR WITH REACTION BADGES */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6 relative z-10">
        <div className="flex items-center gap-4 relative">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlayingHero(!isPlayingHero)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Play/Pause Hero"
          >
            {isPlayingHero ? (
              <Pause size={20} className="fill-black" />
            ) : (
              <Play size={20} className="fill-black ml-0.5" />
            )}
          </button>

          {/* Toggle Leader Prev / Next Buttons */}
          <button
            type="button"
            onClick={() => setActiveLeaderIndex(activeLeaderIndex === 0 ? 1 : 0)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            title="Pimpin sebelumnya"
          >
            <SkipBack size={20} />
          </button>
          <button
            type="button"
            onClick={() => setActiveLeaderIndex(activeLeaderIndex === 0 ? 1 : 0)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            title="Pimpin berikutnya"
          >
            <SkipForward size={20} />
          </button>

          {/* Shuffle Toggle */}
          <button
            type="button"
            onClick={handleToggleShuffle}
            className={`transition-colors cursor-pointer p-1 ${
              isShuffleHero ? "text-[#1DB954]" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Mode Acak Pimpinan"
          >
            <Shuffle size={18} />
          </button>

          {/* Repeat Toggle */}
          <button
            type="button"
            onClick={handleToggleRepeat}
            className={`transition-colors cursor-pointer p-1 ${
              isRepeatHero ? "text-[#1DB954]" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Ulangi Putaran Pimpinan"
          >
            <Repeat size={18} />
          </button>

          {/* Heart / Like Button */}
          <button
            type="button"
            onClick={onToggleLikeHero}
            className="transition-transform active:scale-125 cursor-pointer ml-1 text-slate-400 hover:text-white p-1"
            title="Sukai Profil Pimpinan"
          >
            <Heart
              size={22}
              className={`transition-colors ${
                isLikedHero ? "text-[#FF007F] fill-[#FF007F]" : ""
              }`}
            />
          </button>

          {/* Animated Reusable Reaction Pill */}
          <AnimatePresence>
            {reactionBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute -top-10 left-36 bg-[#1DB954] text-black font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-black shadow-[2px_2px_0px_0px_#000000] pointer-events-none whitespace-nowrap z-30"
              >
                {reactionBadge}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            title="Bagikan Profil"
          >
            <Share2 size={18} />
          </button>

          {/* More Options Button */}
          <button
            type="button"
            onClick={handleMoreClick}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            title="Opsi Lainnya"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Anchor Buttons to Lineup and Tracklist */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onScrollToSection("pengurus-section")}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
          >
            Lineup Pengurus ({officersCount})
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection("proker-section")}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#1DB954] border border-black text-black hover:bg-[#1ed760] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000]"
          >
            Program Kerja ({prokerCount})
          </button>
        </div>
      </div>
    </section>
  );
};
