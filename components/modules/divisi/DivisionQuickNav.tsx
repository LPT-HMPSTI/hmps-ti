"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Disc, Users, ListMusic } from "lucide-react";
import { motion } from "framer-motion";

export interface DivisionQuickNavProps {
  currentSlug: string;
  onScrollTo: (id: string) => void;
}

const divisionList = [
  { slug: "bph", name: "BPH" },
  { slug: "psdm", name: "PSDM" },
  { slug: "lpt", name: "LPT" },
  { slug: "kwu", name: "KWU" },
  { slug: "medkominfo", name: "MEDKOMINFO" },
  { slug: "humas", name: "HUMAS" },
];

/**
 * Bar navigasi adaptif lompat cepat untuk Halaman Profil Divisi,
 * identik dengan OrgQuickNav pada halaman Struktur Organisasi.
 */
export const DivisionQuickNav: React.FC<DivisionQuickNavProps> = ({
  currentSlug,
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

    const sectionIds = ["hero-leadership", "pengurus-section", "proker-section"];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-20 z-40 flex justify-center py-2 px-2 pointer-events-none">
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
      >
        {/* Back Link */}
        <Link
          href="/struktur"
          className="flex items-center gap-1 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors pr-2 border-r border-white/10"
        >
          <ArrowLeft size={14} />
          {!isScrolled && <span className="hidden sm:inline">Struktur</span>}
        </Link>

        {/* Division Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full scrollbar-none">
          {divisionList.map((div) => {
            const isActive = div.slug === currentSlug;
            return (
              <Link key={div.slug} href={`/divisi/${div.slug}`}>
                <button
                  type="button"
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#1DB954] text-black shadow-[2px_2px_0px_0px_#000000] scale-105"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {div.name}
                </button>
              </Link>
            );
          })}
        </div>

        {/* Section Jump Anchors */}
        <div className="hidden md:flex items-center gap-1 pl-2 border-l border-white/10">
          <button
            type="button"
            onClick={() => onScrollTo("pengurus-section")}
            className={`p-1.5 rounded-full transition-colors ${
              activeSection === "pengurus-section"
                ? "text-[#1DB954] bg-white/10"
                : "text-slate-400 hover:text-white"
            }`}
            title="Lineup Pengurus"
          >
            <Users size={15} />
          </button>

          <button
            type="button"
            onClick={() => onScrollTo("proker-section")}
            className={`p-1.5 rounded-full transition-colors ${
              activeSection === "proker-section"
                ? "text-[#1DB954] bg-white/10"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tracklist Program Kerja"
          >
            <ListMusic size={15} />
          </button>
        </div>
      </motion.nav>
    </div>
  );
};
