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
 * Komponen daftar sekuensial pilar misi perjuangan organisasi dengan timeline neubrutalism.
 */
export const MissionList: React.FC<MissionListProps> = ({ missions }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-10 sm:space-y-12"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <Badge variant="cyan" tilt="left">
            POIN POIN MISI
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {missions?.length || 5} Poin Misi Perjuangan
          </h2>
        </div>
      </div>

      {/* CLEAN SEQUENTIAL TIMELINE LIST */}
      <div className="space-y-8 sm:space-y-12">
        {(missions || []).map((misi, idx) => {
          const isLast = idx === (missions || []).length - 1;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative flex flex-col md:flex-row items-start gap-6 sm:gap-10 group"
            >
              {/* LEFT COLUMN: SEQUENTIAL NUMBER BOX */}
              <div className="flex md:flex-col items-center gap-4 shrink-0">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border-2 border-black bg-[#121520] text-white shadow-[4px_4px_0px_0px_#000000] font-mono text-xl sm:text-2xl font-black text-[#1DB954] group-hover:bg-[#1DB954] group-hover:text-black transition-all duration-300">
                  {misi.number || `0${idx + 1}`}
                </div>
                {!isLast && (
                  <div className="hidden md:block w-0.5 h-full min-h-[70px] bg-gradient-to-b from-[#1DB954]/40 via-white/10 to-transparent my-2" />
                )}
              </div>

              {/* RIGHT COLUMN: PURE CLEAN CONTENT */}
              <div className="flex-1 space-y-3 pb-6 sm:pb-8 border-b border-white/10 group-hover:border-[#1DB954]/40 transition-colors">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug font-sans group-hover:text-[#1DB954] transition-colors">
                  {misi.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-3xl">
                  {misi.desc}
                </p>

                {/* Sleek Target Indicator Pill */}
                {misi.indicator && (
                  <div className="pt-1.5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs font-mono font-bold text-slate-300 shadow-sm">
                      Target: {misi.indicator}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
