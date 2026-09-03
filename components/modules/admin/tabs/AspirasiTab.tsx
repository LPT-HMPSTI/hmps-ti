"use client";

import React from "react";
import { MagnifyingGlass, CheckCircle, Trash } from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export interface AspirasiItem {
  id: string;
  sender_name?: string;
  email?: string;
  message: string;
  is_anonymous: boolean;
  is_read: boolean;
  created_at?: string;
}

export interface AspirasiTabProps {
  aspirasiList: AspirasiItem[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onToggleReadStatus: (id: string, currentStatus: boolean) => void;
  onDeleteAspirasi: (item: AspirasiItem) => void;
}

/**
 * Tab Inbox Aspirasi: Menampilkan aspirasi mahasiswa (terbuka maupun anonim)
 * dengan fitur pencarian teks, penandaan status baca, dan tombol hapus neubrutalis.
 */
export const AspirasiTab: React.FC<AspirasiTabProps> = ({
  aspirasiList,
  searchQuery,
  onSearchChange,
  onToggleReadStatus,
  onDeleteAspirasi,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">
          Kotak Masuk Aspirasi Mahasiswa ({aspirasiList.length})
        </h2>

        {/* Search Bar Komponen */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari pesan aspirasi..."
            className="w-full rounded-xl border-2 border-black bg-[#121520] py-2 pl-9.5 pr-8 text-xs text-white placeholder-slate-400 font-mono shadow-[2px_2px_0px_0px_#000000] focus:border-[#1DB954] focus:outline-none"
          />
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {aspirasiList.map((asp) => (
          <GlassCard key={asp.id} glowColor="magenta" className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={asp.is_anonymous ? "magenta" : "spotify"} tilt="left">
                  {asp.is_anonymous ? "ANONIM" : asp.sender_name}
                </Badge>
                {asp.email && (
                  <span className="text-xs font-mono text-slate-400">({asp.email})</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleReadStatus(asp.id, asp.is_read)}
                  title={asp.is_read ? "Sudah Dibaca" : "Tandai Dibaca"}
                  className={`p-2 rounded-md border-2 border-black text-black shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer flex items-center justify-center ${
                    asp.is_read ? "bg-[#00F2FE] -rotate-1" : "bg-[#1DB954] rotate-1"
                  }`}
                >
                  <CheckCircle size={14} weight="bold" />
                </button>

                <button
                  onClick={() => onDeleteAspirasi(asp)}
                  title="Hapus Aspirasi"
                  className="p-2 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>
            </div>
            <p className="text-xs text-white leading-relaxed pt-1">{asp.message}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
