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
 * Komponen seksi Visi Utama dengan quote badge neubrutalism dan efek animasi teks mesin ketik.
 */
export const VisionSection: React.FC<VisionSectionProps> = ({
  vision,
  currentPeriod,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative space-y-6 py-4"
    >
      {/* Ambient Subtle Radial Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-80 w-96 rounded-full bg-[#1DB954]/12 blur-3xl pointer-events-none" />

      {/* Monospace Section Tag */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono font-extrabold tracking-widest text-[#1DB954] uppercase">
          VISI UTAMA HMPSTI SWU
        </div>
        <Badge variant="yellow" tilt="right">
          KABINET {currentPeriod}
        </Badge>
      </div>

      {/* GIANT UNBOXED VISI STATEMENT WITH NEUBRUTALIST HANDWRITING QUOTE BADGES */}
      <div className="relative z-10 space-y-4 pt-2">
        {/* Opening Quote Badge */}
        <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 sm:border-3 border-black bg-[#1DB954] text-black shadow-[4px_4px_0px_0px_#000000] -rotate-3 hover:rotate-0 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] hover:bg-[#1ed760] transition-all duration-300 cursor-pointer mb-5 sm:mb-7 shrink-0">
          <Quotes size={28} weight="fill" className="text-black shrink-0" />
        </div>

        {/* Main Unboxed Visi Statement with Guaranteed Looping Typewriter */}
        <TypewriterVisionText text={vision} />

        {/* Closing Quote Badge */}
        <div className="flex justify-end mt-5 sm:mt-7">
          <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 sm:border-3 border-black bg-[#1DB954] text-black shadow-[4px_4px_0px_0px_#000000] rotate-3 hover:rotate-0 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] hover:bg-[#1ed760] transition-all duration-300 cursor-pointer shrink-0">
            <Quotes size={28} weight="fill" className="text-black shrink-0 rotate-180" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 text-xs font-mono text-slate-400 border-t border-white/10" />
      </div>
    </motion.section>
  );
};
