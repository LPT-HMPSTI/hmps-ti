"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import {
  CircleNotch,
  ShieldCheck,
  GraduationCap,
  IdentificationCard,
  Cpu,
  Trophy,
  SealCheck,
  Globe,
} from "@phosphor-icons/react";

export interface LogoMeaningItem {
  id: string;
  badgeText: string;
  badgeVariant: "cyan" | "spotify" | "yellow" | "purple" | "emerald" | "orange" | "amber";
  desc: string;
  icon: React.ElementType;
}

const logoMeanings: LogoMeaningItem[] = [
  {
    id: "bentuk-lingkaran",
    badgeText: "Bentuk Lingkaran",
    badgeVariant: "cyan",
    desc: "Melambangkan kekompakan, persatuan, dan kesinambungan antarmahasiswa TI.",
    icon: CircleNotch,
  },
  {
    id: "warna-abu",
    badgeText: "Warna Dasar Abu-Abu",
    badgeVariant: "spotify",
    desc: "Menggambarkan ketenangan, profesionalitas, dan kestabilan.",
    icon: ShieldCheck,
  },
  {
    id: "tulisan-swu",
    badgeText: "STMIK WIDYA UTAMA",
    badgeVariant: "purple",
    desc: "Menunjukkan bahwa HMPS-TI berada di bawah naungan institusi resmi STMIK Widya Utama Purwokerto.",
    icon: GraduationCap,
  },
  {
    id: "tulisan-hmpsti",
    badgeText: "HMPS-TI Utama",
    badgeVariant: "emerald",
    desc: "Menjadi identitas inti Himpunan Mahasiswa Program Studi Teknik Informatika.",
    icon: IdentificationCard,
  },
  {
    id: "warna-biru",
    badgeText: "Warna Biru HMPS-TI",
    badgeVariant: "cyan",
    desc: "Biru identik dengan teknologi, kepercayaan, intelektualitas, dan inovasi.",
    icon: Cpu,
  },
  {
    id: "garis-emas",
    badgeText: "Aksen Garis Emas",
    badgeVariant: "yellow",
    desc: "Warna emas melambangkan kejayaan, harapan, prestasi, dan nilai yang tinggi.",
    icon: Trophy,
  },
  {
    id: "lingkar-bawah",
    badgeText: "Tulisan Lingkar Bawah",
    badgeVariant: "cyan",
    desc: "Menegaskan nama organisasi secara lengkap secara formal. Memberikan legitimasi bahwa logo ini adalah identitas resmi himpunan.",
    icon: SealCheck,
  },
  {
    id: "background-globe",
    badgeText: "Background Pola Globe",
    badgeVariant: "purple",
    desc: "Mewakili dunia digital dan globalisasi teknologi. Menggambarkan bahwa mahasiswa Teknik Informatika harus siap bersaing dan berpikir secara luas.",
    icon: Globe,
  },
];

/**
 * Komponen Makna Logo HMPS-TI dalam 1 Card Utama Spotify Neubrutalism.
 */
export const LogoMeaningSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="w-full"
    >
      {/* SATU CARD UTAMA WIDE NEUBRUTALISM SPOTIFY */}
      <div className="relative z-10 overflow-hidden rounded-3xl border-2 border-black bg-[#121520] p-5 sm:p-7 lg:p-8 shadow-[6px_6px_0px_0px_#000000] backdrop-blur-xl w-full">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#1DB954]/10 blur-3xl pointer-events-none" />

        {/* TOP HEADER INSIDE CARD */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-6 sm:mb-8 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#1DB954] uppercase tracking-wider">
                FILOSOFI LOGO & IDENTITAS VISUAL
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Makna Logo HMPS-TI
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="cyan" tilt="left">
              IDENTITAS VISUAL
            </Badge>
            <Badge variant="spotify" tilt="right">
              STMIK WIDYA UTAMA
            </Badge>
          </div>
        </div>

        {/* CONTENT GRID INSIDE SINGLE CARD */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN (DESKTOP) / TOP SECTION (MOBILE): LOGO BESAR */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative group">
              <div className="relative h-52 w-52 sm:h-64 sm:w-64 lg:h-72 lg:w-72 rounded-full border-2 border-black bg-[#1a1e2e] p-5 shadow-[6px_6px_0px_0px_#1DB954] group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                <Image
                  src="/logo-hmpsti.webp"
                  alt="Logo Resmi HMPS-TI STMIK Widya Utama"
                  width={260}
                  height={260}
                  className="object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.35)] group-hover:drop-shadow-[0_0_30px_rgba(29,185,84,0.45)] transition-all duration-300"
                  priority
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="spotify" tilt="left">
                  IDENTITAS RESMI
                </Badge>
                <Badge variant="yellow" tilt="right">
                  HMPS-TI SWU
                </Badge>
              </div>
              <p className="text-xs text-slate-400 max-w-xs font-sans leading-relaxed">
                Himpunan Mahasiswa Program Studi Teknik Informatika STMIK Widya Utama Purwokerto.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN (DESKTOP) / BOTTOM SECTION (MOBILE): POIN-POIN EXPLANATION */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {logoMeanings.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#1a1e2e]/70 border border-white/10 hover:border-[#1DB954]/50 hover:bg-[#1a1e2e] transition-all duration-200 group space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:text-[#1DB954] transition-colors shrink-0">
                        <Icon size={16} weight="duotone" />
                      </div>
                      <Badge variant={item.badgeVariant}>
                        {item.badgeText}
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      0{idx + 1}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans pt-0.5">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
