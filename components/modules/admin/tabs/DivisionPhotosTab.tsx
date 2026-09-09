"use client";

import React, { useState } from "react";
import { Eye } from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface DivisionPhotoConfig {
  slug: string;
  name: string;
  short: string;
  themeColor: string;
  desc: string;
}

export const DIVISIONS_LIST: DivisionPhotoConfig[] = [
  {
    slug: "bph",
    name: "Badan Pengurus Harian (BPH)",
    short: "BPH",
    themeColor: "#1DB954",
    desc: "Ketua Umum, Wakil Ketua, Sekretaris, dan Bendahara",
  },
  {
    slug: "psdm",
    name: "Pengembangan Sumber Daya Mahasiswa",
    short: "PSDM",
    themeColor: "#A855F7",
    desc: "Kaderisasi, pengembangan softskill, dan soliditas internal",
  },
  {
    slug: "lpt",
    name: "Lembaga Pengembangan Teknologi (LPT)",
    short: "LPT",
    themeColor: "#00F2FE",
    desc: "Riset rekayasa perangkat lunak, web dev, dan kompetisi koding",
  },
  {
    slug: "kwu",
    name: "Kewirausahaan & Bisnis Mandiri (KWU)",
    short: "KWU",
    themeColor: "#F59E0B",
    desc: "Merchandise resmi, pengelolaan dana usaha, dan technopreneur",
  },
  {
    slug: "medkominfo",
    name: "Media Komunikasi & Informasi",
    short: "MEDKOMINFO",
    themeColor: "#FF007F",
    desc: "Branding visual, fotografi, videografi, dan media sosial",
  },
  {
    slug: "humas",
    name: "Hubungan Masyarakat & Kemitraan",
    short: "HUMAS",
    themeColor: "#3B82F6",
    desc: "Diplomasi ormawa kampus, kemitraan eksternal, dan pengabdian",
  },
];

export interface DivisionPhotosTabProps {
  photos: Record<string, string>;
  onPhotoChange: (slug: string, newUrl: string) => void;
  onSavePhoto: (slug: string, name: string, url: string) => Promise<void>;
  onSaveAllPhotos: () => Promise<void>;
  onDeviceFileUpload: (file: File, setter: (url: string) => void) => void;
  isSaving?: boolean;
}

/**
 * Tab/Section Khusus Backoffice Admin:
 * Form manajemen input & upload gambar foto bersama resmi per divisi (seluruh divisi).
 */
