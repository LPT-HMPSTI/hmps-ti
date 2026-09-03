"use client";

import React from "react";
import {
  Plus,
  MagnifyingGlass,
  Pencil,
  Trash,
  LinkSimple,
  UploadSimple,
  GithubLogo,
  Globe,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CyberSelect } from "@/components/ui/CyberSelect";

export interface NewProjectState {
  title: string;
  category: string;
  description: string;
  content: string;
  author_name: string;
  author_nim: string;
  tech_stack: string | string[];
  github_url: string;
  demo_url: string;
  cover_image: string;
}

export interface KaryaTabProps {
  newProject: NewProjectState;
  onNewProjectChange: (project: NewProjectState) => void;
  projectUploadMode: "url" | "file";
  onProjectUploadModeChange: (mode: "url" | "file") => void;
  onDeviceFileUpload: (file: File, setter: (url: string) => void) => void;
  onCreateProject: (e: React.FormEvent) => void;
  projectsList: any[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenEditModal: (project: any) => void;
  onDeleteProject: (project: any) => void;
}

/**
 * Tab Showcase Karya: Formulir penambahan karya mahasiswa TI (kategori, tech stack,
 * repositori github, tautan demo langsung) serta daftar kartu proyek mahasiswa.
 */
export const KaryaTab: React.FC<KaryaTabProps> = ({
  newProject,
  onNewProjectChange,
  projectUploadMode,
  onProjectUploadModeChange,
  onDeviceFileUpload,
  onCreateProject,
  projectsList,
  searchQuery,
  onSearchChange,
  onOpenEditModal,
  onDeleteProject,
}) => {
  return (
    <div className="space-y-6">
      <GlassCard glowColor="spotify" className="p-6 sm:p-7 space-y-5 sm:space-y-6">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3.5 mb-2">
          Tambah Showcase Karya
        </h3>
        <form onSubmit={onCreateProject} className="space-y-4 sm:space-y-4.5">
          {/* Row 1: Judul Proyek, Kategori, Nama Pembuat, NIM */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-4.5 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Judul Proyek *
              </label>
              <input
                type="text"
                required
                value={newProject.title}
                onChange={(e) =>
                  onNewProjectChange({ ...newProject, title: e.target.value })
                }
                placeholder="Judul Proyek Karya..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
              />
            </div>

            <div className="sm:col-span-1">
              <CyberSelect
                label="Kategori Karya *"
                value={newProject.category}
                onChange={(val) =>
                  onNewProjectChange({ ...newProject, category: val })
                }
                options={["WEB APP", "MOBILE APP", "AI & ML", "IOT & EMBEDDED"]}
                placeholder="Pilih Kategori Karya..."
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Nama Pembuat Proyek *
              </label>
              <input
                type="text"
                required
                value={newProject.author_name}
                onChange={(e) =>
                  onNewProjectChange({ ...newProject, author_name: e.target.value })
                }
                placeholder="Nama Mahasiswa / Tim..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                NIM Pembuat (Opsional)
              </label>
              <input
                type="text"
                value={newProject.author_nim}
                onChange={(e) =>
                  onNewProjectChange({ ...newProject, author_nim: e.target.value })
                }
                placeholder="e.g. 220101010"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Row 2: Gambar Proyek */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Gambar Cover Proyek (URL / Device File)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Sneakpeek Preview */}
              {newProject.cover_image && (
                <div className="relative shrink-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={newProject.cover_image}
                    alt="Sneakpeek Proyek"
                    className="h-12 w-24 rounded-xl border-2 border-black bg-slate-900 object-cover shadow-[2px_2px_0px_0px_#000000]"
                  />
                  <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 text-[7px] font-mono font-black bg-[#FFD700] text-black border border-black rounded shadow-[1px_1px_0px_0px_#000]">
                    PREVIEW
                  </span>
                </div>
              )}

              <div className="flex-1 w-full">
                {projectUploadMode === "url" ? (
                  <input
                    key="project-create-url-input"
                    type="text"
                    value={newProject.cover_image || ""}
                    onChange={(e) =>
                      onNewProjectChange({ ...newProject, cover_image: e.target.value })
                    }
                    placeholder="URL Gambar Cover Proyek (e.g. https://...)"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                  />
                ) : (
                  <input
                    key="project-create-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onDeviceFileUpload(file, (base64Url) => {
                          onNewProjectChange({ ...newProject, cover_image: base64Url });
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                  />
                )}
              </div>

              {/* Mode Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onProjectUploadModeChange("url");
                    if (newProject.cover_image?.startsWith("data:image")) {
                      onNewProjectChange({ ...newProject, cover_image: "" });
                    }
                  }}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    projectUploadMode === "url"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LinkSimple size={14} weight="bold" /> URL Gambar
                </button>
                <button
                  type="button"
                  onClick={() => onProjectUploadModeChange("file")}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    projectUploadMode === "file"
                      ? "bg-[#1DB954] text-black font-bold border-[#1DB954] shadow-md"
                      : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <UploadSimple size={14} weight="bold" /> Ambil Dari Device
                </button>
              </div>
            </div>
          </div>

          {/* Row 3: Tech Stack, Github Repo URL, Demo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4.5">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Teknologi Digunakan (Pisahkan Koma) *
              </label>
              <input
                type="text"
                required
                value={
                  typeof newProject.tech_stack === "string"
                    ? newProject.tech_stack
                    : Array.isArray(newProject.tech_stack)
                    ? newProject.tech_stack.join(", ")
                    : ""
                }
                onChange={(e) =>
                  onNewProjectChange({ ...newProject, tech_stack: e.target.value })
                }
                placeholder="e.g. Next.js, TypeScript, Tailwind CSS, Supabase"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Tautan GitHub Repositori
              </label>
              <input
                type="url"
                value={newProject.github_url}
                onChange={(e) =>
                  onNewProjectChange({ ...newProject, github_url: e.target.value })
                }
                placeholder="https://github.com/username/project"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
                Tautan Live Demo / Aplikasi
              </label>
              <input
                type="url"
                value={newProject.demo_url}
                onChange={(e) =>
                  onNewProjectChange({ ...newProject, demo_url: e.target.value })
                }
                placeholder="https://my-app.vercel.app"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 4: Deskripsi Singkat */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Deskripsi Singkat Karya *
            </label>
            <textarea
              rows={2}
              required
              value={newProject.description}
              onChange={(e) =>
                onNewProjectChange({ ...newProject, description: e.target.value })
              }
              placeholder="Ringkasan singkat tentang tujuan dan kegunaan karya..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Row 5: Expanded Konten Proyek Lengkap */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Dokumentasi / Cerita Pembuatan Proyek Lengkap *
            </label>
            <textarea
              rows={12}
              required
              value={newProject.content}
              onChange={(e) =>
                onNewProjectChange({ ...newProject, content: e.target.value })
              }
              placeholder="Penjelasan lengkap inovasi, latar belakang masalah, cara kerja, dan solusi yang dibangun ala artikel blog..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[260px]"
            />
          </div>

          {/* Dedicated Bottom Left Row for Submit Button */}
          <div className="pt-4 mt-5 border-t border-white/10 flex justify-start">
            <Button variant="spotify" size="md" icon={<Plus size={14} weight="bold" />}>
              Terbitkan Karya Baru
            </Button>
          </div>
        </form>
      </GlassCard>

      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">
            Showcase Karya Terdaftar ({projectsList.length})
          </h3>

          {/* Search Bar Component */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari judul karya, pembuat, atau techstack..."
              className="w-full rounded-xl border-2 border-black bg-[#121520] py-2 pl-9.5 pr-8 text-xs text-white placeholder-slate-400 font-mono shadow-[2px_2px_0px_0px_#000000] focus:border-[#1DB954] focus:outline-none"
            />
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 sm:gap-5">
          {projectsList.map((p) => {
            const techList = Array.isArray(p.tech_stack)
              ? p.tech_stack
              : typeof p.tech_stack === "string" && p.tech_stack.length > 0
              ? p.tech_stack.split(",").map((s: string) => s.trim())
              : [];
            return (
              <GlassCard
                key={p.id}
                glowColor="spotify"
                className="p-5 sm:p-6 flex flex-col justify-between gap-4 sm:gap-4.5 min-h-[180px]"
              >
                <div className="space-y-3">
                  {/* Header: Badge & Top-Right Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="spotify" tilt="left">
                      {p.category || "KARYA TI"}
                    </Badge>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onOpenEditModal(p)}
                        title="Edit Karya"
                        className="p-2 rounded-md border-2 border-black bg-[#FFD700] text-black shadow-[2px_2px_0px_0px_#000000] -rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Pencil size={14} weight="bold" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(p)}
                        title="Hapus Karya"
                        className="p-2 rounded-md border-2 border-black bg-[#FF007F] text-white shadow-[2px_2px_0px_0px_#000000] rotate-2 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail + Title + Desc */}
                  <div className="flex items-start gap-3.5 pt-1">
                    {p.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        className="h-14 w-14 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
                      />
                    )}
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-sm font-bold text-white leading-snug truncate">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {techList.map((tech: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Author Name & External Links */}
                <div className="text-[11px] font-mono text-slate-400 border-t border-white/10 pt-3 mt-1 flex items-center justify-between">
                  <span className="truncate max-w-[180px]">
                    {p.author_name || p.author || "Mahasiswa TI"}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub Repositori"
                        className="p-1.5 rounded-md border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_#000000] -rotate-1 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
                      >
                        <GithubLogo size={15} weight="bold" />
                      </a>
                    )}
                    {p.demo_url && (
                      <a
                        href={p.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        title="Live Demo Proyek"
                        className="px-2.5 py-1 rounded-md border-2 border-black bg-[#1DB954] text-black shadow-[2px_2px_0px_0px_#000000] rotate-1 hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-extrabold"
                      >
                        <Globe size={14} weight="bold" />
                        <span>Demo</span>
                        <ArrowSquareOut size={12} weight="bold" />
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
