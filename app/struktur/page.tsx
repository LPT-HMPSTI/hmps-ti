"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BphMemberDetailModal, BphMember } from "@/components/ui/BphMemberDetailModal";
import {
  fetchDivisionMembers,
  fetchSiteSettings,
  getLocalLikeState,
  toggleDatabaseLike,
} from "@/services";
import { fallbackDivisionMembers, fallbackSiteSettings } from "@/constants";
import { DivisionMember, SiteSettings } from "@/types";
import {
  OrgQuickNav,
  OrgHeroLeadership,
  OrgBphSection,
  OrgDivisionSection,
  DivisionItemConfig,
} from "@/components/modules/struktur";

// Department definitions & grouping (sesuai urutan katalog navbar: BPH -> PSDM -> LPT -> KWU -> MEDKOMINFO -> HUMAS)
const DIVISION_CONFIGS: DivisionItemConfig[] = [
  {
    slug: "psdm",
    aliases: ["psdm"],
    name: "Divisi PSDM",
    fullname: "Pengembangan Sumber Daya Mahasiswa",
    variantColor: "#00F2FE",
    desc: "Menjalankan program kaderisasi berkelanjutan, upgraded leadership, keakraban internal, dan konseling anggota.",
  },
  {
    slug: "lpt",
    aliases: ["lpt", "literasi"],
    name: "Divisi LPT",
    fullname: "Literasi & Pengembangan Teknologi",
    variantColor: "#1DB954",
    desc: "Menyelenggarakan workshop riset teknologi modern, pendampingan rekayasa perangkat lunak, dan showcase karya mahasiswa.",
  },
  {
    slug: "kwu",
    aliases: ["kwu", "kewirausahaan"],
    name: "Divisi Kewirausahaan",
    fullname: "Kewirausahaan & Kemandirian Finansial",
    variantColor: "#F97316",
    desc: "Mengembangkan produk merchandise resmi HMPSTI, program fund-raising kreatif, serta jiwa wirausaha mahasiswa TI.",
  },
  {
    slug: "medkominfo",
    aliases: ["medkominfo", "medkom"],
    name: "Divisi Medkominfo",
    fullname: "Media, Komunikasi & Informasi",
    variantColor: "#A855F7",
    desc: "Mengelola branding publik, media sosial resmi, desain visual, serta saluran informasi digital HMPSTI SWU.",
  },
  {
    slug: "humas",
    aliases: ["humas"],
    name: "Divisi Humas",
    fullname: "Hubungan Masyarakat & Eksternal",
    variantColor: "#E879F9",
    desc: "Membangun jejaring kolaborasi industri, kemitraan antar prodi, alumni, serta kegiatan pengabdian masyarakat.",
  },
];

/**
 * Halaman Struktur Organisasi Kabinet HMPSTI STMIK Widya Utama bertema Spotify Neubrutalism.
 * Mengorkestrasi data pimpinan BPH, anggota divisi, dan pemutar audio/carousel interaktif.
 */
