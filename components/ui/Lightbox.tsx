"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";

export interface LightboxImage {
  title: string;
  category: string;
  date: string;
  url: string;
  description: string;
}

/**
 * Overlay fullscreen untuk menampilkan foto galeri secara detail.
 * Merender null otomatis jika isOpen false atau image null.
 *
 * @param isOpen  - Kontrol visibilitas lightbox.
 * @param onClose - Callback yang dipanggil saat backdrop atau tombol X diklik.
 * @param image   - Data foto yang ditampilkan; null berarti tidak ada foto terpilih.
 */
interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  image: LightboxImage | null;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, image }) => {
  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full rounded-3xl border border-white/10 bg-[#0B0D14] overflow-hidden shadow-2xl space-y-4 p-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.1] text-slate-300 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
            <img src={image.url} alt={image.title} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="text-[#1DB954] font-bold">// {image.category}</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar size={13} /> {image.date}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white">{image.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{image.description}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
