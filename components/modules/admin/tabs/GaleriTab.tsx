"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  LinkSimple,
  UploadSimple,
  Images,
} from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CyberSelect } from "@/components/ui/CyberSelect";
import { CyberDateTimePicker } from "@/components/ui/CyberDateTimePicker";
import { AdminPagination } from "../AdminPagination";

export interface NewGalleryItemState {
  title: string;
  category: string;
  event_date: string;
  url: string;
  photos: string[];
  drive_url: string;
  description: string;
}

export interface GaleriTabProps {
  newGalleryItem: NewGalleryItemState;
  onNewGalleryItemChange: (item: NewGalleryItemState) => void;
  galleryUploadMode: "url" | "file";
  onGalleryUploadModeChange: (mode: "url" | "file") => void;
  onDeviceFileUpload: (file: File, setter: (url: string) => void) => void;
  onCreateGallery: (e: React.FormEvent) => void;
  galleryList: any[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenEditModal: (item: any) => void;
  onDeleteGallery: (item: any) => void;
}

/**
 * Tab Galeri Kegiatan: Formulir upload dokumentasi kegiatan baru (kategori, tanggal event,
 * multi-slot foto hingga 4 foto, link Google Drive, deskripsi catatan) serta grid foto galeri terdaftar.
 */
export const GaleriTab: React.FC<GaleriTabProps> = ({
  newGalleryItem,
  onNewGalleryItemChange,
  onDeviceFileUpload,
  onCreateGallery,
  galleryList,
  searchQuery,
  onSearchChange,
  onOpenEditModal,
  onDeleteGallery,
}) => {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 saat pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(galleryList.length / ITEMS_PER_PAGE) || 1;

  // Pastikan currentPage tidak melebihi totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedGallery = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return galleryList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [galleryList, currentPage]);

  // Siapkan array foto 4 slot untuk form pembuatan
  const currentPhotos = useMemo(() => {
    const arr = Array.isArray(newGalleryItem.photos) ? [...newGalleryItem.photos] : [];
    if (arr.length === 0 && newGalleryItem.url) {
      arr[0] = newGalleryItem.url;
    }
    while (arr.length < 4) {
      arr.push("");
    }
    return arr.slice(0, 4);
  }, [newGalleryItem.photos, newGalleryItem.url]);

  const handleUpdatePhotoSlot = (index: number, val: string) => {
    const nextPhotos = [...currentPhotos];
    nextPhotos[index] = val;
    const firstValid = nextPhotos.find((p) => typeof p === "string" && p.trim() !== "") || "";
    onNewGalleryItemChange({
      ...newGalleryItem,
      photos: nextPhotos,
      url: nextPhotos[0] || firstValid || "",
    });
  };

  return (
    <div className="space-y-6">
      <GlassCard glowColor="cyan" className="p-6 sm:p-7 space-y-5 sm:space-y-6">
        <div className="border-b border-white/10 pb-3.5 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white">
            Tambah Dokumentasi Galeri Kegiatan
          </h3>
          <span className="text-[11px] font-mono text-[#1DB954]">
            Maks. 4 foto per kegiatan & dukungan link Google Drive
          </span>
        </div>

        <form onSubmit={onCreateGallery} className="space-y-4 sm:space-y-4.5">
          {/* Row 1: Judul Kegiatan, Kategori, Tanggal Event */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4.5 items-end">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Judul Foto / Kegiatan *
              </label>
              <input
                type="text"
                required
                value={newGalleryItem.title}
                onChange={(e) =>
                  onNewGalleryItemChange({ ...newGalleryItem, title: e.target.value })
                }
                placeholder="Judul Kegiatan..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
              />
            </div>

            <div>
              <CyberSelect
                label="Kategori Galeri *"
                value={newGalleryItem.category}
                onChange={(val) =>
                  onNewGalleryItemChange({ ...newGalleryItem, category: val })
                }
                options={[
                  "Makrab & Pelantikan",
                  "Workshop & Seminar",
                  "Lomba & Prestasi",
                  "Pengabdian & Kunjungan",
                  "Internal Himpunan",
                ]}
                placeholder="Pilih Kategori Galeri..."
              />
            </div>

            <div>
              <CyberDateTimePicker
                value={newGalleryItem.event_date || ""}
                onChange={(val) =>
                  onNewGalleryItemChange({ ...newGalleryItem, event_date: val })
                }
                label="Tanggal Kegiatan *"
              />
            </div>
          </div>

          {/* Row 2: Link Google Drive Akses Keseluruhan Foto */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkSimple size={14} className="text-[#1DB954]" /> Link Google Drive Dokumentasi (Opsional)
              </span>
              <span className="text-slate-500 text-[10px]">Folder arsip foto kegiatan lengkap</span>
            </label>
            <input
              type="url"
              value={newGalleryItem.drive_url || ""}
              onChange={(e) =>
                onNewGalleryItemChange({ ...newGalleryItem, drive_url: e.target.value })
              }
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
            />
          </div>

          {/* Row 3: Slot Foto Multi-Slide (Maks 4 Foto) */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="block text-xs font-mono text-slate-300 font-bold">
                Foto Kegiatan (Maksimal 4 Foto) *
              </label>
              <p className="text-[11px] font-mono text-slate-400">
                Slot 1 wajib sebagai foto utama. Jika diisi 1-3 foto, slider akan otomatis menyesuaikan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[0, 1, 2, 3].map((slotIdx) => {
                const slotPhoto = currentPhotos[slotIdx] || "";
                const isPrimary = slotIdx === 0;
                return (
                  <div
                    key={slotIdx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      slotPhoto
                        ? "border-[#1DB954]/40 bg-[#121520]/80 shadow-[0_0_15px_rgba(29,185,84,0.08)]"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <Images
                          size={13}
                          className={slotPhoto ? "text-[#1DB954]" : "text-slate-400"}
                        />
                        Foto #{slotIdx + 1} {isPrimary ? "(Utama *)" : "(Opsional)"}
                      </span>
                      {slotPhoto && (
                        <button
                          type="button"
                          onClick={() => handleUpdatePhotoSlot(slotIdx, "")}
                          className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                          title="Hapus foto dari slot ini"
                        >
                          <Trash size={12} /> Hapus
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Sneakpeek Preview Box */}
                      <div className="relative h-14 w-20 shrink-0 rounded-xl overflow-hidden border border-white/15 bg-slate-900 flex items-center justify-center">
                        {slotPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={slotPhoto}
                            alt={`Slot ${slotIdx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 text-center px-1">
                            Kosong
                          </span>
                        )}
                        {slotPhoto && (
                          <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[6px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                            #{slotIdx + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={slotPhoto}
                          onChange={(e) => handleUpdatePhotoSlot(slotIdx, e.target.value)}
                          placeholder="Paste URL foto (https://...)"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-slate-300 hover:text-white border border-white/10 cursor-pointer transition-all">
                            <UploadSimple size={12} />
                            <span>Upload Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onDeviceFileUpload(file, (base64Url) => {
                                    handleUpdatePhotoSlot(slotIdx, base64Url);
                                  });
                                }
                              }}
                            />
                          </label>
                          <span className="text-[10px] font-mono text-slate-500">Maks 10MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 4: Expanded Workspace Description Textarea */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Deskripsi / Catatan Kegiatan *
            </label>
            <textarea
              rows={8}
              value={newGalleryItem.description || ""}
              onChange={(e) =>
                onNewGalleryItemChange({ ...newGalleryItem, description: e.target.value })
              }
              placeholder="Keterangan lengkap dokumentasi kegiatan..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[160px]"
            />
          </div>

          {/* Dedicated Bottom Left Row for Submit Button */}
          <div className="flex justify-start pt-4 mt-5 border-t border-white/10">
            <Button
              variant="spotify"
              size="md"
              icon={<Plus size={14} weight="bold" className="shrink-0" />}
            >
              Tambah Foto Galeri
            </Button>
          </div>
        </form>
      </GlassCard>

      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">
            Galeri Foto Terdaftar ({galleryList.length})
          </h3>

          {/* Search Bar Component */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari foto galeri atau kategori..."
              className="w-full rounded-xl border-2 border-black bg-[#121520] py-2 pl-9.5 pr-8 text-xs text-white placeholder-slate-400 font-mono shadow-[2px_2px_0px_0px_#000000] focus:border-[#1DB954] focus:outline-none"
            />
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {paginatedGallery.map((g) => {
            const photoCount = Array.isArray(g.photos)
              ? g.photos.filter((p: any) => typeof p === "string" && p.trim() !== "").length
              : 1;
            const coverPhoto = g.photos?.[0] || g.url;

            return (
              <GlassCard
                key={g.id}
                glowColor="cyan"
                className="p-5 sm:p-6 flex flex-col justify-between gap-4.5 sm:gap-5 min-h-[160px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="cyan" tilt="left">
                      {g.category}
                    </Badge>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onOpenEditModal(g)}
                        title="Edit Foto"
                        className="p-2 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Pencil size={14} weight="bold" />
                      </button>
                      <button
                        onClick={() => onDeleteGallery(g)}
                        title="Hapus Foto"
                        className="p-2 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 pt-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverPhoto}
                      alt={g.title}
                      className="h-12 w-12 rounded-lg object-cover border border-white/10 shrink-0 shadow-md"
                    />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {g.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="text-[#1DB954]">{photoCount} Foto</span>
                        {g.drive_url && (
                          <span className="text-cyan-400 font-bold">• Ada G-Drive</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {g.event_date && (
                  <p className="text-[10px] font-mono text-slate-400 border-t border-white/10 pt-3 mt-1">
                    Tanggal: {g.event_date}
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Neubrutalist Pagination Bar */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={galleryList.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="foto galeri"
        />
      </div>
    </div>
  );
};
