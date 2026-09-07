"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  NewspaperClipping,
  Calendar,
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
import { formatDateIndonesian } from "@/lib/utils";
import { AdminPagination } from "../AdminPagination";
import {
  divisionOptions,
  newsCategoryOptions,
  eventCategoryOptions,
  isEventArticle,
  cleanDivisionName,
} from "../adminUtils";

export interface NewArticleState {
  title: string;
  slug: string;
  is_event: boolean;
  category: string;
  author_name: string;
  reading_time: string;
  excerpt: string;
  content: string;
  cover_image: string;
  event_date: string;
}

export interface BeritaTabProps {
  newArticle: NewArticleState;
  onNewArticleChange: (article: NewArticleState) => void;
  imageUploadMode: "url" | "file";
  onImageUploadModeChange: (mode: "url" | "file") => void;
  onDeviceFileUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => void;
  onCreateNews: (e: React.FormEvent) => void;
  newsList: any[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenEditModal: (article: any) => void;
  onDeleteArticle: (article: any) => void;
}

/**
 * Tab Berita & Event: Formulir penerbitan artikel/kegiatan baru dengan pemilihan divisi,
 * kategori, date-time picker event, upload file/url, serta kartu daftar berita terpublikasi.
 */
export const BeritaTab: React.FC<BeritaTabProps> = ({
  newArticle,
  onNewArticleChange,
  imageUploadMode,
  onImageUploadModeChange,
  onDeviceFileUpload,
  onCreateNews,
  newsList,
  searchQuery,
  onSearchChange,
  onOpenEditModal,
  onDeleteArticle,
}) => {
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 saat pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE) || 1;

  // Pastikan currentPage tidak melebihi totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return newsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [newsList, currentPage]);

