"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { DivisionMember } from "@/types";
import { OrgSocialButtons } from "./OrgSocialButtons";

export interface OrgHeroLeadershipProps {
  ketua: DivisionMember;
  wakil: DivisionMember;
  currentPeriod: string;
  isLikedHero: boolean;
  onToggleLikeHero: () => void;
  activeLeader: DivisionMember;
  activeLeaderIndex: number;
  setActiveLeaderIndex: (index: number) => void;
  isPlayingHero: boolean;
  setIsPlayingHero: (playing: boolean) => void;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

/**
 * Komponen Hero Dual Leadership Spotlight bergaya album Spotify.
 * Menampilkan foto Ketua & Wakil berdampingan dengan piringan hitam (*vinyl*),
 * player controls interaktif, counter suka (like), dan badge reaksi emotikon.
 */
export const OrgHeroLeadership: React.FC<OrgHeroLeadershipProps> = ({
  ketua,
  wakil,
  currentPeriod,
  isLikedHero,
  onToggleLikeHero,
  activeLeader,
  activeLeaderIndex,
  setActiveLeaderIndex,
  isPlayingHero,
  setIsPlayingHero,
}) => {
  const [isShuffleHero, setIsShuffleHero] = useState<boolean>(true);
  const [isRepeatHero, setIsRepeatHero] = useState<boolean>(false);
  const [reactionBadge, setReactionBadge] = useState<string | null>(null);

  const triggerReaction = (badgeText: string) => {
    setReactionBadge(badgeText);
    setTimeout(() => {
      setReactionBadge(null);
    }, 2500);
  };

  const handleShareClick = () => {
    triggerReaction(";) Shared!");
  };

  const handleMoreClick = () => {
    triggerReaction(":D HMPSTI SWU!");
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

      {/* ALBUM HEADER DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
        {/* DUAL ALBUM COVER ARTWORK */}
        <div className="lg:col-span-5 flex justify-center sm:justify-start gap-4 sm:gap-6 relative">
          {/* KETUA UMUM ALBUM COVER */}
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
                src={ketua?.avatar || PLACEHOLDER_IMAGE}
                alt={ketua?.name}
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
                <h4 className="text-xs font-black text-white truncate">{ketua?.name}</h4>
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

          {/* WAKIL KETUA ALBUM COVER */}
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
                src={wakil?.avatar || PLACEHOLDER_IMAGE}
                alt={wakil?.name}
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
                <h4 className="text-xs font-black text-white truncate">{wakil?.name}</h4>
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
              {/* Neubrutalism Leader Badge */}
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 border-2 border-black font-mono text-xs font-extrabold px-3 py-1 rounded-md shadow-[2.5px_2.5px_0px_0px_#000000] uppercase tracking-wider transition-all duration-200 cursor-pointer hover:rotate-0 hover:scale-105 ${
                    activeLeaderIndex === 0
                      ? "bg-[#1DB954] text-black -rotate-2"
                      : "bg-cyan-400 text-black rotate-2"
                  }`}
                >
                  <CheckCircle size={14} className="fill-black text-white" />
                  {activeLeaderIndex === 0 ? "This is Our Leader" : "This is Our Co-Leader"}
                </span>
              </div>

              {/* Leader Name */}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none">
                {activeLeader.name}
              </h1>

              {/* Leader Role, NIM & Hero Social Links Icons */}
              <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-slate-300">
                <span className="text-[#1DB954] font-extrabold">{activeLeader.role}</span>
                <span>•</span>
                <span>
                  NIM: <strong className="text-white">{activeLeader.nim || "STI2023"}</strong>
                </span>

                <div className="ml-2">
                  <OrgSocialButtons member={activeLeader} />
                </div>
              </div>

              {/* Metadata Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 border-t border-white/10 pt-3">
                <span className="text-white font-bold">Kabinet HMPSTI SWU</span>
                <span>•</span>
                <span className="text-[#1DB954] font-bold">Periode {currentPeriod}</span>
                <span>•</span>
                <span>STMIK Widya Utama</span>
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
            {isPlayingHero ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-0.5" />}
          </button>

          {/* Skip Back (Ketua) */}
          <button
            type="button"
            onClick={() => setActiveLeaderIndex(0)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-[#1DB954] hover:text-black transition-all cursor-pointer"
            aria-label="Focus Ketua"
          >
            <SkipBack size={18} />
          </button>

          {/* Skip Forward (Wakil) */}
          <button
            type="button"
            onClick={() => setActiveLeaderIndex(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-[#1DB954] hover:text-black transition-all cursor-pointer"
            aria-label="Focus Wakil"
          >
            <SkipForward size={18} />
          </button>

          {/* Heart / Like Icon with Counter */}
          <button
            type="button"
            onClick={onToggleLikeHero}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-300 hover:text-[#1DB954] hover:bg-white/5 border border-white/10 transition-all cursor-pointer"
            aria-label="Like Hero"
          >
            <Heart size={18} className={isLikedHero ? "fill-[#1DB954] text-[#1DB954]" : ""} />
            <span className="text-xs font-mono font-bold text-white">
              {(activeLeader as any)?.likes_count ?? (isLikedHero ? 1 : 0)}{" "}
              <span className="hidden sm:inline font-normal text-slate-400">Suka</span>
            </span>
          </button>

          {/* Share Icon */}
          <button
            type="button"
            onClick={handleShareClick}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Share Reaction"
          >
            <Share2 size={18} />
          </button>

          {/* Options Icon */}
          <button
            type="button"
            onClick={handleMoreClick}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            aria-label="More Options Reaction"
          >
            <MoreHorizontal size={20} />
          </button>

          {/* Reaction Badge */}
          <AnimatePresence>
            {reactionBadge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: -5 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -5 }}
                className="px-3 py-1 rounded-md border-2 border-black bg-[#1DB954] text-black font-mono text-xs font-black shadow-[2.5px_2.5px_0px_0px_#000000] -rotate-1"
              >
                {reactionBadge}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Shuffle & Repeat Toggles */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <button
            type="button"
            onClick={handleToggleShuffle}
            className={`transition-colors cursor-pointer flex items-center gap-1 p-1.5 rounded hover:text-white ${
              isShuffleHero ? "text-[#1DB954]" : "text-slate-500"
            }`}
            title="Toggle Shuffle Mode"
          >
            <Shuffle size={16} />
          </button>

          <button
            type="button"
            onClick={handleToggleRepeat}
            className={`transition-colors cursor-pointer flex items-center gap-1 p-1.5 rounded hover:text-white ${
              isRepeatHero ? "text-[#1DB954]" : "text-slate-500"
            }`}
            title="Toggle Repeat Mode"
          >
            <Repeat size={16} />
          </button>

          <span>25s Cycle</span>
        </div>
      </div>
    </section>
  );
};
