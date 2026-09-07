"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

export interface DivisionCtaSectionProps {
  divisionName: string;
  divisionShort: string;
  divisionSlug: string;
}

/**
 * Komponen Kotak Kontak & Aspirasi Divisi.
 * Desain bersih, ringkas, dan fokus pada aksi pengguna.
 */
export const DivisionCtaSection: React.FC<DivisionCtaSectionProps> = ({
  divisionName,
}) => {
  return (
    <section className="rounded-3xl border-2 border-black bg-[#0c0e14] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#000000] space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[11px] font-mono font-bold text-[#1DB954] uppercase tracking-wider">
            Komunikasi & Sinergi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Punya Usulan atau Agenda Kolaborasi Bersama {divisionName}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Badan Pengurus Harian senantiasa terbuka menerima masukan, ide kegiatan, serta aspirasi
            demi kemajuan sivitas akademika Teknik Informatika STMIK Widya Utama.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <Link href="/kontak" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-black bg-[#1DB954] text-black text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000000] hover:bg-[#1ed760] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <span>Sampaikan Aspirasi</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </Link>

          <Link href="/struktur" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-black bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <span>Struktur Kabinet</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