  return (
    <div className="space-y-6">
      <GlassCard glowColor="cyan" className="p-6 sm:p-7 space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
          <h3 className="text-base font-bold text-white">Tambah Berita / Event Baru</h3>

          {/* Jenis Berita Toggle Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onNewArticleChange({
                  ...newArticle,
                  is_event: false,
                  category: "Informasi",
                })
              }
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer border flex items-center gap-1.5 ${
                !newArticle.is_event
                  ? "bg-[#1DB954] text-black border-[#1DB954] shadow-md"
                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <NewspaperClipping size={14} /> Berita / News
            </button>
            <button
              type="button"
              onClick={() =>
                onNewArticleChange({
                  ...newArticle,
                  is_event: true,
                  category: "Workshop",
                })
              }
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer border flex items-center gap-1.5 ${
                newArticle.is_event
                  ? "bg-yellow-400 text-black border-yellow-400 shadow-md"
                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <Calendar size={14} /> Event / Agenda
            </button>
          </div>
        </div>

        <form onSubmit={onCreateNews} className="space-y-4 sm:space-y-4.5">
          {/* Row 1: Judul Berita Utama */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Judul Berita / Event *
            </label>
            <input
              type="text"
              required
              value={newArticle.title}
              onChange={(e) =>
                onNewArticleChange({ ...newArticle, title: e.target.value })
              }
              placeholder={
                newArticle.is_event ? "Judul Agenda Event..." : "Judul Berita Utama..."
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
            />
          </div>

          {/* Row 2: 4-Column Compact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 items-end">
            <div>
              <CyberSelect
                label="Divisi Penerbit *"
                value={cleanDivisionName(newArticle.author_name)}
                onChange={(val) =>
                  onNewArticleChange({ ...newArticle, author_name: val })
                }
                options={divisionOptions}
              />
            </div>

            <div>
              <CyberSelect
                label={`Kategori ${newArticle.is_event ? "(Event)" : "(News)"} *`}
                value={newArticle.category}
                onChange={(val) =>
                  onNewArticleChange({ ...newArticle, category: val })
                }
                options={newArticle.is_event ? eventCategoryOptions : newsCategoryOptions}
              />
            </div>

            <div>
              {newArticle.is_event ? (
                <CyberDateTimePicker
                  value={newArticle.event_date || ""}
                  onChange={(val) =>
                    onNewArticleChange({ ...newArticle, event_date: val })
                  }
                  label="Tanggal Event *"
                />
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Tanggal Terbit
                  </label>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs font-mono text-slate-300 font-medium text-center">
                    Hari Ini (Otomatis)
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Menit Baca (Reading Time)
              </label>
              <input
                type="text"
                value={newArticle.reading_time || "4 min read"}
                onChange={(e) =>
                  onNewArticleChange({ ...newArticle, reading_time: e.target.value })
                }
                placeholder="e.g. 4 min read"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 3: Gambar Sampul Utama */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Gambar Sampul Berita / Poster Event *
            </label>

            {newArticle.cover_image && (
              <div className="mb-3 relative w-full h-44 rounded-xl overflow-hidden border-2 border-white/10 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={newArticle.cover_image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    onNewArticleChange({ ...newArticle, cover_image: "" })
                  }
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white text-[11px] font-mono px-2 py-1 rounded-md transition-colors"
                >
                  Hapus
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              {imageUploadMode === "url" ? (
                <input
                  type="text"
                  required={!newArticle.cover_image}
                  value={newArticle.cover_image}
                  onChange={(e) =>
                    onNewArticleChange({ ...newArticle, cover_image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
                />
              ) : (
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      onDeviceFileUpload(e, (base64Url) =>
                        onNewArticleChange({ ...newArticle, cover_image: base64Url })
                      )
                    }
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:font-bold file:bg-[#1DB954] file:text-black hover:file:bg-[#1ed760] file:cursor-pointer border border-dashed border-white/20 p-2 rounded-xl bg-white/[0.02]"
                  />
                </div>
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onImageUploadModeChange("url");
                    if (newArticle.cover_image?.startsWith("data:image")) {
                      onNewArticleChange({ ...newArticle, cover_image: "" });
                    }
                  }}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    imageUploadMode === "url"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LinkSimple size={14} weight="bold" /> URL Gambar
                </button>
                <button
                  type="button"
                  onClick={() => onImageUploadModeChange("file")}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    imageUploadMode === "file"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <UploadSimple size={14} weight="bold" /> Ambil Dari Device
                </button>
              </div>
            </div>
          </div>

          {/* Row 4: Excerpt */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Ringkasan Singkat (Excerpt)
            </label>
            <textarea
              rows={2}
              value={newArticle.excerpt}
              onChange={(e) =>
                onNewArticleChange({ ...newArticle, excerpt: e.target.value })
              }
              placeholder="Ringkasan singkat berita untuk ditampilkan pada halaman depan..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
            />
          </div>

          {/* Row 5: Expanded Konten Berita Lengkap */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Konten Berita / Event Lengkap (Workspace Menulis Artikel) *
            </label>
            <textarea
              rows={14}
              required
              value={newArticle.content}
              onChange={(e) =>
                onNewArticleChange({ ...newArticle, content: e.target.value })
              }
              placeholder="Tuliskan seluruh narasi berita atau detail lengkap event di sini secara leluasa..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[320px]"
            />
          </div>

          <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between">
            <Button variant="spotify" size="md" icon={<Plus size={16} weight="bold" />}>
              {newArticle.is_event ? "Terbitkan Event Baru" : "Terbitkan Berita Baru"}
            </Button>
          </div>
        </form>
      </GlassCard>

      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">
            Daftar Berita & Event Terpublikasi ({newsList.length})
          </h3>

          {/* Search Bar Component */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari judul berita, divisi, atau kategori..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 sm:gap-5">
          {paginatedNews.map((n) => {
            const isEvt = isEventArticle(n);
            return (
              <GlassCard
                key={n.id}
                glowColor={isEvt ? "yellow" : "cyan"}
                className="p-5 sm:p-6 flex flex-col justify-between gap-4.5 sm:gap-5 min-h-[160px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={isEvt ? "yellow" : "spotify"} tilt="left">
                        {n.category
                          ? n.category.toUpperCase()
                          : isEvt
                          ? "EVENT"
                          : "INFORMASI"}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({n.author_name})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onOpenEditModal(n)}
                        title="Edit Berita/Event"
                        className="p-2 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Pencil size={14} weight="bold" />
                      </button>
                      <button
                        onClick={() => onDeleteArticle(n)}
                        title="Hapus Berita/Event"
                        className="p-2 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug pt-1.5">
                    {n.title}
                  </h4>
                </div>
                <div className="text-[11px] font-mono text-slate-400 border-t border-white/10 pt-3 mt-1 flex items-center gap-2">
                  {isEvt ? (
                    <>
                      <Calendar
                        size={14}
                        className="text-yellow-400 shrink-0"
                        weight="bold"
                      />
                      <span>
                        Pelaksanaan:{" "}
                        {n.event_date ? formatDateIndonesian(n.event_date) : "Segera"}
                      </span>
                    </>
                  ) : (
                    <>
                      <NewspaperClipping
                        size={14}
                        className="text-[#1DB954] shrink-0"
                        weight="bold"
                      />
                      <span>Terbit: {formatDateIndonesian(n.created_at)}</span>
                    </>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Neubrutalist Pagination Bar */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={newsList.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          itemName="berita/event"
        />
      </div>
    </div>
  );
};
