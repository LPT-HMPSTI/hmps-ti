"use client";

import React from "react";

const pillarsData = [
  {
    number: "01",
    title: "Sinergi & Harmonisasi",
    tagline: "Koordinasi Lintas Divisi",
    desc: "Menyelaraskan arah gerak dan timeline kerja seluruh divisi teknis maupun operasional agar setiap program berjalan terpadu tanpa tumpang tindih.",
    focus: ["Sinkronisasi Timeline", "Rapat Koordinasi Rutin", "Evaluasi Berkala"],
  },
  {
    number: "02",
    title: "Akuntabilitas Tata Kelola",
    tagline: "Administrasi & Keuangan",
    desc: "Menjaga standar tata persuratan resmi, transparansi pembukuan kas organisasi, serta penyusunan laporan pertanggungjawaban yang kredibel.",
    focus: ["Pengarsipan Terpusat", "Transparansi Anggaran", "Standarisasi LPJ"],
  },
  {
    number: "03",
    title: "Advokasi & Representasi",
    tagline: "Penyalur Aspirasi Mahasiswa",
    desc: "Menjembatani aspirasi akademik, fasilitas belajar, dan kebutuhan mahasiswa Teknik Informatika langsung ke pimpinan program studi.",
    focus: ["Advokasi Akademik", "Kemitraan Sivitas", "Pemberdayaan Mahasiswa"],
  },
];

/**
 * Komponen 3 Pilar Tata Kelola BPH.
 * Arsitektur editorial minimalis dan terstruktur tanpa clutter ikon.
 */
export const DivisionPillars: React.FC = () => {
  return (
    <section className="space-y-6 pt-2">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <span className="text-[11px] font-mono font-bold text-[#1DB954] uppercase tracking-wider">
          Haluan Kepemimpinan
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          3 Pilar Kebijakan BPH
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Prinsip dasar yang memandu Badan Pengurus Harian dalam memimpin roda organisasi, menjaga
          kredibilitas administrasi, dan memperjuangkan aspirasi mahasiswa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pillarsData.map((pillar) => (
          <div
            key={pillar.number}
            className="flex flex-col justify-between rounded-2xl border-2 border-black bg-[#0c0e14] p-6 sm:p-7 shadow-[4px_4px_0px_0px_#000000] hover:border-slate-700 transition-colors space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-3xl font-black text-[#1DB954]">
                  {pillar.number}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {pillar.tagline}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {pillar.desc}
                </p>
              </div>
            </div>

            {/* Keyword tags */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
              {pillar.focus.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/[0.03] border border-white/10"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
