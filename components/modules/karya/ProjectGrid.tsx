"use client";

import React from "react";
import { Code2 } from "lucide-react";
import { StudentProject } from "@/types";
import { ProjectCard } from "./ProjectCard";

export interface ProjectGridProps {
  projects: StudentProject[];
  likedProjects: Record<string, boolean>;
  onToggleLike: (id: string, currentLikes: number, e: React.MouseEvent) => void;
}

/**
 * Grid responsif kartu karya inovasi mahasiswa.
 * Menampilkan fallback tampilan kosong jika kata kunci atau filter tidak menemukan hasil.
 */
export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  likedProjects,
  onToggleLike,
}) => {
  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#121520] p-12 text-center backdrop-blur-xl">
        <div className="h-12 w-12 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Code2 size={24} />
        </div>
        <h3 className="text-base font-bold text-white">Tidak ada karya yang ditemukan</h3>
        <p className="text-xs font-mono text-slate-400 mt-1 max-w-sm mx-auto">
          Coba gunakan kata kunci pencarian yang lain atau ubah filter kategori.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((proj, idx) => (
        <ProjectCard
          key={proj.id || idx}
          project={proj}
          index={idx}
          isLiked={!!likedProjects[proj.id]}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
};
