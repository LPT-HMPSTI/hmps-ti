"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GalleryItem } from "@/types";

export interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onSelect: (item: GalleryItem) => void;
}

/**
 * Komponen kartu dokumentasi foto kegiatan dengan efek hover zoom,
 * badge kategori, indikator tanggal, dan tombol maximize untuk membuka lightbox.
 */
export const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  index,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => onSelect(item)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#121520] aspect-video"
    >
      <img
        src={item.url}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

      <div className="absolute top-3 left-3">
        <Badge variant="cyan" tilt="left">
          {item.category}
        </Badge>
      </div>

      <div className="absolute bottom-4 left-4 right-4 space-y-1">
        <h3 className="text-sm font-bold text-white group-hover:text-[#1DB954] transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
          <Calendar size={11} className="text-[#1DB954]" />{" "}
          {item.event_date || (item as any).date || "2026"}
        </p>
      </div>

      <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 size={14} />
      </div>
    </motion.div>
  );
};
