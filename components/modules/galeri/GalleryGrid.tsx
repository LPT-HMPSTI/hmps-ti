"use client";

import React from "react";
import { GalleryItem } from "@/types";
import { GalleryCard } from "./GalleryCard";

export interface GalleryGridProps {
  items: GalleryItem[];
  onSelectItem: (item: GalleryItem) => void;
}

/**
 * Grid responsif daftar foto dokumentasi galeri kegiatan HMPSTI SWU.
 * Menyediakan fallback tampilan saat belum ada dokumentasi pada kategori yang dipilih.
 */
export const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  onSelectItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-white/10 bg-[#121520]/50 backdrop-blur-md">
        <p className="text-sm font-semibold text-slate-300">
          Tidak ada foto dokumentasi untuk kategori ini.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Silakan pilih kategori &quot;Semua&quot; untuk melihat seluruh dokumentasi kegiatan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <GalleryCard
          key={item.id || idx}
          item={item}
          index={idx}
          onSelect={onSelectItem}
        />
      ))}
    </div>
  );
};
