"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Globe, GraduationCap, BookOpen, Library, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { fetchSiteSettings } from "@/services";
import { fallbackSiteSettings } from "@/constants";

interface DirectLinkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectLinkDrawer: React.FC<DirectLinkDrawerProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(fallbackSiteSettings);

  useEffect(() => {
    async function load() {
      const s = await fetchSiteSettings();
      if (s) setSettings(s);
    }
    load();
  }, []);
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const directLinks = [
    {
      id: "main-web",
      title: "Website Utama SWU",
      description: "Portal resmi STMIK Widya Utama untuk berita & informasi kampus.",
      url: "https://stmik-widya-utama.ac.id",
      icon: Globe,
      badge: "Utama",
      glowColor: "cyan",
    },
    {
      id: "siakad",
      title: "SIAKAD SWU",
      description: "Sistem Informasi Akademik: KRS, KHS, Nilai & Jadwal Kuliah.",
      url: "https://siakad.stmik-widya-utama.ac.id",
      icon: GraduationCap,
      badge: "Akademik",
      glowColor: "emerald",
    },
    {
      id: "elearning",
      title: "E-Learning / LMS",
      description: "Portal pembelajaran online, materi kuliah & pengumpulan tugas.",
      url: "https://elearning.stmik-widya-utama.ac.id",
      icon: BookOpen,
      badge: "Kuliah Online",
      glowColor: "cyan",
    },
    {
      id: "library",
      title: "Perpustakaan Digital",
      description: "Akses E-Book, Jurnal Ilmiah, Tesis, dan Repository Kampus.",
      url: "https://perpus.stmik-widya-utama.ac.id",
      icon: Library,
      badge: "E-Library",
      glowColor: "emerald",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            data-lenis-prevent
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#07090E]/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                  <Sparkles size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">Direct Portal Menu</h2>
                  <p className="text-xs text-slate-400">Pintu Gerbang Akademik SWU</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-white"
                aria-label="Tutup Menu"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Sub-header info */}
            <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-3 text-xs text-cyan-300">
              <p>Akses cepat menuju seluruh layanan & portal digital resmi STMIK Widya Utama.</p>
            </div>

            {/* Links List */}
            <div className="mt-6 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1">
              {directLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.06] hover:shadow-[0_8px_25px_rgba(0,242,254,0.15)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors duration-300 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                        <IconComponent size={22} strokeWidth={1.5} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate font-semibold text-white transition-colors group-hover:text-cyan-300">
                            {link.title}
                          </h3>
                          <Badge variant={link.glowColor === "emerald" ? "emerald" : "cyan"}>
                            {link.badge}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {link.description}
                        </p>
                      </div>

                      <ExternalLink
                        size={16}
                        strokeWidth={1.5}
                        className="text-slate-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-400"
                      />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="mt-auto border-t border-white/10 pt-4 text-center text-xs text-slate-500">
              <p>HMPSTI STMIK Widya Utama © {settings.current_period || "2026"}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
