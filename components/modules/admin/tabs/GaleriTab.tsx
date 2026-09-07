"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  LinkSimple,
  UploadSimple,
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
 * upload gambar dari file/URL, deskripsi catatan) serta grid foto galeri terdaftar.
 */
export const GaleriTab: React.FC<GaleriTabProps> = ({
  newGalleryItem,
  onNewGalleryItemChange,
  galleryUploadMode,
  onGalleryUploadModeChange,
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

  return (
    <div className="space-y-6">
      <GlassCard glowColor="cyan" className="p-6 sm:p-7 space-y-5 sm:space-y-6">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3.5 mb-2">
          Tambah Foto Galeri Baru
        </h3>
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

          {/* Row 2: Gambar Foto Galeri */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Gambar Foto Kegiatan (URL / Device File) *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Sneakpeek Preview */}
              {newGalleryItem.url && (
                <div className="relative shrink-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={newGalleryItem.url}
                    alt="Sneakpeek Galeri"
                    className="h-12 w-20 rounded-xl border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                  />
                  <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                    PREVIEW
                  </span>
                </div>
              )}

              <div className="flex-1 w-full">
                {galleryUploadMode === "url" ? (
                  <input
                    key="gallery-create-url-input"
                    type="text"
                    value={newGalleryItem.url || ""}
                    onChange={(e) =>
                      onNewGalleryItemChange({ ...newGalleryItem, url: e.target.value })
                    }
                    placeholder="URL Gambar Foto Galeri (e.g. https://...)"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                  />
                ) : (
                  <input
                    key="gallery-create-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onDeviceFileUpload(file, (base64Url) => {
                          onNewGalleryItemChange({ ...newGalleryItem, url: base64Url });
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                  />
                )}
              </div>

              {/* Mode Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onGalleryUploadModeChange("url");
                    if (newGalleryItem.url?.startsWith("data:image")) {
                      onNewGalleryItemChange({ ...newGalleryItem, url: "" });
                    }
                  }}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    galleryUploadMode === "url"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LinkSimple size={14} weight="bold" /> URL Gambar
                </button>
                <button
                  type="button"
                  onClick={() => onGalleryUploadModeChange("file")}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    galleryUploadMode === "file"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <UploadSimple size={14} weight="bold" /> Ambil Dari Device
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Expanded Workspace Description Textarea */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Deskripsi / Catatan Kegiatan *
            </label>
            <textarea
              rows={14}
              value={newGalleryItem.description || ""}
              onChange={(e) =>
                onNewGalleryItemChange({ ...newGalleryItem, description: e.target.value })
              }
              placeholder="Keterangan lengkap dokumentasi kegiatan..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[320px]"
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
          {paginatedGallery.map((g) => (
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
                    src={g.url}
                    alt={g.title}
                    className="h-12 w-12 rounded-lg object-cover border border-white/10 shrink-0 shadow-md"
                  />
                  <h4 className="text-xs font-bold text-white leading-snug">{g.title}</h4>
                </div>
              </div>
              {g.event_date && (
                <p className="text-[10px] font-mono text-slate-400 border-t border-white/10 pt-3 mt-1">
                  Tanggal: {g.event_date}
                </p>
              )}
            </GlassCard>
          ))}
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
