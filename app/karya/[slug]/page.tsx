"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Share2,
  Copy,
  Check,
  Heart,
  Play,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { fetchProjectsList, fetchSiteSettings, getLocalLikeState, toggleDatabaseLike } from "@/services";
import { fallbackSiteSettings, fallbackProjects } from "@/constants";
import { formatDateIndonesian } from "@/lib/utils/dateParser";
import { SkeletonDetail } from "@/components/ui/Skeleton";

// Cute Playful Neubrutalist Tech Tag Helper
const getCuteTechBadgeStyle = (index: number) => {
  const cuteStyles = [
    { bg: "bg-[#FFE873]", text: "text-black", border: "border-black", tilt: "-rotate-2" }, // Pastel Sunflower
    { bg: "bg-[#70D6FF]", text: "text-black", border: "border-black", tilt: "rotate-2" },  // Candy Sky
    { bg: "bg-[#B8F2E6]", text: "text-black", border: "border-black", tilt: "-rotate-1" }, // Mint Sorbet
    { bg: "bg-[#FFAFCC]", text: "text-black", border: "border-black", tilt: "rotate-1" },  // Kawaii Pink
    { bg: "bg-[#D8BBFF]", text: "text-black", border: "border-black", tilt: "-rotate-2" }, // Lavender Bloom
    { bg: "bg-[#FFADAD]", text: "text-black", border: "border-black", tilt: "rotate-2" },  // Pastel Coral
    { bg: "bg-[#CAFFBF]", text: "text-black", border: "border-black", tilt: "-rotate-1" }, // Fresh Lime
  ];
  const style = cuteStyles[index % cuteStyles.length];
  return `inline-flex items-center gap-1 rounded-lg border-2 ${style.border} ${style.bg} ${style.text} px-3 py-1 text-xs font-mono font-black shadow-[2px_2px_0px_0px_#000000] ${style.tilt} hover:rotate-0 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000000] transition-all cursor-default select-none`;
};

const getCategoryBadgeVariant = (cat: string) => {
  const c = (cat || "").toUpperCase();
  if (c.includes("AI") || c.includes("ML")) return "purple" as const;
  if (c.includes("MOBILE")) return "cyan" as const;
  if (c.includes("IOT") || c.includes("EMBEDDED")) return "yellow" as const;
  return "spotify" as const;
};

