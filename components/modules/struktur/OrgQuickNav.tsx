"use client";

import React, { useState, useEffect } from "react";
import { Music } from "lucide-react";
import { motion } from "framer-motion";

export interface DivisionConfigItem {
  slug: string;
  name: string;
  fullname?: string;
  variantColor?: string;
}

export interface OrgQuickNavProps {
  divisionConfigs: DivisionConfigItem[];
  onScrollTo: (id: string) => void;
}

/**
 * Menghasilkan label kode ringkas untuk mode teardrop minimalis
 */
const getShortCode = (name: string, slug: string): string => {
  const s = slug.toLowerCase();
  if (s.includes("medkom")) return "MEDKOM";
  if (s.includes("lpt")) return "LPT";
  if (s.includes("humas")) return "HUMAS";
  if (s.includes("kwu") || s.includes("kewirausahaan")) return "KWU";
  if (s.includes("psdm")) return "PSDM";
  return name.replace(/divisi\s*/i, "").trim().toUpperCase();
};

/**
 * Bar navigasi lompat cepat (*quick jump*) adaptif dengan animasi morphing Framer Motion:
 * - Tampilan luas saat di bagian atas halaman
 * - Berubah menjadi floating teardrop capsule minimalis yang ringkas saat di-scroll ke bawah
 * - Animasi transisi spring yang halus antar status
 */
export const OrgQuickNav: React.FC<OrgQuickNavProps> = ({
  divisionConfigs,
  onScrollTo,
}) => {
  const [activeSection, setActiveSection] = useState<string>("hero-leadership");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Monitor scroll position: beralih ke mode teardrop saat scroll ke bawah
  // dan kembali ke ukuran normal HANYA saat halaman di-scroll kembali ke paling atas
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Deteksi seksi aktif saat pengguna menggulir halaman
  useEffect(() => {
    const sectionIds = [
      "hero-leadership",
      ...divisionConfigs.map((d) => `divisi-${d.slug}`),
    ];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0.05,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [divisionConfigs]);

  const handleItemClick = (id: string) => {
    setActiveSection(id);
    onScrollTo(id);
  };

  const isMinimal = isScrolled;

  return (
    <div className="sticky top-16 sm:top-20 z-20 py-2 pointer-events-none flex justify-center w-full">
      <motion.nav
        layout
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 28,
          mass: 0.8,
        }}
        className={`pointer-events-auto backdrop-blur-2xl transition-colors duration-300 ${
          isMinimal
            ? "w-auto max-w-[95vw] sm:max-w-fit rounded-full sm:rounded-[2rem] rounded-tl-lg bg-[#0E121E]/90 border border-[#1DB954]/40 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(29,185,84,0.2)] p-2 sm:px-4 sm:py-2"
            : "w-full rounded-2xl bg-[#121520]/95 border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.85)] p-3.5 sm:p-4"
        }`}
        aria-label="Navigasi Katalog Struktur"
      >
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 max-w-full">
          {/* LEFT BRAND / TEARDROP ICON INDICATOR */}
          <div className="flex items-center gap-2 shrink-0 select-none">
            {isMinimal ? (
              // Minimalist Teardrop Icon Indicator
              <motion.div
                key="minimal-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 pl-1"
                title="Katalog Struktur"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-2.5 w-2.5 rounded-full bg-[#1DB954] opacity-75 animate-ping" />
                  <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#1DB954]/20 border border-[#1DB954]/60 text-[#1DB954]">
                    <Music size={12} />
                  </span>
                </div>
                <span className="hidden md:inline text-[11px] font-mono font-extrabold text-[#1DB954] tracking-wider">
                  KATALOG
                </span>
                <span className="text-white/20 hidden sm:inline">|</span>
              </motion.div>
            ) : (
              // Expanded Wide Title
              <motion.div
                key="expanded-icon"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1DB954]/15 border border-[#1DB954]/30 text-[#1DB954]">
                  <Music size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-black uppercase text-[#1DB954] tracking-wider">
                    STRUCTURE CATALOGUE
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    Navigasi Divisi
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT TABS / PILL BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full py-0.5 custom-scrollbar">
            {/* BPH BUTTON */}
            <button
              type="button"
              onClick={() => handleItemClick("hero-leadership")}
              className={`relative text-xs font-mono transition-all cursor-pointer shrink-0 select-none ${
                isMinimal
                  ? "px-2.5 py-1 text-[11px] font-bold rounded-full"
                  : "px-3 py-1.5 rounded-full font-bold"
              } ${
                activeSection === "hero-leadership"
                  ? "text-black font-black"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {activeSection === "hero-leadership" && (
                <motion.span
                  layoutId="activePillGlider"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                  className="absolute inset-0 rounded-full bg-[#1DB954] border-2 border-black shadow-[0_0_15px_rgba(29,185,84,0.45)] z-0"
                />
              )}
              <span className="relative z-10">BPH</span>
            </button>

            {/* DIVISION BUTTONS */}
            {divisionConfigs.map((d) => {
              const id = `divisi-${d.slug}`;
              const isActive = activeSection === id;
              const displayName = isMinimal ? getShortCode(d.name, d.slug) : d.name;

              return (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => handleItemClick(id)}
                  title={d.name}
                  className={`relative text-xs font-mono transition-all cursor-pointer shrink-0 select-none ${
                    isMinimal
                      ? "px-2.5 py-1 text-[11px] font-medium rounded-full"
                      : "px-3 py-1.5 rounded-full"
                  } ${
                    isActive
                      ? "text-black font-black"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activePillGlider"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-[#1DB954] border-2 border-black shadow-[0_0_15px_rgba(29,185,84,0.45)] z-0"
                    />
                  )}
                  <span className="relative z-10">{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </div>
  );
};
