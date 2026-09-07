"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Music,
  SkipBack,
  SkipForward,
  Disc,
} from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { getLocalLikeState, toggleDatabaseLike } from "@/services";

export interface DivisionMember {
  id: string;
  name: string;
  role: string;
  nim: string;
  avatar: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  email?: string;
  social_links?: string[];
  likes_count?: number;
}

interface SpotifyDivisionCarouselProps {
  title: string;
  fullname: string;
  desc: string;
  members: DivisionMember[];
  variantColor?: string;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

const TRACK_DURATION = 30; // 30 seconds auto-play timer

export function SpotifyDivisionCarousel({
  title,
  fullname,
  desc,
  members,
  variantColor = "#1DB954",
}: SpotifyDivisionCarouselProps) {
  // 1. SORT MEMBERS: Koordinator Divisi ALWAYS FIRST (#01)
  const sortedMembers = [...members].sort((a, b) => {
    const roleA = (a.role || "").toLowerCase();
    const roleB = (b.role || "").toLowerCase();
    const isKoorA = roleA.includes("koordinator") || roleA.includes("koor") || roleA.includes("ketua");
    const isKoorB = roleB.includes("koordinator") || roleB.includes("koor") || roleB.includes("ketua");

    if (isKoorA && !isKoorB) return -1;
    if (!isKoorA && isKoorB) return 1;
    return 0;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeReactionBadge, setLikeReactionBadge] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  const totalMembers = sortedMembers.length;
  const activeMember = sortedMembers[currentIndex];

  // Safeguard index out-of-bounds when members change
  useEffect(() => {
    if (totalMembers > 0 && currentIndex >= totalMembers) {
      setCurrentIndex(0);
    }
  }, [totalMembers, currentIndex]);

  // HYDRATE VISITOR LIKE STATE WHEN CURRENT INDEX CHANGES
  useEffect(() => {
    if (activeMember) {
      setIsLiked(getLocalLikeState("division_members", activeMember.id));
    } else {
      setIsLiked(false);
    }
    setLikeReactionBadge(null);
  }, [currentIndex, activeMember]);

  // 2. ULTRA-SMOOTH 60FPS PLAY PROGRESS (requestAnimationFrame)
  useEffect(() => {
    if (!isPlaying || totalMembers === 0) return;

    let lastTimestamp = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      setSecondsElapsed((prev) => {
        const next = prev + deltaSec;
        return next >= TRACK_DURATION ? TRACK_DURATION : next;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, totalMembers]);

  // 3. AUTOMATIC ROTATION: When bar reaches full (30s), switch to next member
  useEffect(() => {
    if (secondsElapsed >= TRACK_DURATION) {
      setDirection(1);
      setSecondsElapsed(0);
      if (totalMembers > 1) {
        setCurrentIndex((curr) => (curr + 1) % totalMembers);
      }
    }
  }, [secondsElapsed, totalMembers]);

  const handleNext = () => {
    if (totalMembers === 0) return;
    setDirection(1);
    setSecondsElapsed(0);
    setCurrentIndex((prev) => (prev + 1) % totalMembers);
  };

  const handlePrev = () => {
    if (totalMembers === 0) return;
    setDirection(-1);
    setSecondsElapsed(0);
    setCurrentIndex((prev) => (prev - 1 + totalMembers) % totalMembers);
  };

  const selectTrack = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setSecondsElapsed(0);
    setCurrentIndex(idx);
  };

  const handleToggleLike = async () => {
    if (!activeMember) return;
    const nextState = !isLiked;
    setIsLiked(nextState);
    const badgeText = nextState ? ":) Liked!" : ":( Unliked";
    setLikeReactionBadge(badgeText);
    setTimeout(() => {
      setLikeReactionBadge(null);
    }, 2500);

    const baseLikes = (activeMember as any)?.likes_count ?? 0;
    await toggleDatabaseLike("division_members", activeMember.id, nextState, baseLikes);
  };

  const formatTime = (sec: number) => {
    const sInt = Math.floor(sec);
    const m = Math.floor(sInt / 60);
    const s = sInt % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Neubrutalism Social Links Initial + Spring Hover Animation
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
const renderSocials = (m: DivisionMember) => {
    const links: string[] = [];
    if (m.instagram_url && m.instagram_url.trim()) links.push(m.instagram_url.trim());
    if (m.email && m.email.trim()) links.push(`mailto:${m.email.trim()}`);
    if (m.github_url && m.github_url.trim() && m.github_url.trim() !== "https://github.com") {
      links.push(m.github_url.trim());
    }
    if (m.linkedin_url && m.linkedin_url.trim() && m.linkedin_url.trim() !== "https://linkedin.com") {
      links.push(m.linkedin_url.trim());
    }
    if (Array.isArray(m.social_links)) {
      m.social_links.forEach((l) => {
        if (l && typeof l === "string" && l.trim() && !links.includes(l.trim())) {
          links.push(l.trim());
        }
      });
    }

    const uniqueLinks = Array.from(new Set(links)).filter(Boolean);

    if (uniqueLinks.length === 0) return null;

    return (
      <div className="flex items-center gap-1.5">
        {uniqueLinks.slice(0, 4).map((url, i) => (
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

  const progressPercent = (secondsElapsed / TRACK_DURATION) * 100;

  return (
    <div className="space-y-4 bg-[#121212] p-5 sm:p-7 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div
        className="absolute -top-16 -right-16 h-72 w-72 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: variantColor }}
      />

      {/* MINIMALIST HEADER BANNER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <Music size={18} className="text-[#1DB954]" />
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight uppercase">
            {title}
          </h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
            {fullname}
          </span>
        </div>

        {/* Minimal Navigation Arrow Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={totalMembers <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#1DB954] hover:text-black transition-all disabled:opacity-20 cursor-pointer"
            aria-label="Previous Track"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={totalMembers <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#1DB954] hover:text-black transition-all disabled:opacity-20 cursor-pointer"
            aria-label="Next Track"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MAIN TRACK PLAYER CARD */}
      {totalMembers > 0 && activeMember ? (
        <div className="relative z-10 space-y-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeMember.id || currentIndex}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#181818] p-5 sm:p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden"
            >
              {/* Left Column: Photo & Vinyl */}
              <div className="md:col-span-4 flex justify-center relative">
                <div className="relative group">
                  <div className="relative aspect-square w-40 sm:w-48 rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-black">
                    <img
                      src={activeMember.avatar || PLACEHOLDER_IMAGE}
                      alt={activeMember.name}
                      className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                      }}
                    />

                    {/* Minimal Clean Track Number Badge */}
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 text-[10px] font-mono font-extrabold text-[#1DB954] border border-[#1DB954]/40 shadow-sm">
                      {String(currentIndex + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Spinning Vinyl Disc Accent */}
                  <div
                    className={`absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-950 shadow-xl -z-10 flex items-center justify-center ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ animationDuration: "10s" }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1DB954] border-2 border-black flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Song Info & Live Seekbar */}
              <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2.5px_2.5px_0px_0px_#000000] -rotate-2 hover:rotate-0 transition-transform duration-200 cursor-pointer inline-block">
                      {activeMember.role.toLowerCase().includes("koordinator") || activeMember.role.toLowerCase().includes("koor")
                        ? "KOORDINATOR DIVISI"
                        : "STAFF DIVISI"}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      NIM: {activeMember.nim || "-"}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {activeMember.name}
                  </h2>

                  <p className="text-xs font-mono text-[#1DB954] font-medium">
                    {activeMember.role}
                  </p>
                </div>

                {/* LIVE AUTOMATIC PLAY PROGRESS SEEKBAR */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{formatTime(secondsElapsed)}</span>
                    <span className="text-[10px] text-[#1DB954]">
                      {isPlaying ? "PLAYING" : "PAUSED"}
                    </span>
                    <span>{formatTime(TRACK_DURATION)}</span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden relative">
                    <div
                      className="h-full bg-[#1DB954] rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Player Controls & Socials */}
                <div className="flex items-center justify-between pt-1 relative">
                  <div className="flex items-center gap-3 relative">
                    <button
                      onClick={handlePrev}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Previous Track"
                    >
                      <SkipBack size={18} />
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label="Play/Pause"
                    >
                      {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                    </button>

                    <button
                      onClick={handleNext}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Next Track"
                    >
                      <SkipForward size={18} />
                    </button>

                    {(() => {
                      const currentLikes = (activeMember as any)?.likes_count ?? (isLiked ? 1 : 0);

                      return (
                        <button
                          key={activeMember.id}
                          onClick={handleToggleLike}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-[#1DB954] transition-colors cursor-pointer ml-1 px-2.5 py-1 rounded-full border border-white/10 hover:bg-white/[0.05]"
                          aria-label="Like Member"
                        >
                          <Heart size={16} className={isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""} />
                          <span className="text-[11px] font-mono font-bold text-slate-300">{currentLikes}</span>
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

                  {renderSocials(activeMember)}
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* REDESIGNED NEUBRUTALIST TRACK SELECTOR PILLS (NO # OR $ SYMBOLS) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
            {sortedMembers.map((m, idx) => {
              const isActive = idx === currentIndex;
              const isKoor = m.role.toLowerCase().includes("koordinator") || m.role.toLowerCase().includes("koor");
              const trackNum = String(idx + 1).padStart(2, "0");

              return (
                <button
                  key={m.id || idx}
                  onClick={() => selectTrack(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-[#1DB954] text-black border-2 border-black font-black shadow-[2.5px_2.5px_0px_0px_#000000] scale-105"
                      : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/15 hover:text-white hover:-translate-y-0.5"
                  }`}
                >
                  <span className={`font-bold px-1.5 py-0.2 rounded ${isActive ? "bg-black text-[#1DB954]" : "bg-white/10 text-slate-300"}`}>
                    {trackNum}
                  </span>
                  <span className="truncate max-w-[120px] font-bold">{m.name}</span>
                  {isKoor && (
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border border-black ${isActive ? "bg-[#FFD700] text-black" : "bg-[#FFD700] text-black"}`}>
                      KOOR
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center space-y-2 bg-[#181818] rounded-xl border border-dashed border-white/10">
          <Disc size={28} className="mx-auto text-slate-500 animate-spin" style={{ animationDuration: "10s" }} />
          <p className="text-xs font-mono text-slate-400">
            Belum ada track pengurus terdaftar untuk {title}.
          </p>
        </div>
      )}
    </div>
  );
}
