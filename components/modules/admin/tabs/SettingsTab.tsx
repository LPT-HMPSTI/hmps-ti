"use client";

import React, { useState } from "react";
import { FloppyDisk, Image as ImageIcon, LinkSimple, UploadSimple, Users } from "@phosphor-icons/react";
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

export interface SettingsTabProps {
  settings: SettingsState;
  onSettingsChange: (newSettings: SettingsState) => void;
  onSaveSettings: (e: React.FormEvent) => void;
  allMembersPhotoUrl?: string;
  allMembersPhotoName?: string;
  onAllMembersPhotoChange?: (url: string) => void;
  onAllMembersPhotoNameChange?: (name: string) => void;
  onSaveAllMembersPhoto?: (e: React.FormEvent) => void;
  onDeviceFileUpload?: (file: File, setter: (url: string) => void) => void;
}

/**
 * Tab Pengaturan Utama: Form konfigurasi tahun periode aktif, email, WhatsApp, alamat, Google Maps URL,
 * dan Card Pengaturan Foto Bersama Seluruh Anggota Himpunan (Kabinet HMPSTI SWU).
 */
export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onSettingsChange,
  onSaveSettings,
  allMembersPhotoUrl = "",
  allMembersPhotoName = "",
  onAllMembersPhotoChange,
  onAllMembersPhotoNameChange,
  onSaveAllMembersPhoto,
  onDeviceFileUpload,
}) => {
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onDeviceFileUpload && onAllMembersPhotoChange) {
      onDeviceFileUpload(file, (url) => {
        onAllMembersPhotoChange(url);
      });
    }
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

      {/* CARD 2: FOTO BERSAMA SELURUH ANGGOTA HIMPUNAN (KABINET HMPSTI SWU) */}
      <GlassCard glowColor="spotify" className="p-6 sm:p-8 space-y-6 sm:space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-[#1DB954]" weight="bold" />
              <h2 className="text-lg font-bold text-white">
                Foto Bersama Seluruh Anggota Himpunan
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Atur &amp; Upload Foto Dokumentasi Resmi Kabinet / Seluruh Anggota HMPSTI SWU (Tersimpan di Database Supabase <code className="text-[#1DB954]">division_photos</code>)
            </p>
          </div>
          <div className="shrink-0">
            <Badge variant="spotify" tilt="left">
              KABINET HMPSTI SWU
            </Badge>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSaveAllMembersPhoto) {
              onSaveAllMembersPhoto(e);
            }
          }}
          className="space-y-5"
        >
          {/* Input Tulisan / Keterangan Foto (Masuk ke kolom division_name) */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Tulisan / Keterangan Foto (Kolom `division_name`)
            </label>
            <input
              type="text"
              value={allMembersPhotoName ?? ""}
              onChange={(e) => {
                if (onAllMembersPhotoNameChange) onAllMembersPhotoNameChange(e.target.value);
              }}
              placeholder="Contoh: Seluruh Anggota Himpunan (Kabinet HMPSTI SWU)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#00F2FE] focus:outline-none font-sans font-semibold"
            />
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              *Teks ini akan tampil secara menimpa di bagian bawah-tengah foto pada beranda utama.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl w-fit border border-white/10">
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${uploadMode === "url"
                  ? "bg-[#1DB954] text-black shadow-md"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              <LinkSimple size={14} weight="bold" />
              <span>URL Gambar</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${uploadMode === "file"
                  ? "bg-[#1DB954] text-black shadow-md"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              <UploadSimple size={14} weight="bold" />
              <span>Upload dari Perangkat</span>
            </button>
          </div>

          {/* Dual Input Area */}
          {uploadMode === "url" ? (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                URL Foto Bersama Seluruh Anggota (HTTPS Direct Link)
              </label>
              <input
                type="url"
                value={allMembersPhotoUrl ?? ""}
                onChange={(e) => {
                  if (onAllMembersPhotoChange) onAllMembersPhotoChange(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-1522071820081-..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Pilih File Foto dari Perangkat (Max 5MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#1DB954] file:text-black hover:file:bg-[#1ed760] cursor-pointer"
              />
            </div>
          )}

          {/* Image Sneakpeek Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-400">
              Pratinjau Foto Bersama Kabinet &amp; Overlay Teks:
            </label>
            <div className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
              {allMembersPhotoUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={allMembersPhotoUrl}
                    alt="Pratinjau Foto Bersama Seluruh Anggota Kabinet HMPSTI"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Overlay text preview */}
                  {allMembersPhotoName && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg text-center pointer-events-none">
                      <p className="text-sm sm:text-lg font-extrabold text-white tracking-wide drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]">
                        {allMembersPhotoName}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <ImageIcon size={36} />
                  <span className="text-xs">Belum Ada Foto Kabinet Ditetapkan</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-start">
            <Button
              variant="spotify"
              size="md"
              type="submit"
              icon={<FloppyDisk size={16} weight="bold" />}
            >
              Simpan Foto &amp; Keterangan Kabinet
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
