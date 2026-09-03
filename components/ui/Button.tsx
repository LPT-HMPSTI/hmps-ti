"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

/**
 * Komponen tombol aksi utama dengan animasi Framer Motion (hover scale + lift).
 * Meng-extend HTMLMotionProps sehingga mendukung semua props native button HTML.
 *
 * @param variant       - Gaya visual tombol; default "spotify".
 * @param size          - Ukuran padding & teks; default "md".
 * @param pill          - Jika true, sudut tombol sepenuhnya bulat (rounded-full); default true.
 * @param icon          - Ikon opsional yang ditampilkan di sisi kiri atau kanan teks.
 * @param iconPosition  - Posisi ikon relatif terhadap teks; default "right".
 */
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "spotify" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "spotify",
  size = "md",
  pill = true,
  className,
  icon,
  iconPosition = "right",
  ...props
}) => {
  const variantClasses = {
    spotify:
      "bg-[#1DB954] text-black font-extrabold shadow-[0_0_20px_rgba(29,185,84,0.35)] hover:shadow-[0_0_25px_rgba(29,185,84,0.55)] border border-emerald-300/30",
    primary:
      "bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_25px_rgba(0,242,254,0.55)] border border-cyan-300/30",
    secondary:
      "bg-gradient-to-r from-[#00E676] to-[#00F2FE] text-slate-950 font-bold shadow-[0_0_20px_rgba(0,230,118,0.35)] hover:shadow-[0_0_25px_rgba(0,230,118,0.55)] border border-emerald-300/30",
    glass:
      "bg-white/[0.05] text-white border border-white/10 hover:border-emerald-400/40 hover:bg-white/[0.1] backdrop-blur-md shadow-lg",
    outline:
      "border border-[#1DB954]/60 text-[#1DB954] hover:bg-[#1DB954]/10 hover:shadow-[0_0_20px_rgba(29,185,84,0.3)] backdrop-blur-sm",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2.5",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.015, y: -0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center justify-center font-sans tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
        pill ? "rounded-full" : "rounded-xl",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
    </motion.button>
  );
};
