"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Heart, Radio, Music } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getLocalLikeState, toggleDatabaseLike } from "@/services";

export interface BphMember {
  id: string;
  name: string;
  role: string;
  nim: string;
  avatar: string;
  division_slug?: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  email?: string;
  social_links?: string[];
  period?: string;
  likes_count?: number;
}

interface BphMemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: BphMember | null;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

const DURATION_SECONDS = 35;

export function BphMemberDetailModal({
  isOpen,
  onClose,
  member,
}: BphMemberDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeReactionBadge, setLikeReactionBadge] = useState<string | null>(null);

  // Hydrate visitor like state when member changes or modal opens/closes
  useEffect(() => {
    if (isOpen && member) {
      setIsLiked(getLocalLikeState("division_members", member.id));
      setLikeReactionBadge(null);
      setSecondsElapsed(0);
      setIsPlaying(true);
    }
  }, [isOpen, member?.id]);

  // Ultra-smooth 60fps play progress timer (requestAnimationFrame)
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    let lastTimestamp = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setSecondsElapsed((prev) => {
        const next = prev + deltaSec;
        return next >= DURATION_SECONDS ? 0 : next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isOpen, isPlaying]);

  if (!isOpen || !member) return null;

  const handleToggleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    const badgeText = nextState ? ":) Liked!" : ":( Unliked";
    setLikeReactionBadge(badgeText);
    setTimeout(() => {
      setLikeReactionBadge(null);
    }, 2500);

    const baseLikes = (member as any)?.likes_count ?? 0;
    await toggleDatabaseLike("division_members", member.id, nextState, baseLikes);
  };

  const formatTime = (sec: number) => {
    const sInt = Math.floor(sec);
    const m = Math.floor(sInt / 60);
    const s = sInt % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

          // Crisp Neubrutalist Social Button Helper (Matching Edit & Delete Buttons)
  const getNeubrutalistSocialStyle = (url: string, index: number) => {
    const u = (url || "").toLowerCase();
    const tiltClass = index % 2 === 0 ? "-rotate-2" : "rotate-2";

    let brandColors = "bg-[#FFD700] text-black"; // Yellow default (Website)
    if (u.includes("instagram.com") || u.includes("instagr.am")) {
      brandColors = "bg-[#FF007F] text-white"; // Hot Magenta (White Icon)
    } else if (u.includes("mailto:") || u.includes("gmail") || u.includes("email") || u.includes("@")) {
      brandColors = "bg-[#B31412] text-white"; // Maroon Khas Gmail (White Icon)
    } else if (u.includes("github.com")) {
      brandColors = "bg-[#24292E] text-white"; // GitHub Black (White Icon)
    } else if (u.includes("linkedin.com")) {
      brandColors = "bg-[#0A66C2] text-white"; // Deep LinkedIn Blue (White Icon)
    } else if (u.includes("wa.me") || u.includes("whatsapp")) {
      brandColors = "bg-[#25D366] text-black"; // WhatsApp Green (Black Icon)
    }

    return `flex h-7 w-7 items-center justify-center rounded-md border-2 border-black ${brandColors} shadow-[2px_2px_0px_0px_#000000] ${tiltClass} hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer shrink-0`;
  };
const renderSocials = () => {
    const links: string[] = [];
    if (member.instagram_url && member.instagram_url.trim()) links.push(member.instagram_url.trim());
    if (member.email && member.email.trim()) links.push(`mailto:${member.email.trim()}`);
    if (member.github_url && member.github_url.trim() && member.github_url.trim() !== "https://github.com") {
      links.push(member.github_url.trim());
    }
    if (member.linkedin_url && member.linkedin_url.trim() && member.linkedin_url.trim() !== "https://linkedin.com") {
      links.push(member.linkedin_url.trim());
    }
    if (Array.isArray(member.social_links)) {
      member.social_links.forEach((l) => {
        if (l && typeof l === "string" && l.trim() && !links.includes(l.trim())) {
          links.push(l.trim());
        }
      });
    }

    const uniqueLinks = Array.from(new Set(links)).filter(Boolean);

    if (uniqueLinks.length === 0) return null;

    return (
      <div className="flex items-center gap-1.5 pt-1">
        {uniqueLinks.map((url, i) => (
          <a
            key={i}
            href={url.startsWith("mailto:") || url.startsWith("http") ? url : `https://${url}`}
            target={url.startsWith("mailto:") ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className={getNeubrutalistSocialStyle(url, i)}
            title={url}
          >
            <SocialIcon url={url} size={14} weight="bold" />
          </a>
        ))}
      </div>
    );
  };

  const progressPercent = (secondsElapsed / DURATION_SECONDS) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[#121212] border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 text-white overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-[#1DB954]/20 rounded-full blur-3xl pointer-events-none" />

          {/* SPOTIFY MINIMIZED NOW PLAYING BAR HEADER WITH NEUBRUTALIST CLOSE BUTTON */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <Music size={16} className="text-[#1DB954] animate-pulse" />
              <span className="text-[11px] font-mono font-extrabold uppercase text-[#1DB954] tracking-widest">
                NOW PLAYING
              </span>
            </div>
            {/* NEUBRUTALIST CLOSE BUTTON (Magenta / Pink Accent) */}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer"
              aria-label="Close Floating Player"
            >
              <X size={14} />
            </button>
          </div>

          {/* FLOATING PLAYER CONTENT CARD */}
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl space-y-4 relative z-10">
            
            <div className="flex items-center gap-4">
              {/* Square Album Cover */}
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/20 shadow-lg bg-black shrink-0">
                <img
                  src={member.avatar || PLACEHOLDER_IMAGE}
                  alt={member.name}
                  className="h-full w-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>

              {/* Title & Artist Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold text-[#1DB954]">
                  <span className="truncate">{member.role}</span>                  
                </div>

                <h3 className="text-base font-extrabold text-white truncate leading-snug">
                  {member.name}
                </h3>

                <p className="text-[11px] font-mono text-slate-400">
                  NIM: <strong className="text-white">{member.nim || "-"}</strong>
                </p>
              </div>
            </div>

            {/* LIVE SEEKBAR & ANIMATED EQUALIZER */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{formatTime(secondsElapsed)}</span>
                
                {/* Equalizer Waveform Bars */}
                <div className="flex items-end gap-1 h-3">
                  <div className={`w-1 bg-[#1DB954] ${isPlaying ? "h-full animate-pulse" : "h-1"}`} />
                  <div className={`w-1 bg-[#1DB954] ${isPlaying ? "h-2/3 animate-pulse" : "h-1"}`} style={{ animationDelay: "150ms" }} />
                  <div className={`w-1 bg-[#1DB954] ${isPlaying ? "h-5/6 animate-pulse" : "h-1"}`} style={{ animationDelay: "300ms" }} />
                  <div className={`w-1 bg-[#1DB954] ${isPlaying ? "h-1/2 animate-pulse" : "h-1"}`} style={{ animationDelay: "450ms" }} />
                </div>

                <span>{formatTime(DURATION_SECONDS)}</span>
              </div>

              {/* Green Dynamic Seekbar */}
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden relative">
                <div
                  className="h-full bg-[#1DB954] rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* CONTROLS BAR & SOCIALS */}
            <div className="flex items-center justify-between pt-1 relative">
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-md hover:scale-105 transition-transform cursor-pointer"
                  aria-label="Play/Pause"
                >
                  {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                </button>

                {(() => {
                  const currentLikes = (member as any)?.likes_count ?? (isLiked ? 1 : 0);

                  return (
                    <button
                      onClick={handleToggleLike}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-[#1DB954] transition-colors cursor-pointer px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/[0.05]"
                      aria-label="Like Track"
                    >
                      <Heart size={18} className={isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""} />
                      <span className="text-[11px] font-mono font-bold text-slate-200">{currentLikes}</span>
                    </button>
                  );
                })()}

                {/* NEUBRUTALIST REACTION BADGE ON LIKE */}
                <AnimatePresence>
                  {likeReactionBadge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8, x: -5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -5 }}
                      className="px-2.5 py-0.5 rounded-md border-2 border-black bg-[#1DB954] text-black font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000000]"
                    >
                      {likeReactionBadge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {renderSocials()}
            </div>

          </div>

          {/* FOOTER CLOSE ACTION WITH NEUBRUTALISM STYLING */}
          <div className="relative z-10 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#1DB954] hover:text-black border-2 border-black text-xs font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000] -rotate-1 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Minimize Player
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
