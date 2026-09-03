"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FloppyDisk, Trash } from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface MissionItemState {
  title?: string;
  desc?: string;
  indicator?: string;
}

export interface VisiMisiTabProps {
  visionText: string;
  onVisionTextChange: (text: string) => void;
  missionsList: MissionItemState[];
  onAddMisiItem: () => void;
  onRemoveMisiItem: (index: number) => void;
  onMisiChange: (index: number, field: string, value: string) => void;
  onSaveVisionMission: (e: React.FormEvent) => void;
}

/**
 * Tab Visi & Misi: Formulir pengisian kalimat visi utama dan daftar poin misi dinamis
 * (minimal 3 misi wajib dengan judul, indikator target, dan deskripsi).
 */
export const VisiMisiTab: React.FC<VisiMisiTabProps> = ({
  visionText,
  onVisionTextChange,
  missionsList,
  onAddMisiItem,
  onRemoveMisiItem,
  onMisiChange,
  onSaveVisionMission,
}) => {
  return (
    <GlassCard glowColor="purple" className="p-6 sm:p-7 space-y-6 sm:space-y-7">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
        <div>
          <h2 className="text-lg font-bold text-white">
            Kelola Visi Utama & Poin Misi Organisasi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Input 1 Visi Utama dan minimal 3 Poin Misi Perjuangan (Dapat menambah lebih dari 3 Misi)
          </p>
        </div>
        <div className="my-1 shrink-0">
          <Badge variant="purple" tilt="right">
            1 VISI & MIN 3 MISI
          </Badge>
        </div>
      </div>

      <form onSubmit={onSaveVisionMission} className="space-y-6">
        {/* 1 Visi Section */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-[#1DB954] uppercase tracking-wider mb-1.5">
            1. Teks Kalimat Visi Utama *
          </label>
          <textarea
            rows={3}
            required
            value={visionText}
            onChange={(e) => onVisionTextChange(e.target.value)}
            placeholder="Menjadi Himpunan Mahasiswa Teknik Informatika yang Unggul, Inovatif, dan Berkarakter..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3.5 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Dynamic Misi Section */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                2. Daftar Poin Misi Organisasi (Wajib Minimal 3 Misi)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Setiap poin misi terdiri dari Judul Poin, Indikator Target, dan Deskripsi Penjelasan.
              </p>
            </div>

            <Button
              type="button"
              variant="spotify"
              size="sm"
              onClick={onAddMisiItem}
              icon={<Plus size={14} weight="bold" />}
            >
              Tambah Poin Misi
            </Button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {missionsList.map((misi, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <GlassCard
                    glowColor={idx < 3 ? "cyan" : "yellow"}
                    className="p-4 sm:p-5 space-y-3.5 border-white/10"
                  >
                    {/* Header Card */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-[#1DB954]">
                          Poin Misi #{String(idx + 1).padStart(2, "0")}
                        </span>
                        {idx < 3 ? (
                          <Badge
                            variant="yellow"
                            tilt="left"
                            noDot
                            className="my-0 py-0.5 text-[10px]"
                          >
                            WAJIB #{idx + 1}
                          </Badge>
                        ) : (
                          <Badge
                            variant="cyan"
                            tilt="right"
                            noDot
                            className="my-0 py-0.5 text-[10px]"
                          >
                            OPSIONAL #{idx + 1}
                          </Badge>
                        )}
                      </div>

                      {missionsList.length > 3 && (
                        <button
                          type="button"
                          onClick={() => onRemoveMisiItem(idx)}
                          title="Hapus Misi Ini"
                          className="p-2 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                        >
                          <Trash size={14} weight="bold" />
                        </button>
                      )}
                    </div>

                    {/* Content Fields Compact Grid */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                        <div className="sm:col-span-8">
                          <label className="block text-[11px] font-mono text-slate-300 mb-1">
                            Judul Poin Misi {idx < 3 ? "*" : ""}
                          </label>
                          <input
                            type="text"
                            required={idx < 3}
                            value={misi.title || ""}
                            onChange={(e) =>
                              onMisiChange(idx, "title", e.target.value)
                            }
                            placeholder={`Judul Misi #${idx + 1} (e.g. Meningkatkan Kualitas Akademik)`}
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-mono text-slate-400 mb-1">
                            Indikator Target / Output
                          </label>
                          <input
                            type="text"
                            value={misi.indicator || ""}
                            onChange={(e) =>
                              onMisiChange(idx, "indicator", e.target.value)
                            }
                            placeholder="e.g. 120+ Mahasiswa Bersertifikasi"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Penjelasan / Deskripsi Misi
                        </label>
                        <textarea
                          rows={2}
                          value={misi.desc || ""}
                          onChange={(e) =>
                            onMisiChange(idx, "desc", e.target.value)
                          }
                          placeholder="Detail kegiatan atau strategi pelaksanaan misi..."
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-white focus:border-[#1DB954] focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Total {missionsList.length} Poin Misi Terdaftar (
            {missionsList.filter((m) => m.title && m.title.trim() !== "").length} Siap
            Disimpan)
          </span>

          <Button variant="spotify" size="md" icon={<FloppyDisk size={16} weight="bold" />}>
            Simpan Visi & Seluruh Misi
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};
