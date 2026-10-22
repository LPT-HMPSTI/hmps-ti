"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchNewsList, fetchProjectsList } from "@/services";
import { fallbackNews, fallbackProjects } from "@/constants";
import { formatDateIndonesian } from "@/lib/utils/dateParser";

export interface RadarItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  date: string;
  thumbnail: string;
  link: string;
  badgeText: "HOTNEWS" | "EVENT" | "KARYA BARU" | "UPCOMING";
  badgeVariant: "yellow" | "strawberry" | "cyan" | "spotify";
  author: string;
}

interface RadarSyncContextType {
  mode: "SINGLE" | "CAROUSEL";
  items: RadarItem[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  nextSlide: () => void;
  prevSlide: () => void;
  slideDurationSeconds: number;
}

const RadarSyncContext = createContext<RadarSyncContextType | undefined>(undefined);

const getInitialRadarItems = (): RadarItem[] => {
  const list: RadarItem[] = [];

  if (fallbackNews && fallbackNews.length > 0) {
    const n = fallbackNews[0];
    list.push({
      id: `news-${n.id}`,
      title: n.title,
      category: n.category || "Berita",
      subtitle: n.excerpt || "Berita terbaru HMPS-TI SWU",
      date: formatDateIndonesian(n.created_at || ""),
      thumbnail: n.cover_image || "/logo-hmpsti.webp",
      link: `/berita/${n.slug || n.id}`,
      badgeText: "HOTNEWS",
      badgeVariant: "strawberry",
      author: n.author_name ? `Divisi ${n.author_name}` : "HMPS-TI",
    });
  }

  if (fallbackProjects && fallbackProjects.length > 0) {
    const p = fallbackProjects[0];
    list.push({
      id: `project-${p.id}`,
      title: p.title,
      category: p.category || "Karya Mahasiswa",
      subtitle: p.description || "Karya inovasi teknologi mahasiswa TI",
      date: formatDateIndonesian(p.created_at || ""),
      thumbnail: p.cover_image || "/logo-hmpsti.webp",
      link: `/karya/${p.slug || p.id}`,
      badgeText: "KARYA BARU",
      badgeVariant: "cyan",
      author: p.author_name || "Mahasiswa TI",
    });
  }

  return list;
};

export const RadarSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<"SINGLE" | "CAROUSEL">("CAROUSEL");
  const [items, setItems] = useState<RadarItem[]>(getInitialRadarItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideDurationSeconds = 8;

  useEffect(() => {
    async function loadData() {
      try {
        const [newsList, projectsList] = await Promise.all([
          fetchNewsList(),
          fetchProjectsList(),
        ]);

        const validNews = Array.isArray(newsList) && newsList.length > 0 ? newsList : fallbackNews;
        const validProjects = Array.isArray(projectsList) && projectsList.length > 0 ? projectsList : fallbackProjects;

        const itemsList: RadarItem[] = [];

        // Ambil hingga 3 berita & 3 karya terbaru
        const recentNews = validNews.slice(0, 3);
        const recentProjects = validProjects.slice(0, 3);

        const maxLen = Math.max(recentNews.length, recentProjects.length);

        for (let i = 0; i < maxLen; i++) {
          // Masukkan berita terbaru
          if (recentNews[i]) {
            const n = recentNews[i];
            const isEvent =
              Boolean(n.is_event) ||
              (n.category || "").toLowerCase().includes("event") ||
              (n.category || "").toLowerCase().includes("workshop");

            itemsList.push({
              id: `news-${n.id}`,
              title: n.title,
              category: n.category || "Berita",
              subtitle: n.excerpt || "Berita terbaru HMPS-TI SWU",
              date: formatDateIndonesian(n.created_at || ""),
              thumbnail: n.cover_image || "/logo-hmpsti.webp",
              link: `/berita/${n.slug || n.id}`,
              badgeText: isEvent ? "EVENT" : "HOTNEWS",
              badgeVariant: isEvent ? "yellow" : "strawberry",
              author: n.author_name
                ? n.author_name.toLowerCase().startsWith("divisi")
                  ? n.author_name
                  : `Divisi ${n.author_name}`
                : "HMPS-TI",
            });
          }

          // Masukkan karya terbaru
          if (recentProjects[i]) {
            const p = recentProjects[i];
            itemsList.push({
              id: `project-${p.id}`,
              title: p.title,
              category: p.category || "Karya Mahasiswa",
              subtitle: p.description || "Karya inovasi teknologi mahasiswa TI",
              date: formatDateIndonesian(p.created_at),
              thumbnail: p.cover_image || "/logo-hmpsti.webp",
              link: `/karya/${p.slug || p.id}`,
              badgeText: "KARYA BARU",
              badgeVariant: "cyan",
              author: p.author_name || "Mahasiswa TI",
            });
          }
        }

        if (itemsList.length > 0) {
          setItems(itemsList);
          setMode(itemsList.length > 1 ? "CAROUSEL" : "SINGLE");
        }
      } catch (err) {
        console.warn("Failed to load radar sync data:", err);
      }
    }

    loadData();
  }, []);

  const isCarousel = mode === "CAROUSEL";
  const itemsCount = items.length;

  // Unified global rotation timer
  useEffect(() => {
    if (!isCarousel || itemsCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % itemsCount);
    }, slideDurationSeconds * 1000);
    return () => clearInterval(interval);
  }, [isCarousel, itemsCount]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % itemsCount);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + itemsCount) % itemsCount);

  return (
    <RadarSyncContext.Provider
      value={{
        mode,
        items,
        currentIndex,
        setCurrentIndex,
        nextSlide,
        prevSlide,
        slideDurationSeconds,
      }}
    >
      {children}
    </RadarSyncContext.Provider>
  );
};

export const useRadarSync = () => {
  const context = useContext(RadarSyncContext);
  if (!context) {
    throw new Error("useRadarSync must be used within a RadarSyncProvider");
  }
  return context;
};
