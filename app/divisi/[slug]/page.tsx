"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { BphMemberDetailModal, BphMember } from "@/components/ui/BphMemberDetailModal";
import {
  fetchDivisionMembers,
  fetchSiteSettings,
  getLocalLikeState,
  toggleDatabaseLike,
} from "@/services";
import { fetchWorkPrograms } from "@/services/workProgram.service";
import { fallbackDivisionMembers, fallbackSiteSettings, fallbackWorkPrograms } from "@/constants";
import { DivisionMember, SiteSettings, WorkProgram } from "@/types";
import {
  DivisionHero,
  DivisionMeta,
  DivisionLeadershipSection,
  DivisionProkerSection,
  DivisionQuickNav,
} from "@/components/modules/divisi";
import DivisionLoading from "./loading";

const divisionMetaMap: Record<string, DivisionMeta> = {
  bph: {
    slug: "bph",
    name: "Badan Pengurus Harian (BPH)",
    short: "BPH",
    tagline: "Sentral Manajemen & Pengambil Kebijakan Strategis HMPSTI SWU",
    desc: "Bertanggung jawab penuh atas tata kelola organisasi, perumusan visi dan kebijakan strategis, administrasi hukum persuratan, pengawasan anggaran finansial, serta orkestrasi sinergi seluruh divisi kepengurusan.",
  },
  psdm: {
    slug: "psdm",
    name: "Divisi PSDM",
    short: "PSDM",
    tagline: "Kaderisasi, Upgrading & Menjaga Keakraban Internal Anggota",
    desc: "Fokus pada pengembangan karakter kepemimpinan mahasiswa baru, upgrading keahlian softskill, dan iklim keakraban antar angkatan.",
  },
  lpt: {
    slug: "lpt",
    name: "Divisi LPT (Litbang)",
    short: "LPT",
    tagline: "Riset Teknologi, Pelatihan Koding & Kompetisi Software",
    desc: "Pusat riset dan pelatihan skill teknis mahasiswa (Next.js, Python, Supabase, AI, DevOps) serta pendampingan lomba coding.",
  },
  kwu: {
    slug: "kwu",
    name: "Divisi KWU (Kewirausahaan)",
    short: "KWU",
    tagline: "Penggalangan Dana, Merchandise Resmi & Kemandirian Finansial",
    desc: "Pengelolaan usaha mandiri himpunan, penjualan merchandise eksklusif (Jaket Himpunan, Kaos), serta kemitraan sponsorship.",
  },
  medkominfo: {
    slug: "medkominfo",
    name: "Divisi MEDKOMINFO",
    short: "MEDKOMINFO",
    tagline: "Branding Visual, Pengelolaan Sosmed & Publikasi Digital",
    desc: "Menangani identitas visual branding HMPSTI SWU, pembuatan konten feeds Instagram, video dokumentasi, serta pengelolaan website.",
  },
  humas: {
    slug: "humas",
    name: "Divisi HUMAS",
    short: "HUMAS",
    tagline: "Kemitraan Eksternal, Studi Banding & Pengabdian Masyarakat",
    desc: "Menghubungkan HMPSTI SWU dengan birokrasi kampus, himpunan universitas lain, serta kegiatan sosial pengabdian masyarakat.",
  },
};

/**
 * Halaman Profil Divisi Organisasi HMPSTI STMIK Widya Utama.
 * Mengadopsi arsitektur visual Spotify identik dengan halaman Struktur Organisasi (/struktur)
 * dengan penyesuaian untuk section program kerja.
 */