export default function DetailKaryaPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "";
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    return getLocalLikeState("student_projects", rawSlug);
  });
  const [reactionBadge, setReactionBadge] = useState<string | null>(null);
  const [settings, setSettings] = useState(fallbackSiteSettings);
  const [allProjects, setAllProjects] = useState<any[]>(fallbackProjects);
  
  // Instant matching from seed data to eliminate flash of wrong item on initial render
  const [project, setProject] = useState<any>(() => {
    return fallbackProjects.find((p: any) => p.slug === rawSlug || p.id === rawSlug) || null;
  });

  useEffect(() => {
    async function loadData() {
      setIsLiked(getLocalLikeState("student_projects", rawSlug));

      const s = await fetchSiteSettings();
      if (s) setSettings(s);

      const list = await fetchProjectsList();
      if (list && list.length > 0) {
        setAllProjects(list);
        const found = list.find((item: any) => item.slug === rawSlug || item.id === rawSlug);
        if (found) {
          setProject(found);
          setIsLiked(getLocalLikeState("student_projects", found.id) || getLocalLikeState("student_projects", found.slug));
        }
      }
    }
    loadData();
  }, [rawSlug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleLike = async () => {
    if (!project) return;
    const nextState = !isLiked;
    setIsLiked(nextState);
    const badgeText = nextState ? ":) Liked Karya!" : ":( Unliked";
    setReactionBadge(badgeText);
    setTimeout(() => {
      setReactionBadge(null);
    }, 2000);

    const base = project.likes_count ?? 0;
    const optimisticCount = Math.max(0, nextState ? base + 1 : base - 1);
    setProject((prev: any) => ({ ...prev, likes_count: optimisticCount }));

    await toggleDatabaseLike("student_projects", project.id || rawSlug, nextState, base);
  };

  if (!project) {
    return <SkeletonDetail />;
  }

  const currentLikes = project.likes_count ?? (isLiked ? 1 : 0);

  const techList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === "string" && project.tech_stack.length > 0
    ? project.tech_stack.split(",").map((s: string) => s.trim())
    : [];

  const fullContent = project.content || project.full_description || project.description || "";
  const contentParagraphs =
    typeof fullContent === "string"
      ? fullContent.split("\n\n")
      : ["Proyek inovasi teknologi mahasiswa STMIK Widya Utama Purwokerto."];

  // Related projects in the same showcase
  const relatedProjects = allProjects
    .filter((p) => (p.slug || p.id) !== (project.slug || project.id))
    .slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Back Button with Generous Spacing to Title */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <Link href="/karya">
          <Button variant="glass" size="sm" icon={<ArrowLeft size={16} strokeWidth={1.5} />} iconPosition="left">
            Kembali ke Showcase Karya
          </Button>
        </Link>

        {/* Dynamic Period Badge */}
        <Badge variant="yellow" tilt="right">
          PERIODE {settings.current_period}
        </Badge>
      </div>

      {/* Project Header matching Berita detail elegance */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-[#1DB954] font-bold">
          <span>// {project.category || "SHOWCASE KARYA"}</span>
          <span>•</span>
          <span className="text-cyan-400">Official Student Innovation</span>
          <span>•</span>
          <span className="text-slate-400">STMIK Widya Utama</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
          {project.title}
        </h1>

        {/* Meta Bar: Clean Author Text (No Avatar), Date, and Like Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-white font-semibold">
              Oleh: <span className="text-slate-200">{project.author_name || "Mahasiswa TI"}</span>
              {project.author_nim && <span className="text-slate-400 font-normal ml-1">({project.author_nim})</span>}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Calendar size={14} /> Terbit: {formatDateIndonesian(project.created_at)}
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Kategori: <strong className="text-white">{project.category}</strong>
            </span>
          </div>

          {/* Interactive Like Button with Counter */}
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
              <span>{isLiked ? "Disukai" : "Sukai Karya"}</span>
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

      {/* Hero Showcase Cover Image */}
      <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40">
        <img
          src={project.cover_image || project.coverImage || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1200&auto=format&fit=crop"}
          alt={project.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-transparent opacity-50" />
      </div>

      {/* Main Content Grid: Clean Blog Layout matching Berita Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left Column: Direct Blog Content without wrapping card (8 cols) */}
        <div className="lg:col-span-8 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
          {contentParagraphs.map((paragraph: string, idx: number) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Right Column: Actions, Tech Stack, Creator Text, Share (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Hub Card */}
          <GlassCard glowColor="spotify" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center justify-between">
              <span>Tautan Aksi Proyek</span>              
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Akses live demo aplikasi atau tinjau repositori kode sumber resmi proyek.
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              {project.demo_url ? (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block"
                >
                  <Button
                    variant="spotify"
                    size="sm"
                    icon={<ExternalLink size={14} />}
                    className="w-full justify-center"
                  >
                    Buka Demo Aplikasi
                  </Button>
                </a>
              ) : (
                <Button
                  variant="glass"
                  size="sm"
                  disabled
                  className="w-full justify-center opacity-50 cursor-not-allowed"
                >
                  Demo Belum Tersedia
                </Button>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block"
                >
                  <Button
                    variant="glass"
                    size="sm"
                    icon={<Github size={14} />}
                    iconPosition="left"
                    className="w-full justify-center"
                  >
                    Lihat Source Code di GitHub
                  </Button>
                </a>
              )}
            </div>
          </GlassCard>

          {/* Tech Stack & Framework Card */}
          <GlassCard glowColor="cyan" className="p-6 space-y-3.5">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              // Tech Stack & Framework
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {techList.map((tech: string, idx: number) => (
                <span
                  key={idx}
                  className={getCuteTechBadgeStyle(idx)}
                >
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Creator Info Card (Clean Text Only, No Profile Photo/Avatar) */}
          <GlassCard glowColor="yellow" className="p-6 space-y-3">
            <h3 className="text-xs font-mono uppercase text-[#FFD700] font-bold tracking-wider">
              // Pengembang Karya
            </h3>
            <div className="space-y-1 pt-1">
              <h4 className="text-base font-bold text-white">{project.author_name || "Mahasiswa TI"}</h4>
              {project.author_role && (
                <p className="text-xs text-[#1DB954] font-mono font-medium">{project.author_role}</p>
              )}
              {project.author_nim && (
                <p className="text-xs text-slate-400 font-mono">NIM: {project.author_nim}</p>
              )}
            </div>
            <div className="text-[11px] font-mono text-slate-400 border-t border-white/10 pt-3">
              Program Studi Teknik Informatika • STMIK Widya Utama
            </div>
          </GlassCard>

          {/* Bagikan Karya Card */}
          <GlassCard glowColor="purple" className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3">Bagikan Karya Ini</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dukung karya inovasi mahasiswa dengan membagikannya ke komunitas kampus dan media sosial.
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              <Button
                variant="spotify"
                size="sm"
                icon={<Share2 size={14} />}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        "Lihat karya inovasi mahasiswa TI SWU: " + project.title + "\n" + window.location.href
                      )}`,
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
                {copied ? "Tautan Disalin!" : "Salin Tautan Karya"}
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Related Projects Section (Karya Mahasiswa Lainnya) */}
      {relatedProjects.length > 0 && (
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="spotify" tilt="left" className="mb-1">
                EKSPLORASI INOVASI
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Karya Mahasiswa Lainnya
              </h2>
            </div>

            <Link href="/karya">
              <Button variant="glass" size="sm">
                Semua Karya
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((rel, idx) => {
              const relUrl = `/karya/${rel.slug || rel.id}`;
              return (
                <div
                  key={rel.id || idx}
                  className="group rounded-2xl border border-white/10 bg-[#121520] p-4 transition-all duration-300 hover:border-[#1DB954]/40 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container (Default Cursor, only Play button is clickable) */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/10">
                      <img
                        src={rel.cover_image || rel.coverImage || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop"}
                        alt={rel.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 pointer-events-none z-10">
                        <Badge variant={getCategoryBadgeVariant(rel.category)} tilt="left" noDot className="text-[8px] py-0.5 px-2">
                          {rel.category}
                        </Badge>
                      </div>

                      {/* Clickable Play Button */}
                      <Link
                        href={relUrl}
                        title="Lihat Detail Karya"
                        className="spotify-play-btn absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg transition-transform hover:scale-110 cursor-pointer z-10"
                      >
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </Link>
                    </div>

                    <Link href={relUrl} className="cursor-pointer">
                      <h3 className="text-sm font-bold text-white hover:text-[#1DB954] transition-colors line-clamp-1 cursor-pointer">
                        {rel.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {rel.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[140px]">{rel.author_name || "Mahasiswa TI"}</span>
                    <Link href={relUrl} className="text-[#1DB954] font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
                      <span>Detail</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


