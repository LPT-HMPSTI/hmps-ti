"use client";

import React, { useState } from "react";
import { FloppyDisk, Image as ImageIcon, LinkSimple, UploadSimple, Users, Images } from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface SettingsState {
  current_period: string;
  email: string;
  whatsapp: string;
  address: string;
  map_embed_url: string;
}

export interface CabinetSlideState {
  url: string;
  name: string;
}

export interface SettingsTabProps {
  settings: SettingsState;
  onSettingsChange: (newSettings: SettingsState) => void;
  onSaveSettings: (e: React.FormEvent) => void;
  // 3-slot cabinet slideshow
  cabinetSlides?: CabinetSlideState[];
  onCabinetSlideChange?: (index: number, field: "url" | "name", value: string) => void;
  onSaveCabinetSlide?: (index: number, e: React.FormEvent) => void;
  onDeviceFileUpload?: (file: File, setter: (url: string) => void) => void;
  // Legacy single-photo props (kept for backward compat, no longer rendered)
  allMembersPhotoUrl?: string;
  allMembersPhotoName?: string;
  onAllMembersPhotoChange?: (url: string) => void;
  onAllMembersPhotoNameChange?: (name: string) => void;
  onSaveAllMembersPhoto?: (e: React.FormEvent) => void;
}

const SLOT_LABELS = ["Foto Slideshow 1", "Foto Slideshow 2", "Foto Slideshow 3"];

/**
 * Tab Pengaturan Utama: Form konfigurasi website + 3 slot slideshow foto kabinet.
 */
export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onSettingsChange,
  onSaveSettings,
  cabinetSlides = [
    { url: "", name: "" },
    { url: "", name: "" },
    { url: "", name: "" },
  ],
  onCabinetSlideChange,
  onSaveCabinetSlide,
  onDeviceFileUpload,
}) => {
  const [uploadModes, setUploadModes] = useState<("url" | "file")[]>(["url", "url", "url"]);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);

  const setMode = (idx: number, mode: "url" | "file") => {
    setUploadModes((prev) => {
      const next = [...prev];
      next[idx] = mode;
      return next;
    });
  };

  const handleSave = async (idx: number, e: React.FormEvent) => {
    e.preventDefault();
    setSavingIndex(idx);
    if (onSaveCabinetSlide) await onSaveCabinetSlide(idx, e);
    setSavingIndex(null);
    setSavedIndex(idx);
    setTimeout(() => setSavedIndex(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* CARD 1: INFORMASI UTAMA & KONTAK HIMPUNAN */}
      <GlassCard glowColor="emerald" className="p-6 sm:p-8 space-y-6 sm:space-y-7">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
          <div>
            <h2 className="text-lg font-bold text-white">Informasi Utama &amp; Kontak Himpunan</h2>
            <p className="text-xs text-slate-400 mt-1">
              Ubah Tahun Periode, Email, WhatsApp, Alamat, dan Custom/Google Maps Embed URL
            </p>
          </div>
          <div className="my-1 shrink-0">
            <Badge variant="spotify" tilt="right">
              PERIODE {settings.current_period}
            </Badge>
          </div>
        </div>

        <form onSubmit={onSaveSettings} className="space-y-4.5 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Tahun Periode Aktif
              </label>
              <input
                type="text"
                value={settings.current_period}
                onChange={(e) =>
                  onSettingsChange({ ...settings, current_period: e.target.value })
                }
                placeholder="2026"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Email Resmi HMPS-TI
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  onSettingsChange({ ...settings, email: e.target.value })
                }
                placeholder="hmps-ti@stmik-widya-utama.ac.id"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Nomor WhatsApp Hima
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) =>
                  onSettingsChange({ ...settings, whatsapp: e.target.value })
                }
                placeholder="+62 812-3456-7890"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Alamat Lengkap Sekretariat
            </label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) =>
                onSettingsChange({ ...settings, address: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Google Maps Embed URL (src)
            </label>
            <input
              type="text"
              value={settings.map_embed_url}
              onChange={(e) =>
                onSettingsChange({ ...settings, map_embed_url: e.target.value })
              }
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
            />
          </div>

          <div className="pt-4 mt-5 border-t border-white/10 flex justify-start">
            <Button variant="spotify" size="md" icon={<FloppyDisk size={16} weight="bold" />}>
              Simpan Pengaturan Informasi
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* CARD 2: SLIDESHOW FOTO BERSAMA KABINET (3 SLOT) */}
      <GlassCard glowColor="spotify" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Images size={20} className="text-[#1DB954]" weight="bold" />
              <h2 className="text-lg font-bold text-white">
                Slideshow Foto Bersama Kabinet
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Upload hingga 3 foto untuk ditampilkan sebagai auto-slide di beranda. Foto yang URL-nya kosong tidak akan ditampilkan.
            </p>
          </div>
          <div className="shrink-0">
            <Badge variant="spotify" tilt="left">3 SLOT FOTO</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {cabinetSlides.map((slide, idx) => {
            const mode = uploadModes[idx] || "url";
            const isSaving = savingIndex === idx;
            const isSaved = savedIndex === idx;

            return (
              <form
                key={idx}
                onSubmit={(e) => handleSave(idx, e)}
                className="flex flex-col gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#1DB954]">
                    // {SLOT_LABELS[idx]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded-md">
                    all_members_{idx + 1}
                  </span>
                </div>

                {/* Preview */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black/50 flex items-center justify-center">
                  {slide.url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.url}
                        alt={slide.name || SLOT_LABELS[idx]}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      {slide.name && (
                        <div className="absolute bottom-2 left-0 right-0 text-center px-2">
                          <p className="text-[10px] font-bold text-white drop-shadow-lg truncate">
                            {slide.name}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                      <ImageIcon size={28} />
                      <span className="text-[11px] font-mono">Belum ada foto</span>
                    </div>
                  )}
                </div>

                {/* Keterangan / Caption */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Keterangan / Teks Foto
                  </label>
                  <input
                    type="text"
                    value={slide.name}
                    onChange={(e) =>
                      onCabinetSlideChange?.(idx, "name", e.target.value)
                    }
                    placeholder={`Contoh: Kabinet HMPSTI SWU 2026`}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                  />
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMode(idx, "url")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                      mode === "url"
                        ? "bg-[#1DB954] text-black shadow-md"
                        : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
                    }`}
                  >
                    <LinkSimple size={12} className="inline mr-1" weight="bold" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode(idx, "file")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                      mode === "file"
                        ? "bg-[#1DB954] text-black shadow-md"
                        : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
                    }`}
                  >
                    <UploadSimple size={12} className="inline mr-1" weight="bold" />
                    File
                  </button>
                </div>

                {/* URL / File Input */}
                {mode === "url" ? (
                  <input
                    type="url"
                    value={slide.url}
                    onChange={(e) =>
                      onCabinetSlideChange?.(idx, "url", e.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#1DB954] focus:outline-none font-mono"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onDeviceFileUpload) {
                        onDeviceFileUpload(file, (url) => {
                          onCabinetSlideChange?.(idx, "url", url);
                        });
                      }
                    }}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#1DB954] file:text-black hover:file:bg-[#1ed760] cursor-pointer"
                  />
                )}

                {/* Save Button */}
                <Button
                  variant={isSaved ? "primary" : "spotify"}
                  size="sm"
                  type="submit"
                  icon={<FloppyDisk size={14} weight="bold" />}
                  disabled={isSaving}
                >
                  {isSaving ? "Menyimpan..." : isSaved ? "Tersimpan!" : `Simpan Foto ${idx + 1}`}
                </Button>
              </form>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
