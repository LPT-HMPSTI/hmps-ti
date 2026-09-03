"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchNewsList } from "@/services";
import { parseAnyDate, isTodayDate, isHotNewsDate, getDaysFromToday, formatDateIndonesian } from "@/lib/utils/dateParser";

export interface RadarItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  date: string;
  thumbnail: string;
  link: string;
  badgeText: "TODAY SCHEDULE" | "HOTNEWS" | "UPCOMING";
  badgeVariant: "yellow" | "strawberry" | "cyan";
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

export const RadarSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<"SINGLE" | "CAROUSEL">("CAROUSEL");
  const [items, setItems] = useState<RadarItem[]>([
    {
      id: "news-1",
      title: "Pelatihan Framework Modern Next.js 15 & Supabase Untuk Mahasiswa STMIK Widya Utama",
      category: "Divisi LPT • STMIK Widya Utama",
      subtitle: "Pelatihan koding intensif real-time database",
      date: "Minggu, 30 Agustus 2026",
      thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
      link: "/berita/pelatihan-framework-modern-nextjs-15",
      badgeText: "HOTNEWS",
      badgeVariant: "strawberry",
      author: "Divisi LPT",
    },
    {
      id: "news-2",
      title: "Tim Mahasiswa SWU Raih Juara 1 Hackathon IoT & AI tingkat Nasional",
      category: "Divisi Humas • HMPSTI SWU",
      subtitle: "Karya inovasi Smart Campus Environment Sensor buatan mahasiswa SWU",
      date: "Jumat, 28 Agustus 2026",
      thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
      link: "/berita/juara-1-hackathon-nasional-mahasiswa-swu",
      badgeText: "HOTNEWS",
      badgeVariant: "strawberry",
      author: "Divisi Humas",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideDurationSeconds = 10;

  useEffect(() => {
    async function loadData() {
      const allNewsList = await fetchNewsList();
      if (!allNewsList || allNewsList.length === 0) return;

      const todayScheduleEvents = allNewsList.filter((item: any) => {
        const isEventItem = item.is_event === true || item.category === "Event";
        if (!isEventItem) return false;
        const d = parseAnyDate(item.event_date || item.created_at);
        return isTodayDate(d);
      });

      const hotNewsList = allNewsList.filter((item: any) => {
        const isEventItem = item.is_event === true || item.category === "Event";
        if (isEventItem) return false;
        const d = parseAnyDate(item.created_at || item.date);
        return isHotNewsDate(d);
      });

      const upcomingEventsWithin14Days = allNewsList.filter((item: any) => {
        const isEventItem = item.is_event === true || item.category === "Event";
        if (!isEventItem) return false;
        const d = parseAnyDate(item.event_date);
        const diff = getDaysFromToday(d);
        return diff > 0 && diff <= 14;
      });

      const itemsList: RadarItem[] = [];

      // RULE 3: Both TODAY SCHEDULE event AND HOTNEWS exist today -> CAROUSEL MODE
      if (todayScheduleEvents.length > 0 && hotNewsList.length > 0) {
        todayScheduleEvents.forEach((ev: any) => {
          itemsList.push({
            id: ev.id,
            title: ev.title,
            category: ev.author_name || "Divisi PSDM",
            subtitle: ev.excerpt || "Agenda event berlangsung hari ini",
            date: formatDateIndonesian(ev.event_date || ev.created_at),
            thumbnail: ev.cover_image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
            link: `/berita/${ev.slug || ev.id}`,
            badgeText: "TODAY SCHEDULE",
            badgeVariant: "yellow",
            author: ev.author_name || "Divisi PSDM",
          });
        });

        hotNewsList.forEach((newsItem: any) => {
          itemsList.push({
            id: newsItem.id,
            title: newsItem.title,
            category: newsItem.author_name || "Divisi LPT",
            subtitle: newsItem.excerpt || "Berita terbaru HMPSTI SWU",
            date: formatDateIndonesian(newsItem.created_at || newsItem.date),
            thumbnail: newsItem.cover_image || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
            link: `/berita/${newsItem.slug || newsItem.id}`,
            badgeText: "HOTNEWS",
            badgeVariant: "strawberry",
            author: newsItem.author_name || "Divisi LPT",
          });
        });

        setItems(itemsList);
        setMode("CAROUSEL");
        return;
      }

      // RULE 1: Only TODAY SCHEDULE exists
      if (todayScheduleEvents.length > 0) {
        todayScheduleEvents.forEach((ev: any) => {
          itemsList.push({
            id: ev.id,
            title: ev.title,
            category: ev.author_name || "Divisi PSDM",
            subtitle: ev.excerpt || "Agenda event berlangsung hari ini",
            date: formatDateIndonesian(ev.event_date || ev.created_at),
            thumbnail: ev.cover_image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
            link: `/berita/${ev.slug || ev.id}`,
            badgeText: "TODAY SCHEDULE",
            badgeVariant: "yellow",
            author: ev.author_name || "Divisi PSDM",
          });
        });

        setItems(itemsList);
        setMode(itemsList.length > 1 ? "CAROUSEL" : "SINGLE");
        return;
      }

      // RULE 5 & RULE 4: HOTNEWS exists without TODAY SCHEDULE
      if (hotNewsList.length > 0) {
        hotNewsList.forEach((newsItem: any) => {
          itemsList.push({
            id: newsItem.id,
            title: newsItem.title,
            category: newsItem.author_name || "Divisi LPT",
            subtitle: newsItem.excerpt || "Berita terbaru HMPSTI SWU",
            date: formatDateIndonesian(newsItem.created_at || newsItem.date),
            thumbnail: newsItem.cover_image || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
            link: `/berita/${newsItem.slug || newsItem.id}`,
            badgeText: "HOTNEWS",
            badgeVariant: "strawberry",
            author: newsItem.author_name || "Divisi LPT",
          });
        });

        if (upcomingEventsWithin14Days.length > 0) {
          upcomingEventsWithin14Days.forEach((upEv: any) => {
            itemsList.push({
              id: upEv.id,
              title: upEv.title,
              category: upEv.author_name || "Divisi HMPSTI",
              subtitle: upEv.excerpt || "Agenda kegiatan mendatang",
              date: formatDateIndonesian(upEv.event_date),
              thumbnail: upEv.cover_image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
              link: `/berita/${upEv.slug || upEv.id}`,
              badgeText: "UPCOMING",
              badgeVariant: "cyan",
              author: upEv.author_name || "Divisi HMPSTI",
            });
          });

          setItems(itemsList);
          setMode("CAROUSEL");
          return;
        }

        setItems(itemsList);
        setMode(itemsList.length > 1 ? "CAROUSEL" : "SINGLE");
        return;
      }

      // RULE 2: Fallback UPCOMING Event
      if (upcomingEventsWithin14Days.length > 0) {
        upcomingEventsWithin14Days.forEach((upEv: any) => {
          itemsList.push({
            id: upEv.id,
            title: upEv.title,
            category: upEv.author_name || "Divisi HMPSTI",
            subtitle: upEv.excerpt || "Agenda kegiatan mendatang",
            date: formatDateIndonesian(upEv.event_date),
            thumbnail: upEv.cover_image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
            link: `/berita/${upEv.slug || upEv.id}`,
            badgeText: "UPCOMING",
            badgeVariant: "cyan",
            author: upEv.author_name || "Divisi HMPSTI",
          });
        });

        setItems(itemsList);
        setMode(itemsList.length > 1 ? "CAROUSEL" : "SINGLE");
      }
    }

    loadData();
  }, []);

  const isCarousel = mode === "CAROUSEL";
  const itemsCount = items.length;

  // Unified global 10-second timer
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
