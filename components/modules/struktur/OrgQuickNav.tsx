"use client";

import React, { useState, useEffect } from "react";
import { Disc, Users, ListMusic } from "lucide-react";
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

// Standar urutan divisi selaras dengan DivisionQuickNav
const divisionStandardList = [
  { slug: "bph", name: "BPH", targetId: "hero-leadership" },
  { slug: "psdm", name: "PSDM", targetId: "divisi-psdm" },
  { slug: "lpt", name: "LPT", targetId: "divisi-lpt" },
  { slug: "kwu", name: "KWU", targetId: "divisi-kwu" },
  { slug: "medkominfo", name: "MEDKOMINFO", targetId: "divisi-medkominfo" },
  { slug: "humas", name: "HUMAS", targetId: "divisi-humas" },
];

/**
 * Bar navigasi adaptif lompat cepat untuk Halaman Struktur Organisasi (/struktur),
 * dibuat identik dengan DivisionQuickNav pada halaman per divisi.
 */
export const OrgQuickNav: React.FC<OrgQuickNavProps> = ({
  divisionConfigs,
  onScrollTo,
}) => {
  const [activeSection, setActiveSection] = useState<string>("hero-leadership");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = [
      "hero-leadership",
      "pengurus-bph",
      ...divisionStandardList.filter((d) => d.slug !== "bph").map((d) => d.targetId),
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleItemClick = (id: string) => {
    setActiveSection(id);
    onScrollTo(id);
  };

  return (
    <div className="sticky top-20 z-30 flex justify-center py-2 px-2 pointer-events-none w-full">
      <motion.nav
        layout
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 30,
        }}
        className={`pointer-events-auto rounded-full border-2 border-black bg-[#121212]/95 backdrop-blur-md shadow-2xl flex items-center transition-all ${
          isScrolled
            ? "px-3 py-1.5 gap-2 border-white/20"
            : "px-4 sm:px-6 py-2 gap-3 sm:gap-4 border-white/10"
        }`}
        aria-label="Katalog Struktur Organisasi"
      >
        {/* Left Brand / Top Scroll Anchor */}
        <button
          type="button"
          onClick={() => handleItemClick("hero-leadership")}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors pr-2 border-r border-white/10 shrink-0 cursor-pointer"
          title="Ke Puncak Struktur Organisasi"
        >
          <Disc size={14} className="text-[#1DB954]" />
          {!isScrolled && <span className="hidden sm:inline">Katalog</span>}
        </button>

        {/* Division Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none">
          {divisionStandardList.map((div) => {
            const isBph = div.slug === "bph";
            const isActive = isBph
              ? activeSection === "hero-leadership" || activeSection === "pengurus-bph"
              : activeSection === div.targetId;

            return (
              <button
                key={div.slug}
                type="button"
                onClick={() => handleItemClick(div.targetId)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#1DB954] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] -rotate-1 hover:rotate-0 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-white/10 hover:-rotate-1"
                }`}
              >
                {div.name}
              </button>
            );
          })}
        </div>

        {/* Section Jump Anchors */}
        <div className="hidden md:flex items-center gap-1 pl-2 border-l border-white/10">
          <button
            type="button"
            onClick={() => onScrollTo("pengurus-bph")}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              activeSection === "pengurus-bph"
                ? "text-[#1DB954] bg-white/10"
                : "text-slate-400 hover:text-white"
            }`}
            title="Pengurus Inti BPH"
          >
            <Users size={15} />
          </button>

          <button
            type="button"
            onClick={() => onScrollTo("divisi-psdm")}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              activeSection.startsWith("divisi-")
                ? "text-[#1DB954] bg-white/10"
                : "text-slate-400 hover:text-white"
            }`}
            title="Album Seluruh Divisi"
          >
            <ListMusic size={15} />
          </button>
        </div>
      </motion.nav>
    </div>
  );
};
