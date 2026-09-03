"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight, Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NewsArticle } from "@/types";
import {
  parseAnyDate,
  isTodayDate,
  isHotNewsDate,
  getDaysFromToday,
  formatDateIndonesian,
} from "@/lib/utils/dateParser";

export interface NewsCardProps {
  news: NewsArticle;
  index: number;
  isLiked: boolean;
  onToggleLike: (id: string, currentLikes: number, e: React.MouseEvent) => void;
}

/**
 * Komponen kartu artikel berita atau agenda kegiatan bernuansa neubrutalism.
 * Dilengkapi badge indikator (Today/Upcoming/HotNews), tombol like instan, dan tautan detail.
 */
export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  index,
  isLiked,
  onToggleLike,
}) => {
  const catLower = (news.category || "").toLowerCase().trim();
  const isEventItem =
    Boolean(news.is_event) ||
    ["event", "workshop", "webinar", "kompetisi", "makrab"].includes(catLower);

  const eventParsedDate = parseAnyDate(news.event_date || (news as any).date);
  const newsParsedDate = parseAnyDate(news.created_at || (news as any).date);

  // Kondisi Status Badge Event
  const isEventToday = isEventItem && isTodayDate(eventParsedDate);
  const eventDaysDiff = isEventItem ? getDaysFromToday(eventParsedDate) : 999;
  const isEventUpcoming = isEventItem && eventDaysDiff > 0 && eventDaysDiff <= 14;

  // Kondisi Status Badge Hot News
  const isNewsHot = !isEventItem && isHotNewsDate(newsParsedDate);

  const currentLikes = news.likes_count ?? (isLiked ? 1 : 0);
  const newsUrl = `/berita/${news.slug || news.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="group flex flex-col justify-between h-full rounded-2xl border border-white/10 bg-[#121520]/90 p-5 transition-all duration-300 hover:border-[#1DB954]/40 hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-2xl">
        <div>
          <div className="relative mb-4 aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/40">
            <img
              src={
                news.cover_image ||
                (news as any).coverImage ||
                "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop"
              }
              alt={news.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

            {/* Dual Badges Container */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              {/* Primary Badge */}
              <Badge variant={isEventItem ? "yellow" : "spotify"} tilt="left">
                {isEventItem ? "EVENT" : news.category || "BERITA"}
              </Badge>

              {/* Secondary Status Badge */}
              {isEventToday && (
                <Badge variant="yellow" pulse tilt="right">
                  TODAY SCHEDULE
                </Badge>
              )}
              {!isEventToday && isEventUpcoming && (
                <Badge variant="cyan" tilt="right">
                  UPCOMING
                </Badge>
              )}
              {isNewsHot && (
                <Badge variant="strawberry" pulse tilt="right">
                  HOTNEWS
                </Badge>
              )}
            </div>

            {/* Interactive Like Button on Image with Counter */}
            <button
              type="button"
              onClick={(e) => onToggleLike(news.id, news.likes_count ?? 0, e)}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/40 bg-black/60 backdrop-blur-md text-slate-300 hover:text-[#1DB954] transition-all cursor-pointer z-10 shadow-md"
              title="Sukai Berita Ini"
            >
              <Heart size={13} className={isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""} />
              <span className="text-[11px] font-mono font-bold text-white">{currentLikes}</span>
            </button>

            {/* Clickable Play Button Overlay Direct Routing */}
            <Link
              href={newsUrl}
              title="Baca Detail Berita"
              className="spotify-play-btn absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-2xl transition-transform hover:scale-110 cursor-pointer z-10"
            >
              <Play size={18} fill="currentColor" />
            </Link>
          </div>

          {/* Display Date: Event Execution Date vs News Publication Date */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mb-2">
            <span
              className={`flex items-center gap-1 font-bold ${
                isEventItem ? "text-yellow-400" : "text-[#1DB954]"
              }`}
            >
              <Calendar size={12} />{" "}
              {formatDateIndonesian(
                isEventItem
                  ? news.event_date || (news as any).date
                  : news.created_at || (news as any).date
              )}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={12} /> {news.reading_time || (news as any).readingTime || "4 min read"}
            </span>
          </div>

          <Link href={newsUrl} className="cursor-pointer">
            <h3 className="text-base font-bold text-white group-hover:text-[#1DB954] transition-colors leading-snug cursor-pointer">
              {news.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {news.excerpt}
          </p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400 truncate max-w-[200px]">
            <span>Oleh: </span>
            <span className="text-slate-200 font-semibold">
              {news.author_name || (news as any).author || "Divisi LPT"}
            </span>
          </div>

          <Link href={newsUrl}>
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowUpRight size={14} strokeWidth={1.5} />}
            >
              Baca Detail
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
