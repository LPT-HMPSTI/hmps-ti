"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ChevronLeft, ChevronRight, ExternalLink, FolderOpen, Images } from "lucide-react";
import { optimizedImage } from "@/lib/imagekit-url";

export interface LightboxImage {
  title: string;
  category: string;
  date: string;
  url: string;
  photos?: string[];
  drive_url?: string;
  description: string;
}

/**
 * Overlay fullscreen untuk menampilkan foto galeri secara detail dengan slider multi-foto (maks 4 foto),
 * indikator thumbnail preview kecil, dan tombol tautan Google Drive dokumentasi lengkap.
 *
 * @param isOpen  - Kontrol visibilitas lightbox.
 * @param onClose - Callback yang dipanggil saat backdrop atau tombol X diklik.
 * @param image   - Data foto galeri terpilih.
 */
interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  image: LightboxImage | null;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, image }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter dan kumpulkan foto yang valid (maksimal 4 foto)
  const displayPhotos = useMemo(() => {
    if (!image) return [];
    if (Array.isArray(image.photos) && image.photos.length > 0) {
      const valid = image.photos.filter((p) => typeof p === "string" && p.trim() !== "");
      if (valid.length > 0) return valid.slice(0, 4);
    }
    return image.url ? [image.url] : [];
  }, [image]);

  // Reset index saat foto galeri baru dibuka
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, image]);

  const totalPhotos = displayPhotos.length;

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalPhotos <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1));
  }, [totalPhotos]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalPhotos <= 1) return;
    setCurrentIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1));
  }, [totalPhotos]);

  // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to slide
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !image) return null;

  const activePhotoUrl = displayPhotos[currentIndex] || image.url;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-5 md:p-6 backdrop-blur-2xl overflow-y-auto"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full my-auto max-h-[92vh] flex flex-col rounded-3xl border border-white/10 bg-[#0B0D14] shadow-2xl overflow-hidden"
        >
          {/* Tombol Tutup X */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-slate-300 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="Tutup (Esc)"
          >
            <X size={20} />
          </button>

          {/* Scrollable Container dengan custom scrollbar halus */}
          <div className="overflow-y-auto p-4 sm:p-6 md:p-7 space-y-4 max-h-[92vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {/* Area Slider Utama */}
            <div className="relative w-full max-h-[52vh] aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/70 flex items-center justify-center group mx-auto">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={optimizedImage(activePhotoUrl, "detail")}
                  alt={`${image.title} - Foto ${currentIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  decoding="async"
                  className="h-full w-full object-contain sm:object-cover bg-black"
                />
              </AnimatePresence>

              {/* Indikator Nomor Slide di atas gambar */}
              {totalPhotos > 1 && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-mono font-bold text-white shadow-lg">
                  <Images size={13} className="text-[#1DB954]" />
                  <span>
                    {currentIndex + 1} / {totalPhotos}
                  </span>
                </div>
              )}

              {/* Tombol Navigasi Panah Kiri & Kanan (Hanya tampil jika foto > 1) */}
              {totalPhotos > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-md hover:bg-[#1DB954] hover:text-black hover:border-[#1DB954] transition-all cursor-pointer shadow-xl active:scale-95"
                    title="Foto Sebelumnya (Panah Kiri)"
                  >
                    <ChevronLeft size={22} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-md hover:bg-[#1DB954] hover:text-black hover:border-[#1DB954] transition-all cursor-pointer shadow-xl active:scale-95"
                    title="Foto Selanjutnya (Panah Kanan)"
                  >
                    <ChevronRight size={22} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>

            {/* Indikator Preview Thumbnail Kecil di Bawah Foto Utama */}
            {totalPhotos > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 overflow-x-auto">
                {displayPhotos.map((photoUrl, idx) => {
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-[#1DB954] ring-2 ring-[#1DB954]/50 scale-105 shadow-[0_0_15px_rgba(29,185,84,0.45)]"
                          : "border-white/15 opacity-50 hover:opacity-100 hover:border-white/40"
                      }`}
                      title={`Lihat Foto ${idx + 1}`}
                    >
                      <img
                        src={optimizedImage(photoUrl, "thumb")}
                        alt={`Thumbnail ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 inset-x-0 text-[8px] font-mono font-bold text-center py-0.5 ${
                          isActive ? "bg-[#1DB954] text-black" : "bg-black/70 text-white"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Deskripsi & Metadata Dokumentasi */}
            <div className="space-y-3 pt-1 border-t border-white/10 mt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-[#1DB954] font-bold">// {image.category}</span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={13} /> {image.date}
                  </span>
                </div>
                {totalPhotos > 1 && (
                  <span className="text-slate-400 text-[11px] font-mono">
                    Menampilkan {totalPhotos} foto kegiatan
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {image.title}
              </h3>

              {image.description && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {image.description}
                </p>
              )}

              {/* Tempat Melampirkan Link Google Drive Akses Keseluruhan Foto */}
              {image.drive_url && image.drive_url.trim() !== "" && (
                <div className="pt-2">
                  <a
                    href={image.drive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#1DB954]/20 to-cyan-500/15 border border-[#1DB954]/40 hover:border-[#1DB954] text-white hover:text-[#1DB954] text-xs sm:text-sm font-mono font-bold transition-all shadow-[0_0_20px_rgba(29,185,84,0.15)] hover:shadow-[0_0_25px_rgba(29,185,84,0.35)] group"
                  >
                    <FolderOpen size={18} className="text-[#1DB954] shrink-0" />
                    <span className="truncate">Akses Seluruh Dokumentasi di Google Drive</span>
                    <ExternalLink
                      size={15}
                      className="shrink-0 text-slate-400 group-hover:text-[#1DB954] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
