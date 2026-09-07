"use client";

import React, { useState, useMemo } from "react";
import { ListMusic, Play, Pause } from "lucide-react";
import { WorkProgram } from "@/types";

export interface DivisionProkerSectionProps {
  workPrograms: WorkProgram[];
  divisionSlug: string;
  divisionName: string;
}

type FilterStatus = "ALL" | "MENDATANG" | "BERJALAN" | "SELESAI";

const statusFilters: { id: FilterStatus; label: string }[] = [
  { id: "ALL", label: "Semua Tracks" },
  { id: "BERJALAN", label: "Sedang Berjalan" },
  { id: "MENDATANG", label: "Mendatang" },
  { id: "SELESAI", label: "Selesai" },
];

const getStatusBadge = (status: string) => {
  const s = (status || "").toUpperCase();
  switch (s) {
    case "SELESAI":
      return {
        label: "Selesai",
        badgeClass: "bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/40",
        progressClass: "bg-[#1DB954]",
        percent: 100,
      };
    case "BERJALAN":
      return {
        label: "Berjalan",
        badgeClass: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
        progressClass: "bg-cyan-400",
        percent: 55,
      };
    case "MENDATANG":
    default:
      return {
        label: "Mendatang",
        badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
        progressClass: "bg-amber-400",
        percent: 15,
      };
  }
};

/**
 * Komponen Program Kerja Divisi dengan tampilan Spotify Tracklist,
 * diselaraskan dengan tata letak komponen /struktur (OrgBphSection & OrgHeroLeadership).
 */
export const DivisionProkerSection: React.FC<DivisionProkerSectionProps> = ({
  workPrograms,
  divisionSlug,
  divisionName,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  const filteredPrograms = useMemo(() => {
    if (activeFilter === "ALL") return workPrograms;
    return workPrograms.filter(
      (wp) => (wp.status || "").toUpperCase() === activeFilter
    );
  }, [workPrograms, activeFilter]);

  const toggleTrackPlay = (id: string) => {
    setActiveTrackId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="proker-section"
      className="space-y-4 bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl scroll-mt-36 sm:scroll-mt-40"
    >
      {/* Header Bar & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <ListMusic size={20} className="text-[#1DB954]" />
          <div>
            <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              Tracklist Program Kerja {divisionName}
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {workPrograms.length} Tracks Inisiatif
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusFilters.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-[#1DB954] text-black border-black shadow-[2px_2px_0px_0px_#000000]"
                    : "bg-white/[0.04] text-slate-300 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tracklist Table */}
      {filteredPrograms.length === 0 ? (
        <div className="p-8 text-center space-y-2 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-sm font-mono text-slate-300 font-bold">
            Tidak ada program kerja pada filter ini
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Silakan pilih filter lain untuk melihat track program kerja yang tersedia.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 select-none">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5">Judul Program Kerja</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2">Jadwal & Progres</div>
            <div className="col-span-2 text-right">PIC & Sasaran</div>
          </div>

          {/* Tracklist Items */}
          <div className="space-y-1.5">
            {filteredPrograms.map((proker, index) => {
              const badge = getStatusBadge(proker.status);
              const trackNum = String(index + 1).padStart(2, "0");
              const isPlayingThis = activeTrackId === proker.id;

              return (
                <div
                  key={proker.id || index}
                  onClick={() => toggleTrackPlay(proker.id)}
                  className={`p-3 sm:p-3.5 rounded-xl border border-white/5 transition-all cursor-pointer group ${
                    isPlayingThis
                      ? "bg-white/[0.08] border-[#1DB954]/30"
                      : "bg-white/[0.03] hover:bg-white/[0.07]"
                  }`}
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    {/* Track Number / Play toggle */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        aria-label="Toggle track"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 group-hover:text-white transition-colors"
                      >
                        {isPlayingThis ? (
                          <Pause size={15} className="fill-[#1DB954] text-[#1DB954]" />
                        ) : (
                          <>
                            <span className="font-mono text-xs font-bold block group-hover:hidden">
                              {trackNum}
                            </span>
                            <Play
                              size={14}
                              className="hidden group-hover:block fill-white text-white ml-0.5"
                            />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Title & Description */}
                    <div className="col-span-5 min-w-0 pr-4 space-y-0.5">
                      <h4
                        className={`text-sm font-bold tracking-tight truncate transition-colors ${
                          isPlayingThis
                            ? "text-[#1DB954]"
                            : "text-white group-hover:text-[#1DB954]"
                        }`}
                      >
                        {proker.title}
                      </h4>
                      {proker.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 font-sans">
                          {proker.description}
                        </p>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div className="col-span-2 flex justify-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border whitespace-nowrap ${badge.badgeClass}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Execution Date & Scrubber Progress */}
                    <div className="col-span-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="truncate">{proker.execution_date || "Periode 2026"}</span>
                        <span className="font-bold text-white">{badge.percent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${badge.progressClass} transition-all duration-500`}
                          style={{ width: `${badge.percent}%` }}
                        />
                      </div>
                    </div>

                    {/* PIC & Sasaran */}
                    <div className="col-span-2 text-right min-w-0 space-y-0.5">
                      <p className="text-xs font-mono text-slate-300 truncate">
                        {proker.pic || "Pengurus"}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 truncate">
                        {proker.target_audience || "Mahasiswa TI"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#1DB954] mt-0.5">
                          {trackNum}
                        </span>
                        <div className="min-w-0 space-y-0.5">
                          <h4
                            className={`text-sm font-bold leading-snug ${
                              isPlayingThis ? "text-[#1DB954]" : "text-white"
                            }`}
                          >
                            {proker.title}
                          </h4>
                          {proker.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                              {proker.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${badge.badgeClass}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{proker.execution_date || "Periode 2026"}</span>
                        <span>{badge.percent}% Selesai</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${badge.progressClass}`}
                          style={{ width: `${badge.percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/5 pt-2">
                      <span className="truncate">PIC: {proker.pic || "Pengurus"}</span>
                      <span className="truncate">Sasaran: {proker.target_audience || "Mahasiswa"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
