"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, ExternalLink, Play, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StudentProject } from "@/types";

export interface ProjectCardProps {
  project: StudentProject;
  index: number;
  isLiked: boolean;
  onToggleLike: (id: string, currentLikes: number, e: React.MouseEvent) => void;
}

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
  return `inline-flex items-center gap-1 rounded-lg border-2 ${style.border} ${style.bg} ${style.text} px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono font-black shadow-[2px_2px_0px_0px_#000000] ${style.tilt} hover:rotate-0 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000000] transition-all cursor-default select-none`;
};

const getCategoryBadgeVariant = (cat: string) => {
  const c = (cat || "").toUpperCase();
  if (c.includes("AI") || c.includes("ML")) return "purple" as const;
  if (c.includes("MOBILE")) return "cyan" as const;
  if (c.includes("IOT") || c.includes("EMBEDDED")) return "yellow" as const;
  return "spotify" as const;
};

/**
 * Komponen kartu showcase proyek karya inovasi mahasiswa TI dengan gaya neubrutalism.
 * Dilengkapi tag teknologi, counter suka (like), dan tombol preview live demo serta repositori github.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isLiked,
  onToggleLike,
}) => {
  const techList = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === "string" && (project.tech_stack as string).length > 0
    ? (project.tech_stack as string).split(",").map((s: string) => s.trim())
    : [];

  const currentLikes = project.likes_count ?? (isLiked ? 1 : 0);
  const projectUrl = `/karya/${project.slug || project.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="flex flex-col"
    >
      <div className="group flex flex-col justify-between h-full rounded-2xl border border-white/10 bg-[#121520]/90 p-5 transition-all duration-300 hover:border-[#1DB954]/50 hover:bg-[#151928] hover:-translate-y-1 hover:shadow-2xl">
        <div>
          {/* Cover Image Container */}
          <div className="relative mb-4 aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/40">
            <img
              src={
                project.cover_image ||
                (project as any).coverImage ||
                "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop"
              }
              alt={project.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

            {/* Hanging Category Badge */}
            <div className="absolute top-3 left-3 pointer-events-none z-10">
              <Badge
                variant={getCategoryBadgeVariant(project.category)}
                tilt="left"
                noDot
                className="py-0.5 px-2 text-[9px] font-mono font-bold"
              >
                {project.category || "PROJECT"}
              </Badge>
            </div>

            {/* Interactive Like Button on Image with Counter */}
            <button
              type="button"
              onClick={(e) => onToggleLike(project.id, project.likes_count ?? 0, e)}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-black/40 bg-black/60 backdrop-blur-md text-slate-300 hover:text-[#1DB954] transition-all cursor-pointer z-10 shadow-md"
              title="Sukai Karya Ini"
            >
              <Heart size={13} className={isLiked ? "fill-[#1DB954] text-[#1DB954]" : ""} />
              <span className="text-[11px] font-mono font-bold text-white">{currentLikes}</span>
            </button>

            {/* Spotify Round Green Play Button */}
            <Link
              href={projectUrl}
              title="Lihat Detail Karya"
              className="spotify-play-btn absolute bottom-3 right-3 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-2xl transition-transform hover:scale-110 cursor-pointer z-10"
            >
              <Play size={18} fill="currentColor" className="ml-0.5" />
            </Link>
          </div>

          {/* Title & Description */}
          <Link href={projectUrl} className="block cursor-pointer">
            <h3 className="text-base font-bold text-white leading-snug tracking-tight hover:text-[#1DB954] transition-colors cursor-pointer">
              {project.title}
            </h3>
          </Link>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Cute Neubrutalism Tech Stack Tags */}
          <div className="flex flex-wrap gap-2 pt-3.5">
            {techList.slice(0, 4).map((tech: string, i: number) => (
              <span key={i} className={getCuteTechBadgeStyle(i)}>
                {tech}
              </span>
            ))}
            {techList.length > 4 && (
              <span className="inline-flex items-center rounded-lg border-2 border-dashed border-white/20 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                +{techList.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Creator Text & Action Icons */}
        <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 truncate max-w-[200px]">
            <span>Oleh: </span>
            <span className="text-slate-200 font-semibold">
              {project.author_name || (project as any).author || "Mahasiswa TI"}
            </span>
          </div>

          {/* Action Link Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                title="GitHub Repositori"
                className="h-7 w-7 rounded-md border-2 border-black bg-[#24292E] text-white shadow-[2px_2px_0px_0px_#000000] -rotate-1 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
              >
                <Github size={14} />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                title="Live Demo Proyek"
                className="px-2.5 py-1 rounded-md border-2 border-black bg-[#1DB954] text-black shadow-[2px_2px_0px_0px_#000000] rotate-1 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1 text-[11px] font-mono font-bold"
              >
                <span>Demo</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
