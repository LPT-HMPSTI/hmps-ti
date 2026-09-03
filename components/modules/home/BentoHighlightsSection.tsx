"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowUpRight, Play, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchNewsList, fetchSiteSettings } from "@/services";
import { fallbackSiteSettings } from "@/constants";
import { parseAnyDate, isTodayDate, isHotNewsDate, getDaysFromToday, formatDateIndonesian } from "@/lib/utils/dateParser";

export const BentoHighlightsSection: React.FC = () => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [settings, setSettings] = useState(fallbackSiteSettings);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      const data = await fetchNewsList();
      setNewsData(data || []);
      const s = await fetchSiteSettings();
      if (s) setSettings(s);
    }
    loadData();
  }, []);

  // Filter 1: Hotnews for Left Card (non-event published in last 5 days)
  const hotNewsList = newsData.filter((item) => {
    const isEventItem = item.is_event === true || item.category === "Event";
    if (isEventItem) return false;
    const d = parseAnyDate(item.created_at || item.date);
    return isHotNewsDate(d);
  });

  // Fallback: If no hotnews, use latest news articles
  const mainNewsList = hotNewsList.length > 0 ? hotNewsList : newsData.filter((item) => !item.is_event && item.category !== "Event");

  // Filter 2: Events for Right Column (Sorted by Today Schedule first, then nearest upcoming)
  const topEvents = newsData
    .filter((item) => {
      const isEventItem = item.is_event === true || item.category === "Event";
      if (!isEventItem) return false;
      const d = parseAnyDate(item.event_date || item.created_at);
      if (!d) return false;
      return getDaysFromToday(d) >= 0; // Today or future events
    })
    .sort((a, b) => {
      const dateA = parseAnyDate(a.event_date || a.created_at);
      const dateB = parseAnyDate(b.event_date || b.created_at);
      const diffA = getDaysFromToday(dateA);
      const diffB = getDaysFromToday(dateB);

      // Today Schedule (diff === 0) gets top priority!
      if (diffA === 0 && diffB !== 0) return -1;
      if (diffB === 0 && diffA !== 0) return 1;

      // Otherwise sort by closest upcoming date
      return diffA - diffB;
    })
    .slice(0, 3); // Top 3 events

  // Left Card 10-second auto-slide interval (no music progress bar)
  const isNewsCarousel = mainNewsList.length > 1;
  useEffect(() => {
    if (!isNewsCarousel) return;
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % mainNewsList.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isNewsCarousel, mainNewsList.length]);

  const currentNews = mainNewsList[currentNewsIndex % (mainNewsList.length || 1)] || mainNewsList[0];

  const nextNewsSlide = () => setCurrentNewsIndex((prev) => (prev + 1) % mainNewsList.length);
  const prevNewsSlide = () => setCurrentNewsIndex((prev) => (prev - 1 + mainNewsList.length) % mainNewsList.length);

  return (
    <section className="py-8 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge variant="cyan" tilt="left" className="mb-1">
              HIGHLIGHTS {settings.current_period}
            </Badge>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Trending Berita & <span className="text-[#1DB954]">Agenda HMPSTI</span>
            </h2>
          </div>
          <Link href="/berita">
            <Button variant="glass" size="sm" icon={<ArrowUpRight size={16} strokeWidth={1.5} />}>
              Lihat Semua Berita
            </Button>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Main News Card (Col 8) - Hotnews Carousel / Single Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-12 lg:col-span-8"
          >
            <GlassCard glowColor="emerald" className="group h-full flex flex-col justify-between p-6 sm:p-8 border-white/10 hover:border-[#1DB954]/40 relative overflow-hidden">
              {currentNews ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* News Cover Thumbnail with Clickable Play Button */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentNews.id || currentNewsIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="md:col-span-5 aspect-square relative rounded-xl overflow-hidden shadow-xl border border-white/10"
                    >
                      <img
                        src={currentNews.cover_image || currentNews.coverImage || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop"}
                        alt={currentNews.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Top Left Publisher Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="spotify" tilt="left">
                          {currentNews.author_name || "DIVISI LPT"}
                        </Badge>
                      </div>

                      {/* Clickable Play Button Overlay Direct Routing */}
                      <Link
                        href={`/berita/${currentNews.slug || currentNews.id}`}
                        className="spotify-play-btn absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-2xl transition-transform hover:scale-110 cursor-pointer z-10"
                      >
                        <Play size={18} fill="currentColor" />
                      </Link>
                    </motion.div>
                  </AnimatePresence>

                  {/* News Details */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="strawberry" pulse tilt="left">
                        HOTNEWS
                      </Badge>

                      {/* Category Badge & Subtle Navigation Arrows (if Carousel) */}
                      <div className="flex items-center gap-2">
                        <Badge variant="spotify" tilt="right">
                          {currentNews.category || "WORKSHOP"}
                        </Badge>

                        {isNewsCarousel && (
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={prevNewsSlide}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                              aria-label="Berita Sebelumnya"
                              title="Sebelumnya"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              onClick={nextNewsSlide}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                              aria-label="Berita Selanjutnya"
                              title="Selanjutnya"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentNews.id + currentNewsIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2"
                      >
                        <Link href={`/berita/${currentNews.slug || currentNews.id}`}>
                          <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#1DB954] transition-colors leading-snug">
                            {currentNews.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {currentNews.excerpt}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock size={12} className="text-[#1DB954]" />
                        {formatDateIndonesian(currentNews.created_at || currentNews.date)} • {currentNews.reading_time || "4 min read"}
                      </span>

                      <Link href={`/berita/${currentNews.slug || currentNews.id}`}>
                        <Button variant="spotify" size="sm" icon={<Play size={14} fill="currentColor" />}>
                          Baca Detail
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">Memuat Berita Trending...</div>
              )}
            </GlassCard>
          </motion.div>

          {/* Right Column Event Card (Col 4) - Top 3 Agenda Terdekat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 lg:col-span-4"
          >
            <GlassCard glowColor="cyan" className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} strokeWidth={1.5} className="text-cyan-400" />
                    <h3 className="font-bold text-white text-sm">Agenda Terdekat</h3>
                  </div>
                  <Badge variant="yellow" tilt="right">
                    EVENT & AGENDA
                  </Badge>
                </div>

                <div className="space-y-3">
                  {topEvents.map((ev, idx) => {
                    const eventParsedDate = parseAnyDate(ev.event_date || ev.date);
                    const isToday = isTodayDate(eventParsedDate);

                    return (
                      <Link
                        key={ev.id || idx}
                        href={`/berita/${ev.slug || ev.id}`}
                        className="group/item flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2.5 transition-all hover:border-[#1DB954]/40 hover:bg-white/[0.06] cursor-pointer"
                      >
                        <div className="h-11 w-11 shrink-0 rounded-lg overflow-hidden border border-white/10 relative">
                          <img
                            src={ev.cover_image || ev.coverImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop"}
                            alt={ev.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-0.5">
                            <span className={isToday ? "text-yellow-400 font-bold" : "text-[#1DB954] font-bold"}>
                              {isToday ? "Hari Ini" : formatDateIndonesian(ev.event_date || ev.date)}
                            </span>
                            <span className="text-slate-400 truncate max-w-[80px]">{ev.author_name || "Divisi HMA"}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white group-hover/item:text-[#1DB954] transition-colors truncate">
                            {ev.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}

                  {topEvents.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400">Belum ada agenda event terdekat</div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link href="/berita">
                  <p className="text-xs text-[#1DB954] hover:text-emerald-300 flex items-center justify-center gap-1 font-bold">
                    Lihat Selengkapnya di Portal Berita →
                  </p>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
