"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quotes } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { TypewriterVisionText } from "./TypewriterVisionText";

export interface VisionSectionProps {
  vision: string;
  currentPeriod: string;
}

/**
 * Komponen Visi Utama HMPSTI SWU bergaya Spotify Canvas Neubrutalism Card.
 * Menampilkan pernyataan visi dengan animasi typewriter, aksen quote neubrutalism,
 * serta 3 pilar karakter mahasiswa Teknik Informatika.
 */
export const VisionSection: React.FC<VisionSectionProps> = ({
  vision,
  currentPeriod,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full h-full flex flex-col"
    >
      {/* Ambient Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-[#1DB954]/12 blur-3xl pointer-events-none" />

      {/* SPOTIFY CANVAS VISION CARD */}
      <div className="relative z-10 overflow-hidden rounded-3xl border-2 border-black bg-[#121520] p-5 sm:p-6 lg:p-7 shadow-[6px_6px_0px_0px_#000000] backdrop-blur-xl h-full flex flex-col justify-between">
        {/* Top Status & Audio Wave Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954] animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-[#1DB954] uppercase tracking-wider">
              VISI HMPS-TI
            </span>
          </div>

          <Badge variant="cyan" tilt="right">
            PERIODE {currentPeriod}
          </Badge>
        </div>

        {/* Center Quote & Vision Statement Framed by Opening (Top-Left) and Closing (Bottom-Right) Quotes */}
        <div className="flex flex-col justify-center my-auto py-2 w-full">
          {/* Opening Quote Icon (Kiri Atas Teks) */}
          <div className="flex justify-start mb-2">
            <div className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-black bg-[#1DB954] text-black shadow-[3px_3px_0px_0px_#000000] -rotate-6 hover:rotate-0 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <Quotes size={22} weight="fill" />
            </div>
          </div>

          {/* Typewriter text statement */}
          <div className="px-2 sm:px-3">
            <TypewriterVisionText text={vision} />
          </div>

          {/* Closing Quote Icon (Kanan Bawah Teks) */}
          <div className="flex justify-end mt-2">
            <div className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-black bg-[#1DB954] text-black shadow-[3px_3px_0px_0px_#000000] rotate-186 hover:rotate-180 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <Quotes size={22} weight="fill" />
            </div>
          </div>
        </div>

        {/* Core Values / Pilar Karakter TI */}
        <div className="w-full pt-4 border-t border-white/10 mt-3">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
            3 Pilar Inti Karakter Mahasiswa TI:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="cyan" tilt="left">
              UNGGUL & INOVATIF
            </Badge>
            <Badge variant="spotify" tilt="right">
              PENGUASAAN TEKNOLOGI
            </Badge>
            <Badge variant="yellow" tilt="left">
              KONTRIBUSI NYATA
            </Badge>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
