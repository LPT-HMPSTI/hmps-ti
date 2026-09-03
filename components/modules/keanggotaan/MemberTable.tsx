"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { MemberRow } from "./MemberRow";

export interface MemberTableProps {
  members: any[];
  startIndex: number;
  activePlayingId: string | null;
  onTogglePlay: (id: string) => void;
  likedMembers: Record<string, boolean>;
  memberReactionBadges: Record<string, string>;
  onToggleLike: (id: string, currentLikes: number, e: React.MouseEvent) => void;
}

/**
 * Komponen tabel direktori anggota Spotify yang menampilkan daftar baris anggota dan tampilan kosong (*empty state*).
 */
export const MemberTable: React.FC<MemberTableProps> = ({
  members,
  startIndex,
  activePlayingId,
  onTogglePlay,
  likedMembers,
  memberReactionBadges,
  onToggleLike,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Table Header Row (Spotify Style) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 select-none">
        <div className="col-span-1 flex items-center justify-center">#</div>
        <div className="col-span-3 flex items-center">Anggota</div>
        <div className="col-span-3 flex items-center">Jabatan & Divisi</div>
        <div className="col-span-2 flex items-center">Status</div>
        <div className="col-span-3 flex items-center justify-end pr-2">Sosial Media & Like</div>
      </div>

      {/* Tracklist Rows */}
      <div className="space-y-1.5">
        <AnimatePresence mode="wait">
          {members.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center backdrop-blur-xl"
            >
              <div className="h-11 w-11 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-2.5 text-slate-400">
                <Music size={22} />
              </div>
              <h3 className="font-bold text-white text-sm">Tidak Ada Anggota Ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Coba sesuaikan kata kunci pencarian atau filter angkatan.
              </p>
            </motion.div>
          ) : (
            members.map((member, idx) => (
              <MemberRow
                key={member.id || idx}
                member={member}
                idx={idx}
                startIndex={startIndex}
                isPlaying={activePlayingId === member.id}
                onTogglePlay={onTogglePlay}
                isLiked={!!likedMembers[member.id]}
                reactionBadge={memberReactionBadges[member.id]}
                onToggleLike={onToggleLike}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
