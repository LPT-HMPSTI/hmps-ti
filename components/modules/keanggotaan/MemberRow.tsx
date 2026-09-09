"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Play, Pause, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { normalizeMemberStatus, getNeubrutalistSocialStyle } from "./memberUtils";

export interface MemberRowProps {
  member: any;
  idx: number;
  startIndex: number;
  isPlaying: boolean;
  onTogglePlay: (id: string) => void;
  isLiked: boolean;
  reactionBadge?: string;
  onToggleLike: (id: string, currentLikes: number, e: React.MouseEvent) => void;
}

/**
 * Komponen baris anggota direktori bergaya tracklist Spotify (responsif desktop tabel & mobile kartu).
 */
export const MemberRow: React.FC<MemberRowProps> = ({
  member,
  idx,
  startIndex,
  isPlaying,
  onTogglePlay,
  isLiked,
  reactionBadge,
  onToggleLike,
}) => {
  const globalIndex = startIndex + idx + 1;
  const trackNumber = globalIndex < 10 ? `0${globalIndex}` : `${globalIndex}`;
  const statusInfo = normalizeMemberStatus(member.status, member.role);

  // Social Links Collector
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
    member.social_links.forEach((l: string) => {
      if (l && typeof l === "string" && l.trim()) {
        const trimmed = l.trim();
        if (trimmed !== "https://github.com" && trimmed !== "https://linkedin.com" && !links.includes(trimmed)) {
          links.push(trimmed);
        }
      }
    });
  }
  const uniqueLinks = Array.from(new Set(links)).filter(Boolean);

  return (
    <motion.div
      key={member.id || idx}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: idx * 0.02 }}
      onClick={() => onTogglePlay(member.id)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer ${
        isPlaying
          ? "border-[#1DB954]/50 bg-[#1DB954]/10 shadow-[0_0_20px_rgba(29,185,84,0.15)]"
          : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.06]"
      }`}
    >
      {/* DESKTOP & TABLET ROW VIEW */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-3">
        {/* Column 1: # Number / Equalizer / Play/Pause Button */}
        <div className="col-span-1 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
          {isPlaying ? (
            <>
              <div className="flex items-end gap-0.5 h-4 group-hover:hidden">
                <span className="w-1 bg-[#1DB954] rounded-full animate-[bounce_0.8s_infinite] h-3" />
                <span className="w-1 bg-[#1DB954] rounded-full animate-[bounce_0.6s_infinite] h-4" />
                <span className="w-1 bg-[#1DB954] rounded-full animate-[bounce_1s_infinite] h-2" />
              </div>
              <Pause size={14} className="hidden group-hover:block fill-[#1DB954] text-[#1DB954]" />
            </>
          ) : (
            <>
              <span className="group-hover:hidden">{trackNumber}</span>
              <Play size={13} className="hidden group-hover:block text-white fill-white ml-0.5" />
            </>
          )}
        </div>

        {/* Column 2: Member Photo & Details */}
        <div className="col-span-3 flex items-center gap-3.5 min-w-0">
          {/* Member Avatar */}
          <div className="relative h-10 w-10 rounded-lg border border-white/15 bg-[#181B26] overflow-hidden shrink-0 flex items-center justify-center shadow-md">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#1DB954]/30 via-[#121520] to-[#0A66C2]/30 flex items-center justify-center text-[#1DB954]">
                <User size={17} />
              </div>
            )}
          </div>

          {/* Name and NIM */}
          <div className="min-w-0 flex-1">
            <h3 className={`text-sm font-bold truncate transition-colors ${isPlaying ? "text-[#1DB954]" : "text-white group-hover:text-[#1DB954]"}`}>
              {member.name}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 truncate">
              NIM: <span className="text-slate-300">{member.nim || "-"}</span>
            </p>
          </div>
        </div>

        {/* Column 3: Role & Division */}
        <div className="col-span-3 min-w-0">
          <p className="text-xs font-mono font-bold text-slate-200 truncate">
            {member.role || "Anggota HMPSTI"}
          </p>
          <p className="text-[10px] font-mono text-slate-400 truncate uppercase">
            {member.division || "STMIK WIDYA UTAMA"}
          </p>
        </div>

        {/* Column 4: Status Badge */}
        <div className="col-span-2 flex items-center">
          <Badge
            variant={statusInfo.variant}
            tilt={statusInfo.tilt}
            className="text-[10px] py-0.5 px-2 font-mono font-bold"
          >
            {statusInfo.label}
          </Badge>
        </div>

        {/* Column 5: Social Media Buttons + Like Button on the Far Right */}
        <div className="col-span-3 flex items-center justify-end gap-2.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5 flex-nowrap justify-end shrink-0">
            {uniqueLinks.map((url, i) => (
              <a
                key={i}
                href={url.startsWith("http") || url.startsWith("mailto:") ? url : `https://${url}`}
                target={url.startsWith("mailto:") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className={getNeubrutalistSocialStyle(url, i)}
                title={url}
              >
                <SocialIcon url={url} size={14} weight="bold" />
              </a>
            ))}
          </div>

          <div className="relative flex items-center justify-end shrink-0 min-w-[45px]">
            <button
              type="button"
              onClick={(e) => onToggleLike(member.id, member.likes_count ?? 0, e)}
              className="px-2 py-1 rounded-md text-slate-400 hover:text-[#1DB954] transition-all cursor-pointer flex items-center gap-1.5 hover:bg-white/[0.05]"
              title="Sukai Anggota Ini"
            >
              <Heart size={14} className={isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""} />
              <span className="text-[11px] font-mono text-slate-300 font-bold">
                {member.likes_count ?? (isLiked ? 1 : 0)}
              </span>
            </button>

            <AnimatePresence>
              {reactionBadge && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: -24 }}
                  exit={{ opacity: 0, scale: 0.8, y: -5 }}
                  className="absolute -top-1 right-0 whitespace-nowrap px-2 py-0.5 rounded-md border-2 border-black bg-[#1DB954] text-black font-mono text-[9px] font-black shadow-[2px_2px_0px_0px_#000000] z-20 pointer-events-none"
                >
                  {reactionBadge}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-11 w-11 rounded-lg border border-white/15 bg-[#181B26] overflow-hidden shrink-0 flex items-center justify-center">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
              ) : (
                <User size={18} className="text-[#1DB954]" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-[#1DB954]">#{trackNumber}</span>
                <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">NIM: {member.nim || "-"}</p>
            </div>
          </div>

          <Badge
            variant={statusInfo.variant}
            tilt={statusInfo.tilt}
            className="text-[9px] py-0.5 px-2 shrink-0"
          >
            {statusInfo.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-300 pt-1 border-t border-white/5">
          <span className="truncate">Peran: <strong className="text-[#1DB954]">{member.role}</strong></span>
          <span className="text-slate-400">{member.division}</span>
        </div>

        {/* Mobile Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto no-scrollbar max-w-[70%]">
            {uniqueLinks.length > 0 && <span className="text-[10px] font-mono text-slate-400 mr-1 shrink-0">Kontak:</span>}
            {uniqueLinks.map((url, i) => (
              <a
                key={i}
                href={url.startsWith("http") || url.startsWith("mailto:") ? url : `https://${url}`}
                target={url.startsWith("mailto:") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className={getNeubrutalistSocialStyle(url, i)}
                title={url}
              >
                <SocialIcon url={url} size={13} weight="bold" />
              </a>
            ))}
          </div>

          <div className="relative flex items-center justify-end shrink-0">
            <button
              type="button"
              onClick={(e) => onToggleLike(member.id, member.likes_count ?? 0, e)}
              className="px-2 py-1 rounded-md text-slate-400 hover:text-[#1DB954] transition-all flex items-center gap-1"
            >
              <Heart size={14} className={isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""} />
              <span className="text-[11px] font-mono font-bold text-slate-300">
                {member.likes_count ?? (isLiked ? 1 : 0)}
              </span>
            </button>
            {reactionBadge && (
              <span className="text-[10px] font-mono font-bold text-[#1DB954] ml-1">
                {reactionBadge}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
