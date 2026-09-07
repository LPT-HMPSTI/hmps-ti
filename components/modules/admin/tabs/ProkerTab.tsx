"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, MagnifyingGlass, Pencil, Trash } from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CyberSelect } from "@/components/ui/CyberSelect";
import { CyberDateTimePicker } from "@/components/ui/CyberDateTimePicker";
import { WorkProgram, CreateWorkProgramPayload } from "@/types";
import { AdminPagination } from "../AdminPagination";
import { getDivisionBadgeProps } from "../adminUtils";

export interface ProkerTabProps {
  workPrograms: WorkProgram[];
  newWorkProgram: CreateWorkProgramPayload;
  onNewWorkProgramChange: (val: CreateWorkProgramPayload) => void;
  onCreateWorkProgram: (e: React.FormEvent) => void;
  onOpenEditModal: (proker: WorkProgram) => void;
  onDeleteWorkProgram: (proker: WorkProgram) => void;
}

const divisionSelectOptions = [
  { label: "BPH", value: "bph" },
  { label: "PSDM", value: "psdm" },
  { label: "LPT", value: "lpt" },
  { label: "KWU", value: "kwu" },
  { label: "MEDKOMINFO", value: "medkominfo" },
  { label: "HUMAS", value: "humas" },
];

const statusSelectOptions = [
  { label: "Mendatang", value: "MENDATANG" },
  { label: "Sedang Berjalan", value: "BERJALAN" },
  { label: "Selesai", value: "SELESAI" },
];

const divisionFilterPills = [
  { id: "all", label: "Semua Divisi" },
  { id: "bph", label: "BPH" },
  { id: "psdm", label: "PSDM" },
  { id: "lpt", label: "LPT" },
  { id: "kwu", label: "KWU" },
  { id: "medkominfo", label: "MEDKOMINFO" },
  { id: "humas", label: "HUMAS" },
];

export const getStatusBadgeProps = (status: string) => {
  const s = (status || "").toUpperCase();
  switch (s) {
    case "SELESAI":
      return {
        variant: "spotify" as const,
        label: "Selesai",
      };
    case "BERJALAN":
      return {
        variant: "cyan" as const,
        label: "Sedang Berjalan",
      };
    case "MENDATANG":
    default:
      return {
        variant: "yellow" as const,
        label: "Mendatang",
      };
  }
};

/**
 * Tab Program Kerja Divisi: Formulir penambahan program kerja per divisi,
 * filter per divisi, bilah pencarian, dan grid kartu proker yang identik dan
 * konsisten dengan tab modul admin lainnya.
 */