export const DivisionPhotosTab: React.FC<DivisionPhotosTabProps> = ({
  photos,
  onPhotoChange,
  onSavePhoto,
  onSaveAllPhotos,
  onDeviceFileUpload,
  isSaving = false,
}) => {
  const [uploadModes, setUploadModes] = useState<Record<string, "url" | "file">>({
    bph: "url",
    psdm: "url",
    lpt: "url",
    kwu: "url",
    medkominfo: "url",
    humas: "url",
  });

  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSuccessSlug, setSavedSuccessSlug] = useState<string | null>(null);

  const toggleMode = (slug: string, mode: "url" | "file") => {
    setUploadModes((prev) => ({ ...prev, [slug]: mode }));
  };

  const handleSaveSingle = async (div: DivisionPhotoConfig) => {
    setSavingSlug(div.slug);
    const url = photos[div.slug] || "";
    await onSavePhoto(div.slug, div.name, url);
    setSavingSlug(null);
    setSavedSuccessSlug(div.slug);
    setTimeout(() => setSavedSuccessSlug(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner Intro & Quick Batch Action */}
      <GlassCard glowColor="emerald" className="p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">
              Foto Bersama Seluruh Divisi
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Formulir khusus untuk memperbarui foto dokumentasi resmi bersama seluruh divisi (BPH, PSDM, LPT, KWU, MEDKOMINFO, HUMAS).
              Foto ini langsung disinkronkan ke halaman profil divisi masing-masing.
            </p>
          </div>
          <Button
            variant="spotify"
            size="md"
            onClick={onSaveAllPhotos}
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Simpan Semua Foto"}
          </Button>
        </div>

        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
          <span className="text-slate-400">Total Divisi Terdaftar:</span>
          <Badge variant="spotify" tilt="right">
            6 DIVISI LENGKAP
          </Badge>          
        </div>
      </GlassCard>

      {/* Grid 6 Form Kartu Foto Divisi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DIVISIONS_LIST.map((div) => {
          const currentUrl = photos[div.slug] || "";
          const mode = uploadModes[div.slug] || "url";
          const isThisSaving = savingSlug === div.slug;
          const isThisSuccess = savedSuccessSlug === div.slug;

          return (
            <GlassCard
              key={div.slug}
              glowColor={div.slug === "bph" ? "emerald" : "purple"}
              className="p-5 flex flex-col justify-between space-y-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-xl"
            >
              {/* Card Header: Division Identity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 shadow-md"
                      style={{ backgroundColor: div.themeColor }}
                    />
                    <h3 className="text-sm font-bold text-white truncate">
                      {div.short}
                    </h3>
                  </div>
                  <span
                    className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md text-black shrink-0"
                    style={{ backgroundColor: div.themeColor }}
                  >
                    {div.slug.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium line-clamp-1">
                  {div.name}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {div.desc}
                </p>
              </div>

              {/* Photo Preview Container */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/70 border border-white/15 shadow-inner flex items-center justify-center group">
                {currentUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUrl}
                      alt={`Foto Bersama ${div.name}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-black/80 hover:bg-[#1DB954] text-white hover:text-black transition-colors"
                        title="Lihat Gambar Ukuran Asli"
                      >
                        <Eye size={16} />
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <span className="text-xs text-slate-500 font-mono block">
                      Belum ada foto yang diunggah
                    </span>
                  </div>
                )}

                {/* Slug Watermark */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300 border border-white/10 backdrop-blur-sm">
                  /divisi/{div.slug}
                </div>
              </div>

              {/* Mode Toggle & Input Form */}
              <div className="space-y-3 pt-1">
                {/* Switcher Mode URL / Device File */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMode(div.slug, "url")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                      mode === "url"
                        ? "bg-[#1DB954] text-black shadow-md"
                        : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
                    }`}
                  >
                    Link URL
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMode(div.slug, "file")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                      mode === "file"
                        ? "bg-[#1DB954] text-black shadow-md"
                        : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
                    }`}
                  >
                    Upload File
                  </button>
                </div>

                {/* Input Fields */}
                {mode === "url" ? (
                  <div key={`url-mode-${div.slug}`}>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      URL Gambar Foto Bersama:
                    </label>
                    <input
                      key={`input-url-${div.slug}`}
                      type="url"
                      value={currentUrl ?? ""}
                      onChange={(e) => onPhotoChange(div.slug, e.target.value ?? "")}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#1DB954] focus:outline-none font-mono"
                    />
                  </div>
                ) : (
                  <div key={`file-mode-${div.slug}`}>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Pilih File Gambar dari Perangkat:
                    </label>
                    <input
                      key={`input-file-${div.slug}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onDeviceFileUpload(file, (url) => {
                            onPhotoChange(div.slug, url ?? "");
                          });
                        }
                      }}
                      className="w-full text-xs text-slate-400 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#1DB954] file:text-black hover:file:bg-[#1ed760] cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Action Button: Save Single */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {currentUrl ? "Foto siap disimpan" : "Belum diisi"}
                </span>

                <Button
                  variant={isThisSuccess ? "primary" : "spotify"}
                  size="sm"
                  onClick={() => handleSaveSingle(div)}
                  disabled={isThisSaving || isSaving}
                >
                  {isThisSaving
                    ? "Menyimpan..."
                    : isThisSuccess
                    ? "Tersimpan!"
                    : `Simpan Foto ${div.short}`}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
