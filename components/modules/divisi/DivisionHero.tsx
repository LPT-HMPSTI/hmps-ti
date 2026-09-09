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
  ArrowLeft,
  Camera,
  X,
} from "lucide-react";
import { DivisionMember } from "@/types";
import { OrgSocialButtons } from "@/components/modules/struktur/OrgSocialButtons";

export interface DivisionMeta {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  desc: string;
  groupPhotoUrl?: string;
  themeColor?: string;
  badge?: string;
  photoStory?: string;
  coreValues?: string[];
  sessionLocation?: string;
  photoQuote?: string;
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

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

const DEFAULT_GROUP_PHOTO =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop";

/**
 * Hero Section Divisi Organisasi HMPSTI STMIK Widya Utama.
 * - Untuk BPH: Menggunakan Dual Leadership Carousel (Ketua Umum & Wakil Ketua).
 * - Untuk PSDM, LPT, MEDKOMINFO, KWU, HUMAS: Menggunakan Single-Album Spotify Header
 *   (Cover album Koordinator tunggal, piringan vinyl, identitas koordinator, dan background foto bersama divisi yang transparan).
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
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  // Kunci scrolling halaman utama saat modal foto bersama terbuka
  useEffect(() => {
    if (isPhotoModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isPhotoModalOpen]);

  const isBph = division.slug.toLowerCase() === "bph";
  const themeColor = division.themeColor || "#1DB954";
  const groupPhoto = division.groupPhotoUrl || DEFAULT_GROUP_PHOTO;

  // Leaders / Koordinator calculation
  const leader1 = members.find((m) => {
    const r = (m.role || "").toLowerCase();
    return (
      (r.includes("ketua") || r.includes("koordinator") || r.includes("kadiv")) &&
      !r.includes("wakil")
    );
  }) || members[0];

  const leader2 =
    members.find((m) => {
      const r = (m.role || "").toLowerCase();
      return r.includes("wakil") && !r.includes("ahli");
    }) ||
    members.find((m) => {
      const r = (m.role || "").toLowerCase();
      return r.includes("sekretaris");
    }) ||
    (members.length > 1 ? members[1] : members[0]);

  // For non-BPH divisions: there is exactly ONE Koordinator
  const koordinator = activeLeader || leader1 || members[0];
  const currentLeader = isBph
    ? activeLeaderIndex === 0
      ? leader1
      : leader2
    : koordinator;

  const triggerReaction = (badgeText: string) => {
    setReactionBadge(badgeText);
    setTimeout(() => {
      setReactionBadge(null);
    }, 2500);
  };

  const handleShareClick = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    triggerReaction("Tautan Disalin!");
  };

  const handleMoreClick = () => {
    triggerReaction(`${division.short} HMPSTI SWU!`);
  };

  const handleToggleShuffle = () => {
    const next = !isShuffleHero;
    setIsShuffleHero(next);
    triggerReaction(next ? "Shuffle ON" : "Shuffle OFF");
  };

  const handleToggleRepeat = () => {
    const next = !isRepeatHero;
    setIsRepeatHero(next);
    triggerReaction(next ? "Repeat ON" : "Repeat OFF");
  };

  return (
    <section
      id="hero-leadership"
      className="relative overflow-hidden rounded-3xl bg-[#121212] p-6 sm:p-10 border border-white/15 shadow-2xl space-y-8 scroll-mt-36 sm:scroll-mt-40 group/hero"
    >
      {/* 1. BACKGROUND FOTO BERSAMA DIVISI (COVER ALBUM SPOTIFY DENGAN GRADIEN TRANSPARAN) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={groupPhoto}
          alt={`Foto Bersama Divisi ${division.name}`}
          className="w-full h-full object-cover object-center sm:object-[center_35%] opacity-45 sm:opacity-60 filter saturate-115 contrast-105 scale-100 group-hover/hero:scale-105 transition-all duration-1000 ease-out"
        />
        {/* Spotify Asymmetric Gradient: deep solid dark on the left for text contrast, open transparency on the right to reveal group members */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/85 lg:via-[#121212]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

        {/* Ambient Glow Accent */}
        <div
          className="absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: themeColor }}
        />
      </div>

      {/* 2. TOP BAR: NAVIGASI KEMBALI */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <Link
          href="/struktur"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Struktur Organisasi</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Periode {currentPeriod}
          </span>
        </div>
      </div>

      {/* 3. ALBUM HEADER HERO CONTENT */}
      {isBph ? (
        /* ==================== BPH DUAL LEADERSHIP CAROUSEL ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
          {/* Dual Album Cover Artwork */}
          <div className="lg:col-span-5 flex justify-center sm:justify-start gap-4 sm:gap-6 relative">
            {/* Leader 1 Cover */}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    KETUA UMUM {activeLeaderIndex !== 0 && "(Klik)"}
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

            {/* Leader 2 Cover */}
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    WAKIL KETUA {activeLeaderIndex !== 1 && "(Klik)"}
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

          {/* Dynamic Hero Metadata */}
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
                    className={`inline-flex items-center gap-1.5 border-2 border-black font-mono text-xs font-extrabold px-3 py-1 rounded-md shadow-[2.5px_2.5px_0px_0px_#000000] uppercase tracking-wider ${
                      activeLeaderIndex === 0
                        ? "bg-[#1DB954] text-black -rotate-1"
                        : "bg-cyan-400 text-black rotate-1"
                    }`}
                  >
                    <CheckCircle size={14} className="fill-black text-white" />
                    {activeLeaderIndex === 0 ? "Ketua Umum HMPSTI" : "Wakil Ketua Umum"}
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {division.short} SWU
                  </span>
                </div>

                {/* Leader Name */}
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none">
                  {currentLeader?.name}
                </h1>

                {/* Leader Role, NIM & Social Links */}
                <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-slate-300">
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
      ) : (
        /* ==================== SPOTIFY EDITORIAL BANNER LAYOUT (PSDM, LPT, MEDKOMINFO, KWU, HUMAS) ==================== */
        <div className="space-y-6 relative z-10 max-w-5xl py-2">
          {/* Top Tag / Album Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-black font-mono text-xs font-extrabold uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000]"
              style={{ backgroundColor: themeColor }}
            >
              <CheckCircle size={14} className="fill-black text-white" />
              Divisi Resmi HMPS-TI
            </span>
            <span className="text-xs font-mono text-slate-300 font-bold tracking-wider uppercase">
              HMPS-TI STMIK WIDYA UTAMA • {division.short}
            </span>
          </div>

          {/* Massive Division Album Title */}
          <div className="space-y-2.5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-lg">
              {division.name}
            </h1>
            <p className="text-base sm:text-lg font-bold text-slate-200 max-w-3xl leading-snug">
              {division.tagline}
            </p>
          </div>

          {/* Division Narrative */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
            {division.desc}
          </p>

          {/* METADATA RESMI & STATISTIK DIVISI */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 border-t border-white/10 text-xs sm:text-sm font-mono text-slate-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[#1DB954] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
              <span>Divisi {division.short}</span>
            </div>
            <span>•</span>
            <span className="text-[#1DB954] font-bold">Periode {currentPeriod}</span>
            <span>•</span>
            <span className="text-white font-bold">{officersCount} Anggota</span>
            <span>•</span>
            <span className="text-white font-bold">{prokerCount} Program Kerja</span>
            <span>•</span>
            <span className="text-[#1DB954] font-bold">{completionRate}% Selesai</span>
          </div>
        </div>
      )}

      {/* 4. SPOTIFY ACTION BAR (PLAY BUTTON, SHUFFLE, LIKE, SHARE, & ANCHOR NAVIGATION) */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {/* Main Spotify Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlayingHero(!isPlayingHero)}
            className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer hover:bg-[#1ed760]"
            aria-label="Play or pause hero disc"
            title={isPlayingHero ? "Jeda Sorotan Pimpinan" : "Putar Sorotan Pimpinan"}
          >
            {isPlayingHero ? (
              <Pause size={22} className="fill-black" />
            ) : (
              <Play size={22} className="fill-black ml-0.5" />
            )}
          </button>

          {/* Leader navigation (only relevant for BPH) */}
          {isBph && (
            <>
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
            </>
          )}

          {/* Shuffle Toggle */}
          <button
            type="button"
            onClick={handleToggleShuffle}
            className={`transition-colors cursor-pointer p-1.5 ${
              isShuffleHero ? "text-[#1DB954]" : "text-slate-500 hover:text-slate-300"
            }`}
            title="Mode Acak Pimpinan"
          >
            <Shuffle size={19} />
          </button>

          {/* Repeat Toggle (BPH only) */}
          {isBph && (
            <button
              type="button"
              onClick={handleToggleRepeat}
              className={`transition-colors cursor-pointer p-1.5 ${
                isRepeatHero ? "text-[#1DB954]" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Ulangi Putaran Pimpinan"
            >
              <Repeat size={19} />
            </button>
          )}

          {/* Heart / Like Icon with Counter (Identik dengan /struktur) */}
          <button
            type="button"
            onClick={() => {
              onToggleLikeHero();
              triggerReaction(!isLikedHero ? "Disukai!" : "Batal Suka");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-[#1DB954] hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
            aria-label="Sukai Divisi Ini"
            title="Sukai Divisi Ini"
          >
            <Heart size={18} className={isLikedHero ? "fill-[#1DB954] text-[#1DB954]" : ""} />
            <span className="text-xs font-mono font-bold text-white">
              {(activeLeader as any)?.likes_count ?? (isLikedHero ? 1 : 0)}{" "}
              <span className="hidden sm:inline font-normal text-slate-400">Suka</span>
            </span>
          </button>

          {/* Animated Reusable Reaction Toast Pill */}
          <AnimatePresence>
            {reactionBadge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="absolute -top-10 left-24 sm:left-36 bg-[#1DB954] text-black font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-black shadow-[2px_2px_0px_0px_#000000] pointer-events-none whitespace-nowrap z-30"
              >
                {reactionBadge}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5"
            title="Bagikan Tautan Divisi"
          >
            <Share2 size={19} />
          </button>

          {/* More Options Button */}
          <button
            type="button"
            onClick={handleMoreClick}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1.5"
            title="Opsi Lainnya"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Anchor Buttons to Foto Bersama, Lineup, and Tracklist */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/[0.06] border border-white/15 hover:bg-white/15 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
            title="Lihat Foto Bersama & Detail Divisi"
          >
            <Camera size={13} className="text-[#1DB954]" />
            <span>Foto Bersama</span>
          </button>
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

      {/* 5. MODAL PRATINJAU FOTO BERSAMA RESOLUSI PENUH */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div
            data-lenis-prevent
            className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 overscroll-contain"
            onClick={() => setIsPhotoModalOpen(false)}
          >
            <div className="min-h-full flex items-center justify-center py-4 sm:py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                onClick={(e) => e.stopPropagation()}
                data-lenis-prevent
                className="relative max-w-5xl w-full rounded-2xl sm:rounded-3xl bg-[#121212] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_10px_rgba(29,185,84,0.6)]"
                      style={{ backgroundColor: themeColor }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold tracking-wider text-[#1DB954] uppercase">
                          Foto Bersama
                        </span>
                        <span className="text-[11px] font-mono text-white/30">•</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          Periode {currentPeriod}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                        {division.name}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-3"
                    aria-label="Tutup foto bersama"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body: Photo & Member List */}
                <div className="p-5 sm:p-7 space-y-6">
                  {/* 1. Komponen Foto Bersama */}
                  <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={groupPhoto}
                      alt={`Foto Bersama Seluruh Anggota Divisi ${division.name}`}
                      className="w-full max-h-[70vh] object-contain"
                    />
                  </div>

                  {/* 2. Daftar Anggota Divisi */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        Daftar Anggota ({members.length})
                      </h4>
                      <span className="text-xs font-mono text-slate-400">
                        {division.short} • {currentPeriod}
                      </span>
                    </div>

                    {members.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {members.map((member, idx) => (
                          <div
                            key={member.id || idx}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                              {member.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                                  {member.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-sm font-semibold text-white truncate">
                                {member.name}
                              </h5>
                              <p className="text-xs text-slate-400 truncate font-mono">
                                {member.role || "Anggota"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        Belum ada data anggota untuk divisi ini.
                      </p>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between px-6 py-3.5 bg-white/[0.02] border-t border-white/10 text-xs font-mono text-slate-400 shrink-0">
                  <span>{division.name}</span>
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="px-5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
