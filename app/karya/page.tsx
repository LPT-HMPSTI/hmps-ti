"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchProjectsList,
  fetchSiteSettings,
  getLocalLikeState,
  toggleDatabaseLike,
} from "@/services";
import { fallbackSiteSettings, fallbackProjects } from "@/constants";
import { StudentProject, SiteSettings } from "@/types";
import { ProjectHero, ProjectGrid } from "@/components/modules/karya";

const FILTERS = ["Semua", "Web App", "Mobile App", "AI & ML", "IoT & Embedded"];

/**
 * Halaman utama Showcase Karya & Inovasi Mahasiswa HMPSTI SWU.
 * Mengorkestrasi data proyek, pengaturan periode kepengurusan, dan filter kategori teknologi.
 */
export default function KaryaPage() {
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [projects, setProjects] = useState<StudentProject[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("hmpsti_cached_projects");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [...(fallbackProjects as StudentProject[])];
  });
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings as SiteSettings);
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [data, s] = await Promise.all([fetchProjectsList(), fetchSiteSettings()]);
        const list = (data && data.length > 0 ? data : fallbackProjects) as StudentProject[];
        setProjects(list);

        if (typeof window !== "undefined" && data && data.length > 0) {
          try {
            localStorage.setItem("hmpsti_cached_projects", JSON.stringify(data));
          } catch {}
        }

        // Hydrate status like dari localStorage browser
        const initialLikes: Record<string, boolean> = {};
        list.forEach((item) => {
          if (getLocalLikeState("student_projects", item.id)) {
            initialLikes[item.id] = true;
          }
        });
        setLikedProjects(initialLikes);

        if (s) setSettings(s as SiteSettings);
      } catch (err) {
        console.warn("Gagal memuat proyek karya terbaru, fallback digunakan:", err);
      }
    }
    loadData();
  }, []);

  const handleToggleLike = useCallback(
    async (id: string, currentLikes: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const nextLiked = !likedProjects[id];
      setLikedProjects((prev) => ({ ...prev, [id]: nextLiked }));

      // Optimistic update pada daftar proyek
      setProjects((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                likes_count: Math.max(
                  0,
                  nextLiked ? (item.likes_count || 0) + 1 : (item.likes_count || 1) - 1
                ),
              }
            : item
        )
      );

      // Sinkronkan ke database Supabase & localStorage
      await toggleDatabaseLike("student_projects", id, nextLiked, currentLikes);
    },
    [likedProjects]
  );

  const filteredProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .filter((p) => {
        const pCat = (p.category || "").toUpperCase();
        const matchFilter =
          activeFilter === "Semua" ||
          pCat === activeFilter.toUpperCase() ||
          (activeFilter === "Web App" && pCat.includes("WEB")) ||
          (activeFilter === "Mobile App" && pCat.includes("MOBILE")) ||
          (activeFilter === "AI & ML" && (pCat.includes("AI") || pCat.includes("ML"))) ||
          (activeFilter === "IoT & Embedded" && (pCat.includes("IOT") || pCat.includes("EMBEDDED")));

        const q = searchQuery.toLowerCase().trim();
        const techString = Array.isArray(p.tech_stack)
          ? p.tech_stack.join(" ").toLowerCase()
          : typeof p.tech_stack === "string"
          ? (p.tech_stack as string).toLowerCase()
          : "";

        const matchSearch =
          !q ||
          (p.title || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.author_name || (p as any).author || "").toLowerCase().includes(q) ||
          techString.includes(q);

        return matchFilter && matchSearch;
      });
  }, [projects, activeFilter, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner & Search/Category Filter Pills */}
      <ProjectHero
        currentPeriod={settings.current_period}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filters={FILTERS}
      />

      {/* Grid Showcase Karya Proyek Inovasi Mahasiswa */}
      <ProjectGrid
        projects={filteredProjects}
        likedProjects={likedProjects}
        onToggleLike={handleToggleLike}
      />
    </div>
  );
}