export default function StructurePage() {
  const [divisionMembers, setDivisionMembers] = useState<DivisionMember[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("hmpsti_cached_division_members");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed as DivisionMember[];
        }
      } catch {}
    }
    return [...(fallbackDivisionMembers as DivisionMember[])];
  });
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings as SiteSettings);

  // Hero Dual Leadership Carousel state (0 = Ketua, 1 = Wakil)
  const [activeLeaderIndex, setActiveLeaderIndex] = useState<number>(0);
  const [isPlayingHero, setIsPlayingHero] = useState<boolean>(true);
  const [isLikedHero, setIsLikedHero] = useState<boolean>(false);

  // Selected BPH Member for detail modal
  const [selectedBphMember, setSelectedBphMember] = useState<BphMember | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [membersData, settingsData] = await Promise.all([
          fetchDivisionMembers(),
          fetchSiteSettings(),
        ]);
        if (membersData && membersData.length > 0) {
          setDivisionMembers(membersData as DivisionMember[]);
        }
        if (settingsData) setSettings(settingsData as SiteSettings);
      } catch (err) {
        console.warn("Gagal memuat data struktur terbaru, fallback digunakan:", err);
      }
    }
    loadData();
  }, []);

  // Filter BPH Members
  const bphMembers = useMemo(() => {
    return divisionMembers.filter((m) => {
      const slug = (m.division_slug || "").toLowerCase();
      return slug === "bph" || slug === "bph-core" || slug === "bph-staff";
    });
  }, [divisionMembers]);

  // Keyword Matching untuk Ketua dan Wakil
  const ketua = useMemo(() => {
    const ketuaMatch = divisionMembers.find((m) => {
      const r = (m.role || "").toLowerCase();
      return r.includes("ketua") && !r.includes("wakil");
    });
    return ketuaMatch || bphMembers[0] || (fallbackDivisionMembers[0] as DivisionMember);
  }, [divisionMembers, bphMembers]);

  const wakil = useMemo(() => {
    const wakilMatch = divisionMembers.find((m) => {
      const r = (m.role || "").toLowerCase();
      return r.includes("wakil");
    });
    return wakilMatch || bphMembers[1] || (fallbackDivisionMembers[1] as DivisionMember);
  }, [divisionMembers, bphMembers]);

  // Remaining BPH officers (Sekretaris, Bendahara, dll.)
  const remainingBPH = useMemo(() => {
    return bphMembers.filter((m) => m.id !== ketua?.id && m.id !== wakil?.id);
  }, [bphMembers, ketua?.id, wakil?.id]);

  const activeLeader = activeLeaderIndex === 0 ? ketua : wakil;

  // Hydrate like state when active leader changes
  useEffect(() => {
    if (activeLeader) {
      setIsLikedHero(getLocalLikeState("division_members", activeLeader.id));
    }
  }, [activeLeaderIndex, activeLeader?.id]);

  // Auto-switch leader every 25 seconds when playing
  useEffect(() => {
    if (!isPlayingHero) return;
    const interval = setInterval(() => {
      setActiveLeaderIndex((prev) => (prev === 0 ? 1 : 0));
    }, 25000);
    return () => clearInterval(interval);
  }, [isPlayingHero]);

  const handleToggleLike = useCallback(async () => {
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

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 145; // Offset gabungan sticky Navbar (64px) + sticky QuickNav (~60px) + margin
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  }, []);

  const handleSelectBph = useCallback((m: DivisionMember) => {
    setSelectedBphMember(m as unknown as BphMember);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12 min-h-screen bg-[#0B0D14] text-white relative">
      {/* QUICK JUMP NAVIGATION BAR */}
      <OrgQuickNav
        divisionConfigs={DIVISION_CONFIGS}
        onScrollTo={scrollToSection}
      />

      {/* 1. HERO SECTION: DUAL LEADERSHIP CAROUSEL */}
      <OrgHeroLeadership
        ketua={ketua}
        wakil={wakil}
        currentPeriod={settings.current_period}
        isLikedHero={isLikedHero}
        onToggleLikeHero={handleToggleLike}
        activeLeader={activeLeader}
        activeLeaderIndex={activeLeaderIndex}
        setActiveLeaderIndex={setActiveLeaderIndex}
        isPlayingHero={isPlayingHero}
        setIsPlayingHero={setIsPlayingHero}
      />

      {/* 2. CORE BPH FEATURED FELLOWS */}
      <OrgBphSection
        remainingBPH={remainingBPH}
        onSelectMember={handleSelectBph}
      />

      {/* 3. DIVISION ALBUMS WITH MEMBER TRACK CAROUSELS */}
      <OrgDivisionSection
        divisionConfigs={DIVISION_CONFIGS}
        divisionMembers={divisionMembers}
      />

      {/* FEATURED BPH MEMBER SPOTIFY MINIMIZED FLOATING PLAYER MODAL */}
      <BphMemberDetailModal
        isOpen={Boolean(selectedBphMember)}
        onClose={() => setSelectedBphMember(null)}
        member={selectedBphMember}
      />
    </div>
  );
}