export default function ProfilDivisiPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "bph";
  const slug = rawSlug.toLowerCase();

  const currentMeta = divisionMetaMap[slug] || divisionMetaMap.bph;
  const isBph = slug === "bph";

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [divisionMembers, setDivisionMembers] = useState<DivisionMember[]>([]);
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings as SiteSettings);

  // Dual Leadership Carousel state (0 = Leader 1, 1 = Leader 2)
  const [activeLeaderIndex, setActiveLeaderIndex] = useState<number>(0);
  const [isPlayingHero, setIsPlayingHero] = useState<boolean>(true);
  const [isLikedHero, setIsLikedHero] = useState<boolean>(false);

  // Selected Member for Spotify Floating Modal
  const [selectedMember, setSelectedMember] = useState<BphMember | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDivisionData() {
      setIsLoading(true);
      try {
        const [allMembers, allProkers, siteSettings] = await Promise.all([
          fetchDivisionMembers(),
          fetchWorkPrograms(slug),
          fetchSiteSettings(),
        ]);

        if (isMounted) {
          if (siteSettings) setSettings(siteSettings as SiteSettings);

          // 1. Filter anggota divisi
          const filtered = (allMembers || []).filter((m) => {
            const mSlug = (m.division_slug || "").toLowerCase().trim();
            if (isBph) {
              return mSlug === "bph" || mSlug === "bph-core" || mSlug === "bph-staff";
            }
            return mSlug === slug;
          });

          if (filtered.length > 0) {
            setDivisionMembers(filtered);
          } else {
            const fallbackFiltered = (fallbackDivisionMembers as DivisionMember[]).filter(
              (m) => {
                const mSlug = (m.division_slug || "").toLowerCase().trim();
                if (isBph) return mSlug === "bph" || mSlug === "bph-core";
                return mSlug === slug;
              }
            );
            setDivisionMembers(fallbackFiltered);
          }

          // 2. Program kerja divisi
          if (allProkers && allProkers.length > 0) {
            setWorkPrograms(allProkers);
          } else {
            const fallbackFilteredProker = (fallbackWorkPrograms as WorkProgram[]).filter(
              (wp) => (wp.division_slug || "").toLowerCase() === slug
            );
            setWorkPrograms(fallbackFilteredProker);
          }
        }
      } catch (err) {
        console.warn("Gagal memuat data divisi, fallback digunakan:", err);
        if (isMounted) {
          const fallbackMembersForSlug = (fallbackDivisionMembers as DivisionMember[]).filter(
            (m) => {
              const mSlug = (m.division_slug || "").toLowerCase();
              if (isBph) return mSlug === "bph" || mSlug === "bph-core";
              return mSlug === slug;
            }
          );
          const fallbackProkerForSlug = (fallbackWorkPrograms as WorkProgram[]).filter(
            (wp) => (wp.division_slug || "").toLowerCase() === slug
          );
          setDivisionMembers(fallbackMembersForSlug);
          setWorkPrograms(fallbackProkerForSlug);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDivisionData();

    return () => {
      isMounted = false;
    };
  }, [slug, isBph]);

  // Identifikasi 2 pimpinan utama divisi
  const leader1 = useMemo(() => {
    const ketuaMatch = divisionMembers.find((m) => {
      const r = (m.role || "").toLowerCase();
      return (r.includes("ketua") || r.includes("koordinator")) && !r.includes("wakil");
    });
    return ketuaMatch || divisionMembers[0] || (fallbackDivisionMembers[0] as DivisionMember);
  }, [divisionMembers]);

  const leader2 = useMemo(() => {
    const wakilMatch = divisionMembers.find((m) => {
      const r = (m.role || "").toLowerCase();
      return r.includes("wakil") || r.includes("sekretaris");
    });
    return wakilMatch || divisionMembers[1] || (fallbackDivisionMembers[1] as DivisionMember);
  }, [divisionMembers]);

  const activeLeader = activeLeaderIndex === 0 ? leader1 : leader2;

  // Hydrate visitor like state when active leader changes
  useEffect(() => {
    if (activeLeader) {
      setIsLikedHero(getLocalLikeState("division_members", activeLeader.id));
    }
  }, [activeLeaderIndex, activeLeader?.id]);

  // Auto-switch leader every 25 seconds when playing (identik dengan /struktur)
  useEffect(() => {
    if (!isPlayingHero) return;
    const interval = setInterval(() => {
      setActiveLeaderIndex((prev) => (prev === 0 ? 1 : 0));
    }, 25000);
    return () => clearInterval(interval);
  }, [isPlayingHero]);

  const handleToggleLikeHero = useCallback(async () => {
    if (!activeLeader) return;
    const nextState = !isLikedHero;
    setIsLikedHero(nextState);

    const baseLikes = (activeLeader as any)?.likes_count ?? 0;
    const optimisticCount = Math.max(0, nextState ? baseLikes + 1 : baseLikes - 1);

    setDivisionMembers((prev) =>
      prev.map((m) =>
        m.id === activeLeader.id ? { ...m, likes_count: optimisticCount } : m
      )
    );
    await toggleDatabaseLike("division_members", activeLeader.id, nextState, baseLikes);
  }, [activeLeader, isLikedHero]);

  // Scroll to section with offset (identik dengan /struktur)
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 145;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  }, []);

  const handleSelectMember = useCallback((m: DivisionMember) => {
    setSelectedMember(m as unknown as BphMember);
  }, []);

  // Completion rate
  const completionRate = useMemo(() => {
    if (workPrograms.length === 0) return 75;
    const completedCount = workPrograms.filter(
      (wp) => (wp.status || "").toUpperCase() === "SELESAI"
    ).length;
    return Math.round((completedCount / workPrograms.length) * 100);
  }, [workPrograms]);

  if (isLoading) {
    return <DivisionLoading />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-12 space-y-12 max-w-7xl mx-auto min-h-screen bg-[#0B0D14] text-white relative">
      {/* QUICK JUMP NAVIGATION BAR (IDENTIK DENGAN /STRUKTUR) */}
      <DivisionQuickNav
        currentSlug={slug}
        onScrollTo={scrollToSection}
      />

      {/* 1. HERO SECTION: DUAL LEADERSHIP SPOTLIGHT (IDENTIK DENGAN /STRUKTUR) */}
      <DivisionHero
        division={currentMeta}
        members={divisionMembers}
        currentPeriod={settings.current_period || "2026/2027"}
        isLikedHero={isLikedHero}
        onToggleLikeHero={handleToggleLikeHero}
        activeLeader={activeLeader}
        activeLeaderIndex={activeLeaderIndex}
        setActiveLeaderIndex={setActiveLeaderIndex}
        isPlayingHero={isPlayingHero}
        setIsPlayingHero={setIsPlayingHero}
        officersCount={divisionMembers.length}
        prokerCount={workPrograms.length}
        completionRate={completionRate}
        onScrollToSection={scrollToSection}
      />

      {/* 2. SUSUNAN PENGURUS & ANGGOTA (IDENTIK DENGAN ORGBPHSECTION /STRUKTUR) */}
      <DivisionLeadershipSection
        members={divisionMembers}
        divisionSlug={slug}
        divisionName={currentMeta.name}
        onSelectMember={handleSelectMember}
      />

      {/* 3. PROGRAM KERJA DIVISI (SPOTIFY TRACKLIST DENGAN PENYESUAIAN PROGRAM KERJA) */}
      <DivisionProkerSection
        workPrograms={workPrograms}
        divisionSlug={slug}
        divisionName={currentMeta.name}
      />

      {/* FLOATING SPOTIFY MINI-PLAYER MODAL (IDENTIK DENGAN /STRUKTUR) */}
      <BphMemberDetailModal
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  );
}