export const ProkerTab: React.FC<ProkerTabProps> = ({
  workPrograms,
  newWorkProgram,
  onNewWorkProgramChange,
  onCreateWorkProgram,
  onOpenEditModal,
  onDeleteWorkProgram,
}) => {
  const [selectedDivFilter, setSelectedDivFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPrograms = useMemo(() => {
    return workPrograms.filter((wp) => {
      // Filter Divisi
      const matchDiv =
        selectedDivFilter === "all" ||
        wp.division_slug.toLowerCase() === selectedDivFilter.toLowerCase();

      // Filter Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        wp.title.toLowerCase().includes(q) ||
        (wp.description || "").toLowerCase().includes(q) ||
        (wp.pic || "").toLowerCase().includes(q) ||
        (wp.execution_date || "").toLowerCase().includes(q) ||
        (wp.target_audience || "").toLowerCase().includes(q);

      return matchDiv && matchSearch;
    });
  }, [workPrograms, selectedDivFilter, searchQuery]);

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 saat pencarian atau filter divisi berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDivFilter]);

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE) || 1;

  // Pastikan currentPage tidak melebihi totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPrograms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrograms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPrograms, currentPage]);

  return (
    <div className="space-y-6">
      {/* 1. Form Tambah Program Kerja Baru */}
      <GlassCard glowColor="cyan" className="p-6 sm:p-7 space-y-5 sm:space-y-6">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3.5 mb-2">
          Tambah Program Kerja Divisi
        </h3>

        <form onSubmit={onCreateWorkProgram} className="space-y-4 sm:space-y-4.5">
          {/* Row 1: 4 Kolom - Judul, Divisi, Status, Date Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 items-end">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Judul Program Kerja *
              </label>
              <input
                type="text"
                required
                value={newWorkProgram.title}
                onChange={(e) =>
                  onNewWorkProgramChange({
                    ...newWorkProgram,
                    title: e.target.value,
                  })
                }
                placeholder="Judul Program Kerja *"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-sans"
              />
            </div>

            <div>
              <CyberSelect
                label="Divisi Terkait *"
                value={newWorkProgram.division_slug || "lpt"}
                onChange={(val) =>
                  onNewWorkProgramChange({
                    ...newWorkProgram,
                    division_slug: val,
                  })
                }
                options={divisionSelectOptions}
                placeholder="Pilih Divisi..."
              />
            </div>

            <div>
              <CyberSelect
                label="Status Pelaksanaan *"
                value={newWorkProgram.status || "MENDATANG"}
                onChange={(val) =>
                  onNewWorkProgramChange({
                    ...newWorkProgram,
                    status: val,
                  })
                }
                options={statusSelectOptions}
                placeholder="Pilih Status..."
              />
            </div>

            <div>
              <CyberDateTimePicker
                value={newWorkProgram.execution_date || ""}
                onChange={(val) =>
                  onNewWorkProgramChange({
                    ...newWorkProgram,
                    execution_date: val,
                  })
                }
                label="Jadwal Pelaksanaan *"
                dateOnly={true}
              />
            </div>
          </div>

          {/* Row 2: 3 Kolom - PIC, Target Sasaran, Estimasi Anggaran */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4.5 items-end">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Penanggung Jawab (PIC)
              </label>
              <input
                type="text"
                value={newWorkProgram.pic || ""}
                onChange={(e) =>
                  onNewWorkProgramChange({
                    ...newWorkProgram,
                    pic: e.target.value,
                  })
                }
                placeholder="e.g. Aditya Pratama"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Target Sasaran / Peserta
              </label>
              <input
                type="text"
                value={newWorkProgram.target_audience || ""}
                onChange={(e) =>
                  onNewWorkProgramChange({
                    ...newWorkProgram,
                    target_audience: e.target.value,
                  })
                }
                placeholder="e.g. Mahasiswa Baru TI 2026"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Estimasi Anggaran (Opsional)
              </label>
              <input
                type="text"
                value={newWorkProgram.budget || ""}
                onChange={(e) =>
                  onNewWorkProgramChange({
                    ...newWorkProgram,
                    budget: e.target.value,
                  })
                }
                placeholder="e.g. Rp 1.500.000"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Textarea Deskripsi & Tujuan */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Deskripsi & Tujuan Program Kerja *
            </label>
            <textarea
              rows={3}
              required
              value={newWorkProgram.description || ""}
              onChange={(e) =>
                onNewWorkProgramChange({
                  ...newWorkProgram,
                  description: e.target.value,
                })
              }
              placeholder="Jelaskan gambaran umum pelaksanaan, sasaran kompetensi, atau hasil yang diharapkan dari program kerja ini..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Tombol Simpan (Konsisten Bottom Left) */}
          <div className="flex justify-start pt-4 mt-5 border-t border-white/10">
            <Button
              variant="spotify"
              size="md"
              icon={<Plus size={16} weight="bold" className="shrink-0" />}
            >
              Tambah Program Kerja
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* 2. Daftar Program Kerja & Search */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">
            Daftar Program Kerja Divisi ({filteredPrograms.length})
          </h3>

          {/* Search Bar Identik */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari proker, PIC, atau jadwal..."
              className="w-full rounded-xl border-2 border-black bg-[#121520] py-2 pl-9.5 pr-8 text-xs text-white placeholder-slate-400 font-mono shadow-[2px_2px_0px_0px_#000000] focus:border-[#1DB954] focus:outline-none"
            />
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Divisi Pills Identik */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 uppercase mr-1 whitespace-nowrap">
            Divisi:
          </span>
          {divisionFilterPills.map((pill) => {
            const isSelected = selectedDivFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedDivFilter(pill.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-[#1DB954] text-black shadow-md"
                    : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* 3. Cards Grid Identik */}
        {filteredPrograms.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-2">
            <p className="text-sm text-slate-300 font-bold">
              Tidak ada program kerja ditemukan
            </p>
            <p className="text-xs text-slate-500">
              {searchQuery
                ? `Tidak ada hasil untuk kata kunci "${searchQuery}"`
                : "Belum ada program kerja pada divisi yang dipilih."}
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
            {paginatedPrograms.map((proker) => {
              const divBadge = getDivisionBadgeProps(proker.division_slug);
              const statusBadge = getStatusBadgeProps(proker.status);

              return (
                <GlassCard
                  key={proker.id}
                  glowColor={divBadge.variant === "spotify" ? "yellow" : "cyan"}
                  className="p-5 sm:p-6 flex flex-col justify-between gap-4 sm:gap-4.5 min-h-[160px]"
                >
                  {/* Row 1: Badges & Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={divBadge.variant}
                        tilt="left"
                        noDot
                        className="my-0 py-0.5 text-[10px]"
                      >
                        {divBadge.label}
                      </Badge>
                      <Badge
                        variant={statusBadge.variant}
                        tilt="right"
                        noDot
                        className="my-0 py-0.5 text-[10px]"
                      >
                        {statusBadge.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenEditModal(proker)}
                        title="Edit Program Kerja"
                        className="p-2 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Pencil size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteWorkProgram(proker)}
                        title="Hapus Program Kerja"
                        className="p-2 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Title, Schedule & Description */}
                  <div className="min-w-0 space-y-1.5">
                    <h4 className="text-sm font-bold text-white line-clamp-1">
                      {proker.title}
                    </h4>
                    <p className="text-xs text-[#1DB954] font-mono font-semibold">
                      {proker.execution_date}
                    </p>
                    {proker.description && (
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                        {proker.description}
                      </p>
                    )}
                  </div>

                  {/* Row 3: PIC & Target Sasaran Footer Row */}
                  <div className="text-[11px] font-mono text-slate-400 border-t border-white/10 pt-3 mt-1 flex items-center justify-between">
                    <span>PIC: {proker.pic || "-"}</span>
                    <span className="text-[#1DB954] font-medium truncate max-w-[140px]">
                      {proker.target_audience || "Umum"}
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Neubrutalist Pagination Bar */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPrograms.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="program kerja"
        />
      </div>
    </div>
  );
};
