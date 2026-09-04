"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Github, Instagram, Linkedin, Mail, MapPin, Heart } from "lucide-react";
import { fetchSiteSettings } from "@/services";
import { fallbackSiteSettings } from "@/constants";

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState(fallbackSiteSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSiteSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error("Error loading site settings for footer:", err);
      }
    }
    loadSettings();
  }, []);

  return (
    <footer className="relative border-t border-white/10 bg-[#07090E] pt-16 pb-26 text-slate-400">
      {/* Glow Refraction */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-full max-w-4xl bg-gradient-to-t from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-1 shadow-[0_0_20px_rgba(29,185,84,0.2)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-hmpsti.webp"
                  alt="Logo Resmi HMPSTI SWU"
                  className="h-full w-full object-contain drop-shadow"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold tracking-wider text-white text-lg">HMPSTI</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded border border-[#1DB954]/40 bg-[#1DB954]/10 text-[#1DB954]">SWU</span>
                </div>
                <p className="text-xs text-slate-400">STMIK Widya Utama Purwokerto</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Wadah komunikasi, ekspresi karya, pengembangan potensi, dan inovasi teknologi mahasiswa prodi Teknik Informatika STMIK Widya Utama.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/LPT-HMPSTI"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-cyan-400"
                aria-label="GitHub HMPSTI"
              >
                <Github size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.instagram.com/hmpsti.swu/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-cyan-400"
                aria-label="Instagram HMPSTI"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-cyan-400"
                aria-label="LinkedIn HMPSTI"
              >
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-white">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="transition-colors hover:text-cyan-300">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/berita" className="transition-colors hover:text-cyan-300">
                  Portal Berita
                </Link>
              </li>
              <li>
                <Link href="/visi-misi" className="transition-colors hover:text-cyan-300">
                  Visi & Misi
                </Link>
              </li>
              <li>
                <Link href="/struktur" className="transition-colors hover:text-cyan-300">
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link href="/keanggotaan" className="transition-colors hover:text-cyan-300">
                  Keanggotaan & Alumni
                </Link>
              </li>
              <li>
                <Link href="/karya" className="transition-colors hover:text-cyan-300">
                  Showcase Karya
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="transition-colors hover:text-cyan-300">
                  Galeri Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="transition-colors hover:text-cyan-300">
                  Kontak & Aspirasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Divisi Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-white">Divisi HMPSTI</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/divisi/medkominfo" className="transition-colors hover:text-cyan-300">
                  MEDKOMINFO
                </Link>
              </li>
              <li>
                <Link href="/divisi/lpt" className="transition-colors hover:text-cyan-300">
                  LPT
                </Link>
              </li>
              <li>
                <Link href="/divisi/humas" className="transition-colors hover:text-cyan-300">
                  HUMAS
                </Link>
              </li>
              <li>
                <Link href="/divisi/kwu" className="transition-colors hover:text-cyan-300">
                  KWU
                </Link>
              </li>
              <li>
                <Link href="/divisi/psdm" className="transition-colors hover:text-cyan-300">
                  PSDM
                </Link>
              </li>
            </ul>
          </div>

          {/* Sekretariat Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-white">Sekretariat HMPS-TI</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "STMIK Widya Utama Purwokerto")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 group transition-colors hover:text-cyan-300"
                title="Buka Lokasi di Google Maps"
              >
                <MapPin size={16} strokeWidth={1.5} className="text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">{settings.address || "Gedung Kampus STMIK Widya Utama, Purwokerto, Jawa Tengah"}</span>
              </a>

              <a
                href={`mailto:${settings.email || "hmps-ti@stmik-widya-utama.ac.id"}`}
                className="flex items-center gap-2 group transition-colors hover:text-cyan-300"
                title="Kirim Email ke HMPSTI"
              >
                <Mail size={16} strokeWidth={1.5} className="text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{settings.email || "hmps-ti@stmik-widya-utama.ac.id"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {settings.current_period || "2026"} HMPSTI STMIK Widya Utama. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

