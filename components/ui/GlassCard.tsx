"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

/**
 * Kartu kontainer dengan efek glassmorphism — border transparan, backdrop blur,
 * dan glow lingkaran warna di pojok kanan atas.
 *
 * @param hoverEffect  - Jika true (default), kartu sedikit terangkat saat di-hover (y: -3).
 * @param glowColor    - Warna glow blur di pojok; "none" untuk menyembunyikan glow sepenuhnya.
 */
interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: "spotify" | "cyan" | "emerald" | "yellow" | "magenta" | "purple" | "orange" | "none";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  glowColor = "emerald",
  ...props
}) => {
  const glowClasses = {
    spotify: "group-hover:bg-[#1DB954]/15 bg-[#1DB954]/5",
    cyan: "group-hover:bg-cyan-500/15 bg-cyan-500/5",
    emerald: "group-hover:bg-emerald-500/15 bg-emerald-500/5",
    yellow: "group-hover:bg-yellow-500/15 bg-yellow-500/5",
    magenta: "group-hover:bg-pink-500/15 bg-pink-500/5",
    purple: "group-hover:bg-purple-500/15 bg-purple-500/5",
    orange: "group-hover:bg-orange-500/15 bg-orange-500/5",
    none: "hidden",
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, scale: 1.005 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 shadow-xl",
        hoverEffect && "hover:border-[#1DB954]/40 hover:bg-white/[0.05] hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {/* Soft & Subdued Light Refraction Overlay */}
      {glowColor !== "none" && (
        <div
          className={cn(
            "pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl transition-all duration-500 opacity-40 group-hover:opacity-70",
            glowClasses[glowColor]
          )}
        />
      )}

      {/* Content Wrapper */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
