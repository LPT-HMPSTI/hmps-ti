"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Copy, Check, Heart } from "lucide-react";
import { TerminalWindow } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { fetchNewsList, getLocalLikeState, toggleDatabaseLike } from "@/services";
import { fallbackNews } from "@/constants";
import { SkeletonDetail } from "@/components/ui/Skeleton";

const isEventArticle = (item: any) => {
  if (!item) return false;
  if (item.is_event === true || item.is_event === "true") return true;
  const cat = (item.category || "").trim().toLowerCase();
  const eventCats = ["event", "workshop", "webinar", "kompetisi", "makrab"];
  return eventCats.includes(cat);
};

const formatDisplayDate = (item: any) => {
  if (!item) return "Minggu, 30 Agustus 2026";
  const isEvt = isEventArticle(item);

  if (isEvt || item.event_date) {
    const rawEventDate = item.event_date || item.date;
    if (!rawEventDate) return "Mendatang 2026";
    try {
      const d = new Date(rawEventDate);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch {}
    return rawEventDate;
  }

  const rawPubDate = item.created_at || item.date;
  if (!rawPubDate) return "Minggu, 30 Agustus 2026";

  try {
    const d = new Date(rawPubDate);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  } catch {}

  return rawPubDate;
};

export default function DetailBeritaPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "";
  const [copied, setCopied] = useState(false);
  
  // Instant matching from seed data to eliminate flash of wrong item on initial render
  const [article, setArticle] = useState<any>(() => {
    return fallbackNews.find((a: any) => a.slug === rawSlug || a.id === rawSlug) || null;
  });

  const [isLiked, setIsLiked] = useState<boolean>(() => {
    return getLocalLikeState("news", rawSlug);
  });
  const [reactionBadge, setReactionBadge] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      if (!rawSlug) return;
      // Also check local liked state with current slug
      setIsLiked(getLocalLikeState("news", rawSlug));

      const list = await fetchNewsList();
      if (list && list.length > 0) {
        const found = list.find((item: any) => item.slug === rawSlug || item.id === rawSlug);
        if (found) {
          setArticle(found);
          setIsLiked(getLocalLikeState("news", found.id) || getLocalLikeState("news", found.slug));
        }
      }
    }
    loadArticle();
  }, [rawSlug]);

  const handleToggleLike = async () => {
    if (!article) return;
    const next = !isLiked;
    setIsLiked(next);
    const badgeText = next ? ":) Liked!" : ":( Unliked";
    setReactionBadge(badgeText);
    setTimeout(() => setReactionBadge(null), 2000);

    const base = article.likes_count ?? 0;
    const optimisticCount = Math.max(0, next ? base + 1 : base - 1);
    setArticle((prev: any) => ({ ...prev, likes_count: optimisticCount }));

    await toggleDatabaseLike("news", article.id || rawSlug, next, base);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!article) {
    return <SkeletonDetail />;
  }

  const currentLikes = article.likes_count ?? (isLiked ? 1 : 0);

  const contentParagraphs =
    typeof article.content === "string"
      ? article.content.split("\n\n")
      : Array.isArray(article.content)
      ? article.content
      : [article.excerpt || article.content];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Back Button with Generous Spacing to Title */}
      <div className="mb-6 pb-2">
        <Link href="/berita">
          <Button variant="glass" size="sm" icon={<ArrowLeft size={16} strokeWidth={1.5} />} iconPosition="left">
            Kembali ke Portal Berita
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-[#1DB954] font-bold">
          <span>// {isEventArticle(article) ? "EVENT HMPSTI" : article.category || "Berita"}</span>
          <span>•</span>
          <span className="text-cyan-400">Official Release</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-white">
              <span className="text-slate-400">Oleh:</span>{" "}
              <span className="font-semibold text-slate-100">{article.author_name || article.author || "Divisi LPT"}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className={isEventArticle(article) ? "text-yellow-400 font-bold" : "text-cyan-400"} />{" "}
              {isEventArticle(article) ? "Pelaksanaan: " : "Terbit: "}
              {formatDisplayDate(article)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-slate-400" /> {article.reading_time || article.readingTime || "4 min read"}
            </span>
          </div>

          {/* Interactive Like Button with Counter matching Detail Karya */}
          <div className="relative flex items-center">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black font-mono text-xs font-bold transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] ${
                isLiked
                  ? "bg-[#1DB954] text-black scale-105"
                  : "bg-white/[0.05] text-slate-300 border-white/20 hover:border-[#1DB954] hover:text-white"
              }`}
            >
              <Heart size={14} className={isLiked ? "fill-black text-black" : "text-[#1DB954]"} />
              <span>{isLiked ? "Disukai" : "Sukai Berita"}</span>
              <span className="font-mono text-xs font-bold ml-0.5">({currentLikes})</span>
            </button>

            <AnimatePresence>
              {reactionBadge && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: -30 }}
                  exit={{ opacity: 0, scale: 0.8, y: 5 }}
                  className="absolute right-0 whitespace-nowrap px-2.5 py-0.5 rounded-md border-2 border-black bg-[#1DB954] text-black font-mono text-[10px] font-black shadow-[2px_2px_0px_0px_#000000] pointer-events-none z-30"
                >
                  {reactionBadge}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <img
          src={article.cover_image || article.coverImage || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop"}
          alt={article.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent opacity-40" />
      </div>

      {/* Article Body Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-8 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
          {contentParagraphs.map((paragraph: string, idx: number) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Sidebar Actions & Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card Bagikan Berita */}
          <GlassCard glowColor="emerald" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">Bagikan Berita Ini</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bagikan rilis berita resmi dan agenda kegiatan ini ke rekan mahasiswa dan media sosial.
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                variant="spotify"
                size="sm"
                icon={<Share2 size={14} />}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(article.title + " " + window.location.href)}`,
                      "_blank"
                    );
                  }
                }}
              >
                Bagikan ke WhatsApp
              </Button>

              <Button
                variant={copied ? "spotify" : "glass"}
                size="sm"
                icon={copied ? <Check size={14} className="text-black" /> : <Copy size={14} />}
                onClick={handleCopyLink}
                className={copied ? "bg-[#1DB954] text-black font-bold border-[#1DB954]" : ""}
              >
                {copied ? "Berita Disalin!" : "Salin Tautan Berita"}
              </Button>
            </div>
          </GlassCard>

          {/* Publisher Card Aligned with Official Division Branding */}
          <GlassCard glowColor="cyan" className="p-4 space-y-3">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold">// Diterbitkan Oleh</h3>
            <div className="flex items-center gap-3">              
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">Divisi {article.author_name || article.author || "Divisi LPT"}</h4>
                <p className="text-[10px] text-slate-400">STMIK Widya Utama Purwokerto</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

