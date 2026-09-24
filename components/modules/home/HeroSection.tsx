"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Code } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fetchSiteSettings } from "@/services";
import { fallbackSiteSettings } from "@/constants";

// 20-25 Deterministic Starfield dots for subtle background ambient
const STARFIELD_DOTS = [
  { top: "12%", left: "8%", size: "2px", delay: "0s", duration: "5s" },
  { top: "22%", left: "18%", size: "1.5px", delay: "1.2s", duration: "6s" },
  { top: "15%", left: "38%", size: "2px", delay: "2.5s", duration: "7s" },
  { top: "28%", left: "55%", size: "1px", delay: "0.8s", duration: "4.5s" },
  { top: "10%", left: "75%", size: "2px", delay: "3.1s", duration: "6.5s" },
  { top: "18%", left: "90%", size: "1.5px", delay: "1.7s", duration: "5.5s" },
  { top: "45%", left: "5%", size: "1.5px", delay: "2.1s", duration: "6s" },
  { top: "52%", left: "14%", size: "2px", delay: "0.4s", duration: "4.8s" },
  { top: "68%", left: "8%", size: "1px", delay: "3.5s", duration: "7.2s" },
  { top: "82%", left: "22%", size: "2px", delay: "1.9s", duration: "5.2s" },
  { top: "40%", left: "82%", size: "1.5px", delay: "0.3s", duration: "6.8s" },
  { top: "62%", left: "92%", size: "2px", delay: "2.8s", duration: "5.8s" },
  { top: "78%", left: "85%", size: "1px", delay: "1.1s", duration: "4.2s" },
  { top: "88%", left: "72%", size: "2px", delay: "3.9s", duration: "6.4s" },
  { top: "32%", left: "26%", size: "1px", delay: "2.3s", duration: "5.1s" },
  { top: "60%", left: "32%", size: "2px", delay: "0.9s", duration: "6.2s" },
  { top: "75%", left: "48%", size: "1.5px", delay: "3.2s", duration: "5.7s" },
  { top: "85%", left: "60%", size: "2px", delay: "1.5s", duration: "7s" },
  { top: "25%", left: "68%", size: "1.5px", delay: "2.7s", duration: "4.9s" },
  { top: "48%", left: "74%", size: "2px", delay: "0.6s", duration: "6.1s" },
  { top: "14%", left: "48%", size: "1px", delay: "1.8s", duration: "5.4s" },
  { top: "92%", left: "35%", size: "2px", delay: "2.2s", duration: "6.6s" },
  { top: "8%", left: "28%", size: "1.5px", delay: "3.6s", duration: "4.7s" },
  { top: "94%", left: "12%", size: "1px", delay: "0.7s", duration: "5.9s" },
  { top: "50%", left: "96%", size: "2px", delay: "1.4s", duration: "6.3s" },
];

