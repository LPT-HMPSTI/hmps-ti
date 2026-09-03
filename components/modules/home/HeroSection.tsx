"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code, Radio, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRadarSync } from "@/components/layout/RadarSyncContext";
import { fetchSiteSettings } from "@/services";
import { fallbackSiteSettings } from "@/constants";

export const HeroSection: React.FC = () => {
  const [settings, setSettings] = useState(fallbackSiteSettings);

  useEffect(() => {
    async function load() {
      const s = await fetchSiteSettings();
      if (s) setSettings(s);
    }
    load();
  }, []);
  const {
    mode,
    items,
    currentIndex,
    setCurrentIndex,
    nextSlide,
    prevSlide,
    slideDurationSeconds,
  } = useRadarSync();

  const currentItem = items[currentIndex % (items.length || 1)] || items[0];

  return (
    <section className="relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Soft Frosted Glass Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121520] p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#1DB954]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-block pb-1">
              <Badge variant="spotify" tilt="left">
                OFFICIAL HMPSTI SWU HUB
              </Badge>
            </div>

            {/* Typography Hierarchy: Large HMPS-TI SWU with Accent Sub-headline Official Hub */}
            <h1 className="flex flex-col space-y-1">
              <span className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
                HMPSTI SWU
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-[#1DB954] sm:text-4xl lg:text-5xl leading-tight">
                Official Hub
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pusat informasi, etalase karya teknologi, dan wadah komunikasi mahasiswa program studi Teknik Informatika STMIK Widya Utama Purwokerto.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Badge variant="cyan" tilt="left">Smart</Badge>
              <Badge variant="yellow" tilt="right">Winner</Badge>
              <Badge variant="spotify" tilt="left">Universe</Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link href="/berita">
                <Button variant="spotify" size="lg" icon={<Play size={18} weight="fill" />}>
                  Jelajahi Portal
                </Button>
              </Link>

              <Link href="/karya">
                <Button variant="glass" size="lg" icon={<Code size={18} weight="light" />}>
                  Showcase Karya
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Spotify Cyber Academic Radar Widget */}
          <div className="lg:col-span-5">
            <GlassCard glowColor="emerald" className="relative p-6 space-y-5 border-white/10 bg-[#0B0D14]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
              {/* Header: Radio Live Equalizer with Dynamic Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DB954]/20 text-[#1DB954]">
                    <Radio size={20} weight="fill" className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#1DB954] uppercase tracking-wider block">
                      // ACADEMIC RADAR
                    </span>
                    <h3 className="text-xs font-bold text-white">STMIK Widya Utama</h3>
                  </div>
                </div>

                <Badge variant={currentItem.badgeVariant} tilt="right" pulse>
                  {currentItem.badgeText}
                </Badge>
              </div>

              {/* Animated Carousel / Single Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id + currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-4"
                >
                  {/* Image Cover */}
                  <Link href={currentItem.link} className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer">
                    <img
                      src={currentItem.thumbnail}
                      alt={currentItem.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-md transition-transform group-hover:scale-110">
                        <Play size={14} weight="fill" />
                      </div>
                    </div>
                  </Link>

                  {/* Info Details */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-[#1DB954] font-bold block">
                      // {currentItem.badgeText}
                    </span>
                    <Link href={currentItem.link}>
                      <h4 className="text-sm font-extrabold text-white leading-snug truncate hover:text-[#1DB954] transition-colors">
                        {currentItem.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-300 truncate">{currentItem.category}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{currentItem.subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dynamic Animated Playtime Bar (0% to 100% over 10 seconds) */}
              <div className="space-y-1.5 pt-1">
                <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  {mode === "CAROUSEL" ? (
                    <motion.div
                      key={currentIndex}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: slideDurationSeconds, ease: "linear" }}
                      className="h-full rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954]"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954]" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-[#1DB954] font-bold">{currentItem.date}</span>
                  <span>Target Periode {settings.current_period}</span>
                </div>
              </div>

              {/* Carousel Controls with Subtle Navigation Arrow Buttons & Progress Dots */}
              {mode === "CAROUSEL" && (
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1.5">
                    {items.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentIndex ? "w-6 bg-[#1DB954]" : "w-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Subtle Navigation Arrow Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={prevSlide}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                      aria-label="Slide Sebelumnya"
                      title="Sebelumnya"
                    >
                      <CaretLeft size={12} weight="bold" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                      aria-label="Slide Selanjutnya"
                      title="Selanjutnya"
                    >
                      <CaretRight size={12} weight="bold" />
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
