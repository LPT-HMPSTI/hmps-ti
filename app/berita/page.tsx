"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchNewsList,
  fetchSiteSettings,
  getLocalLikeState,
  toggleDatabaseLike,
} from "@/services";
import { fallbackSiteSettings, fallbackNews } from "@/constants";
import { NewsArticle, SiteSettings } from "@/types";
import { NewsHero, NewsGrid } from "@/components/modules/berita";

const CATEGORIES = ["Semua", "Event", "Workshop", "Prestasi", "Akademik"];

/**
 * Halaman utama Portal Berita & Agenda HMPSTI STMIK Widya Utama.
 * Mengorkestrasi data berita, pengaturan periode, dan pencarian/filter kategori.
 */
export default function BeritaPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newsList, setNewsList] = useState<NewsArticle[]>([...(fallbackNews as NewsArticle[])]);
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings as SiteSettings);
  const [likedNews, setLikedNews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [data, s] = await Promise.all([fetchNewsList(), fetchSiteSettings()]);
        const list = (data && data.length > 0 ? data : fallbackNews) as NewsArticle[];
        setNewsList(list);

        // Hydrate status like pengunjung dari localStorage
        const initialLikes: Record<string, boolean> = {};
        list.forEach((item) => {
          if (getLocalLikeState("news", item.id)) {
            initialLikes[item.id] = true;
          }
        });
        setLikedNews(initialLikes);

        if (s) setSettings(s as SiteSettings);
      } catch (err) {
        console.warn("Gagal memuat berita terbaru, fallback digunakan:", err);
      }
    }
    loadData();
  }, []);

  const handleToggleLike = useCallback(
    async (id: string, currentLikes: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const nextLiked = !likedNews[id];
      setLikedNews((prev) => ({ ...prev, [id]: nextLiked }));

      // Optimistic update pada daftar artikel
      setNewsList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                likes_count: Math.max(
                  0,
                  nextLiked ? (item.likes_count || 0) + 1 : (item.likes_count || 1) - 1
                ),
              }
            : item
        )
      );

      // Sinkronkan ke database Supabase & localStorage
      await toggleDatabaseLike("news", id, nextLiked, currentLikes);
    },
    [likedNews]
  );

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      let matchesCategory = activeCategory === "Semua";
      if (activeCategory === "Event") {
        matchesCategory = item.is_event === true || item.category === "Event";
      } else if (activeCategory !== "Semua") {
        matchesCategory = item.category === activeCategory;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.author_name && item.author_name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [newsList, activeCategory, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Banner & Search/Category Filter */}
      <NewsHero
        currentPeriod={settings.current_period}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={CATEGORIES}
      />

      {/* Grid Daftar Kartu Berita & Event */}
      <NewsGrid
        newsList={filteredNews}
        likedNews={likedNews}
        onToggleLike={handleToggleLike}
      />
    </div>
  );
}
