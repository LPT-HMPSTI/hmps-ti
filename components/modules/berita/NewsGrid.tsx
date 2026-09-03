"use client";

import React from "react";
import { NewsArticle } from "@/types";
import { NewsCard } from "./NewsCard";

export interface NewsGridProps {
  newsList: NewsArticle[];
  likedNews: Record<string, boolean>;
  onToggleLike: (id: string, currentLikes: number, e: React.MouseEvent) => void;
}

/**
 * Grid responsif untuk menampilkan daftar kartu berita dan event kegiatan.
 * Menyertakan fallback tampilan kosong saat tidak ada item yang cocok dengan filter pencarian.
 */
export const NewsGrid: React.FC<NewsGridProps> = ({
  newsList,
  likedNews,
  onToggleLike,
}) => {
  if (newsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-white/10 bg-[#121520]/50 backdrop-blur-md">
        <p className="text-sm font-semibold text-slate-300">
          Tidak ada berita atau event yang sesuai dengan kriteria pencarian.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Coba gunakan kata kunci lain atau pilih kategori &quot;Semua&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsList.map((news, index) => (
        <NewsCard
          key={news.id || index}
          news={news}
          index={index}
          isLiked={!!likedNews[news.id]}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
};
