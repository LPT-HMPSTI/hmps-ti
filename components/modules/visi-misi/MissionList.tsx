"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

export interface MissionItem {
  number?: string;
  title: string;
  desc: string;
  indicator?: string;
}

export interface MissionListProps {
  missions: MissionItem[];
}

/**
 * Komponen daftar pilar misi perjuangan organisasi dengan kartu neubrutalism interaktif.
 */
export const MissionList: React.FC<MissionListProps> = ({ missions }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <Badge variant="cyan" tilt="left">
            POIN POIN MISI
          </Badge>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            {missions?.length || 5} Poin Misi Perjuangan
          </h2>
        </div>

        <Badge variant="spotify" tilt="right">
          MISI HMPS-TI
        </Badge>
      </div>

      {/* CLEAN SEQUENTIAL TIMELINE LIST (GARIS TIMELINE SEPERTI DESAIN AWAL) */}
      <div className="space-y-4 sm:space-y-5 pt-1">
        {(missions || []).map((misi, idx) => {
          const isLast = idx === (missions || []).length - 1;

          return (
            <div
              key={idx}
              className="relative flex items-start gap-4 sm:gap-5 group"
            >
              {/* LEFT COLUMN: SEQUENTIAL NUMBER BOX + CONNECTING TIMELINE LINE */}
              <div className="flex flex-col items-center shrink-0">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border-2 border-black bg-[#121520] font-mono text-base sm:text-lg font-black text-[#1DB954] shadow-[3px_3px_0px_0px_#000000] group-hover:bg-[#1DB954] group-hover:text-black group-hover:shadow-[4px_4px_0px_0px_#000000] group-hover:-translate-y-0.5 transition-all duration-200 z-10">
                  {misi.number || `0${idx + 1}`}
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 min-h-[36px] sm:min-h-[44px] bg-gradient-to-b from-[#1DB954]/50 via-white/15 to-white/5 my-1.5" />
                )}
              </div>

              {/* RIGHT COLUMN: PURE CLEAN CONTENT */}
              <div className="flex-1 min-w-0 space-y-1.5 pb-4 border-b border-white/10 group-hover:border-[#1DB954]/30 transition-colors">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#1DB954] transition-colors leading-snug font-sans">
                  {misi.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {misi.desc}
                </p>

                {misi.indicator && (
                  <div className="pt-1 flex items-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1DB954]/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#1DB954]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                      <span>Target: {misi.indicator}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};
