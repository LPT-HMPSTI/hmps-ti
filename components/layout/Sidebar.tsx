"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  NewspaperClipping,
  Target,
  UsersThree,
  UserCheck,
  Code,
  Image as ImageIcon,
  ChatCircleDots,
  TerminalWindow,
  CaretRight,
  GraduationCap,
  BookOpen,
  Books,
  Globe,
  ArrowSquareOut,
} from "@phosphor-icons/react";

interface SidebarProps {
  onOpenDirectLink: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDirectLink }) => {
  const pathname = usePathname();

  const mainNav = [
    { name: "Beranda", href: "/", icon: House },
    { name: "Portal Berita", href: "/berita", icon: NewspaperClipping },
    { name: "Visi & Misi", href: "/visi-misi", icon: Target },
    { name: "Struktur Organisasi", href: "/struktur", icon: UsersThree },
    { name: "Keanggotaan", href: "/keanggotaan", icon: UserCheck },
    { name: "Showcase Karya", href: "/karya", icon: Code },
    { name: "Galeri Kegiatan", href: "/galeri", icon: ImageIcon },
    { name: "Kontak & Aspirasi", href: "/kontak", icon: ChatCircleDots },
  ];

  const divisiNav = [
    { name: "BPH", href: "/divisi/bph", short: "BPH", color: "from-cyan-500 to-blue-500" },
    { name: "PSDM", href: "/divisi/psdm", short: "PSDM", color: "from-emerald-500 to-teal-500" },
    { name: "LPT", href: "/divisi/lpt", short: "LPT", color: "from-cyan-400 to-emerald-400" },
    { name: "MEDKOMINFO", href: "/divisi/medkominfo", short: "MEDKOMINFO", color: "from-purple-500 to-cyan-400" },
    { name: "HUMAS", href: "/divisi/humas", short: "HUMAS", color: "from-blue-400 to-emerald-400" },
    { name: "KWU", href: "/divisi/kwu", short: "KWU", color: "from-amber-400 to-emerald-500" },
  ];

  const campusPortals = [
    { name: "SIAKAD SWU", url: "https://siakad.stmik-widya-utama.ac.id", icon: GraduationCap },
    { name: "E-Learning LMS", url: "https://elearning.stmik-widya-utama.ac.id", icon: BookOpen },
    { name: "Perpustakaan", url: "https://perpus.stmik-widya-utama.ac.id", icon: Books },
    { name: "Web Utama", url: "https://stmik-widya-utama.ac.id", icon: Globe },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-30 hidden w-64 flex-col gap-2 p-3 lg:flex">
      {/* Top Brand & Main Navigation Panel */}
      <div className="rounded-2xl border border-white/10 bg-[#121520]/90 p-4 backdrop-blur-xl shadow-2xl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-1 shadow-[0_0_20px_rgba(29,185,84,0.25)] transition-transform duration-300 group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-hmpsti.webp"
              alt="Logo Resmi HMPSTI SWU"
              className="h-full w-full object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold tracking-wider text-white text-base">HMPSTI</span>
              <span className="text-[10px] font-mono font-bold text-[#1DB954]">SWU</span>
            </div>
            <p className="text-[10px] tracking-tight text-slate-400">STMIK Widya Utama</p>
          </div>
        </Link>

        {/* Main Nav Items */}
        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.08] text-[#1DB954] border border-emerald-500/30 shadow-[0_0_15px_rgba(29,185,84,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <IconComponent size={18} weight={isActive ? "fill" : "light"} className={isActive ? "text-[#1DB954]" : "text-slate-400"} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Enhanced Bottom-Left Panel */}
      <div
        data-lenis-prevent
        className="flex-1 overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#121520]/90 p-3.5 backdrop-blur-xl shadow-2xl flex flex-col gap-4 custom-scrollbar"
      >
        {/* Divisi HIMA Header */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Divisi HMPSTI</span>
            <span className="text-[9px] font-mono font-medium text-[#1DB954] bg-[#1DB954]/10 px-1.5 py-0.5 rounded border border-[#1DB954]/20">Developing...</span>
          </div>

          <div className="flex flex-col gap-1 m-auto">
            {divisiNav.map((div) => {
              const isActive = pathname === div.href;
              return (
                <Link
                  key={div.href}
                  href={div.href}
                  // py atur ke 1.5 jika drawer diaktifkan
                  className={`group flex items-center justify-between rounded-xl px-2.5 py-2.5 text-xs transition-all duration-200 ${
                    isActive
                      ? "bg-[#1DB954]/15 text-cyan-300 font-semibold border border-[#1DB954]/30 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${div.color} shrink-0`} />
                    <span className="truncate text-[11px]">{div.name}</span>
                  </div>
                  <CaretRight size={12} weight="bold" className="text-slate-500 group-hover:text-slate-200 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Developing */}
        {/* Direct Link Campus Portals */}
        {/* <div className="mt-auto border-t border-white/10 pt-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">Portal Kampus</span>
            <button
              onClick={onOpenDirectLink}
              className="text-[10px] text-[#1DB954] hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Drawer</span>
              <ArrowSquareOut size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {campusPortals.map((portal) => {
              const IconComponent = portal.icon;
              return (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-[10px] text-slate-300 transition-all hover:border-[#1DB954]/40 hover:bg-[#1DB954]/10 hover:text-white"
                >
                  <IconComponent size={14} weight="light" className="text-[#1DB954] shrink-0" />
                  <span className="truncate">{portal.name}</span>
                </a>
              );
            })}
          </div>
        </div> */}
      </div>
    </aside>
  );
};