export const HeroSection: React.FC = () => {
  const [settings, setSettings] = useState(fallbackSiteSettings);
  const sectionRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await fetchSiteSettings();
      if (s) setSettings(s);
    }
    load();
  }, []);

  // High-performance cursor follower using direct DOM transform manipulation (0 re-renders)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current || !glowRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 180; // 180px offset (half of 360px glow width)
    const y = e.clientY - rect.top - 180;  // 180px offset (half of 360px glow height)

    glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden w-full px-4 sm:px-6 lg:px-8 pt-[70px] sm:pt-[95px] pb-[35px] sm:pb-[50px]"
      style={{ paddingBottom: "80px" }}
    >

      {/* 1. LOGO WATERMARK (Paling Belakang - Layer 0) */}
      <div className="pointer-events-none absolute -right-20 md:-right-13 top-1/2 -translate-y-1/2 z-0 hidden sm:block select-none overflow-hidden">
        <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] lg:w-[620px] lg:h-[620px] opacity-[0.11] filter grayscale brightness-125 blur-[2.5px] transform translate-x-1/4">
          <Image
            src="/logo-hmpsti.webp"
            alt="HMPSTI Watermark Logo"
            fill
            className="object-contain object-right"
            priority
          />
        </div>
      </div>

      {/* 2. STARFIELD HALUS (Layer 1) */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden hidden sm:block">
        {STARFIELD_DOTS.map((dot, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white/70 animate-twinkle"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              ["--twinkle-delay" as string]: dot.delay,
              ["--twinkle-duration" as string]: dot.duration,
            }}
          />
        ))}
      </div>

      {/* 3. ORBIT LINE DEKORATIF (Layer 2) */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden">
        <div
          className="animate-orbit w-[600px] h-[300px] sm:w-[850px] sm:h-[420px] lg:w-[1100px] lg:h-[540px] rounded-[50%] border border-[#1DB954]/25 opacity-[0.15] filter blur-[0.5px]"
          style={{ transform: "rotate(-25deg)" }}
        />
      </div>

      {/* 4. RADIAL GLOW "BREATHING" (Layer 3) */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#1DB954]/14 blur-3xl animate-radial-breath z-[3]" />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-500/8 blur-3xl animate-radial-breath z-[3]"
        style={{ animationDelay: "2.5s" }}
      />

      {/* 5. CURSOR-FOLLOWING GLOW (Layer 4 - Scoped to Hero Section) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 w-[360px] h-[360px] rounded-full z-[4] hidden [@media(pointer:fine)]:block cursor-glow-hero transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={{
          background: "radial-gradient(circle, rgba(29, 185, 84, 0.26) 0%, rgba(29, 185, 84, 0.08) 45%, transparent 70%)",
          transition: "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          willChange: "transform",
        }}
      />

      {/* 6. HERO CONTENT & STAGGERED ENTRANCE ANIMATION (Layer 10) */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 sm:space-y-5 max-w-2xl mx-auto">
        {/* Badge */}
        <div className="inline-block pb-0.5 animate-hero-fade" style={{ animationDelay: "0ms", paddingBottom: "20px", marginTop: "-20px" }}>
          <Badge variant="spotify" tilt="left">
            OFFICIAL HMPSTI SWU HUB
          </Badge>
        </div>

        {/* Typography Hierarchy */}
        <h1 className="flex flex-col space-y-1 animate-hero-fade" style={{ animationDelay: "100ms", paddingBottom: "15px" }}>
          <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none" style={{ paddingBottom: "10px" }}>
            HMPSTI SWU
          </span>
          <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1DB954] leading-tight">
            Official Hub
          </span>
        </h1>

        {/* Description */}
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed animate-hero-fade" style={{ animationDelay: "200ms", paddingBottom: "10px" }}>
          Pusat informasi, etalase karya teknologi, dan wadah komunikasi mahasiswa program studi Teknik Informatika STMIK Widya Utama Purwokerto.
        </p>

        {/* Tag Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-0.5 animate-hero-fade" style={{ animationDelay: "300ms", paddingBottom: "20px" }}>
          <Badge variant="cyan" tilt="left">Smart</Badge>
          <Badge variant="yellow" tilt="right">Winner</Badge>
          <Badge variant="spotify" tilt="left">Universe</Badge>
        </div>

        {/* Action Buttons with Micro-interactions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1.5 animate-hero-fade" style={{ animationDelay: "400ms" }}>
          <Link href="/berita">
            <Button
              variant="spotify"
              size="lg"
              icon={<Play size={18} weight="fill" />}
              className="transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(29,185,84,0.65)]"
            >
              Jelajahi Portal
            </Button>
          </Link>

          <Link href="/karya">
            <Button
              variant="glass"
              size="lg"
              icon={<Code size={18} weight="light" />}
              className="transition-all duration-300 hover:scale-[1.03] hover:border-[#1DB954]/50 hover:bg-white/[0.08]"
            >
              Showcase Karya
            </Button>
          </Link>
        </div>
      </div>

    </section>
  );
};
