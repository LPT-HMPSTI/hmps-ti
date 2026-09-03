"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Komponen badge label neubrutalis dengan berbagai warna variant.
 *
 * @param variant  - Warna tema badge; default "spotify" (hijau). Variant "glass" tampil
 *                   tanpa border tebal dan tanpa dot aksen.
 * @param tilt     - Kemiringan badge; "left" atau "right" menambahkan rotasi ringan.
 * @param pulse    - Jika true, dot aksen beranimasi ping (berguna untuk status aktif/live).
 * @param noDot    - Sembunyikan dot aksen meski variant bukan "glass".
 * @param icon     - Ikon opsional yang tampil di sebelah kiri teks.
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "spotify" | "cyan" | "yellow" | "strawberry" | "magenta" | "emerald" | "purple" | "orange" | "amber" | "glass";
  tilt?: "left" | "right" | "none";
  pulse?: boolean;
  noDot?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "spotify",
  tilt = "none",
  pulse = false,
  noDot = false,
  className,
  icon,
}) => {
  // Full-Background Neubrutalism Badges (Vibrant Solid Fill, 2px Black Border, Hard Shadow)
  const variants = {
    spotify:
      "bg-[#1DB954] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    cyan: "bg-[#00F2FE] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    yellow:
      "bg-[#FFD700] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    strawberry:
      "bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    magenta:
      "bg-[#FF007F] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    emerald:
      "bg-[#00E676] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    purple:
      "bg-[#A855F7] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    orange:
      "bg-[#FF8C00] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    amber:
      "bg-[#FF8C00] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000]",
    // Subtle frosted glass variant for minimal inline status tags
    glass:
      "bg-white/[0.08] text-cyan-300 border border-white/20 backdrop-blur-md shadow-sm rounded-md px-2.5 py-0.5 text-[10px] font-mono font-medium tracking-wide normal-case",
  };

  const tilts = {
    left: "-rotate-2 hover:rotate-0 transition-transform duration-200",
    right: "rotate-2 hover:rotate-0 transition-transform duration-200",
    none: "rotate-0",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1 my-1 text-[11px] font-mono font-black uppercase tracking-wider cursor-default select-none shrink-0 pointer-events-auto",
        variants[variant],
        tilts[tilt],
        className
      )}
    >
      {/* Black Peg Dot Accent */}
      {variant !== "glass" && !noDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-current opacity-80 shrink-0",
            pulse && "animate-ping opacity-100"
          )}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
