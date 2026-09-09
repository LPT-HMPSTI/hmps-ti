"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { BphMemberDetailModal, BphMember } from "@/components/ui/BphMemberDetailModal";
import {
  fetchDivisionMembers,
  fetchSiteSettings,
  fetchDivisionPhotos,
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
    themeColor: "#1DB954",
    groupPhotoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    badge: "Official Executive Council",
    photoStory: "Sebagai pilar kepemimpinan utama, Badan Pengurus Harian menyatukan Ketua Umum, Wakil Ketua Umum, Sekretaris, dan Bendahara dalam satu ikrar komitmen kepengurusan yang transparan, visioner, dan akuntabel demi memajukan seluruh mahasiswa Teknik Informatika STMIK Widya Utama.",
    coreValues: ["Integritas Kepemimpinan", "Tata Kelola Transparan", "Visi Progresif"],
    sessionLocation: "Auditorium & Studio Utama STMIK Widya Utama",
    photoQuote: "Memimpin dengan keteladanan nyata, melayani dengan dedikasi dan integritas tanpa henti.",
  },
  psdm: {
    slug: "psdm",
    name: "Pengembangan Sumber Daya Mahasiswa",
    short: "PSDM",
    tagline: "Kaderisasi, Upgrading & Menjaga Keakraban Internal Anggota",
    desc: "Fokus pada pengembangan karakter kepemimpinan mahasiswa baru, upgrading keahlian softskill, dan iklim keakraban antar angkatan.",
    themeColor: "#A855F7",
    groupPhotoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    badge: "Human Resources & Talent",
    photoStory: "Divisi PSDM merupakan wadah hangat pembinaan karakter dan kaderisasi insan mahasiswa TI. Menjaga soliditas internal, mendampingi mahasiswa baru beradaptasi di kampus, serta membangun atmosfer kekeluargaan yang inklusif dan suportif.",
    coreValues: ["Kekeluargaan Hangat", "Kaderisasi Berkelanjutan", "Empati & Kepemimpinan"],
    sessionLocation: "Creative Space STMIK Widya Utama",
    photoQuote: "Merawat potensi setiap insan, membangun kebersamaan yang kokoh tanpa sekat.",
  },
  lpt: {
    slug: "lpt",
    name: "Lembaga Pengembangan Teknologi (LPT)",
    short: "LPT",
    tagline: "Riset Teknologi, Pelatihan Koding & Kompetisi Software",
    desc: "Pusat riset dan pelatihan skill teknis mahasiswa (Next.js, Python, Supabase, AI, DevOps) serta pendampingan lomba coding.",
    themeColor: "#00F2FE",
    groupPhotoUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
    badge: "Research & Development Hub",
    photoStory: "Laboratorium rekayasa teknologi dan inovasi digital HMPSTI. Tim ini mendedikasikan waktu untuk riset teknologi mutakhir, pelatihan programming intensif, dan pendampingan delegasi mahasiswa dalam kompetisi hackathon dan software development.",
    coreValues: ["Inovasi Rekayasa", "Ketangkasan Koding", "Eksplorasi Teknologi"],
    sessionLocation: "Lab Riset Rekayasa Perangkat Lunak STMIK Widya Utama",
    photoQuote: "Dari baris-baris kode, kami merangkai solusi nyata bagi peradaban teknologi masa depan.",
  },
  kwu: {
    slug: "kwu",
    name: "Kewirausahaan & Bisnis Mandiri (KWU)",
    short: "KWU",
    tagline: "Penggalangan Dana, Merchandise Resmi & Kemandirian Finansial",
    desc: "Pengelolaan usaha mandiri himpunan, penjualan merchandise eksklusif (Jaket Himpunan, Kaos), serta kemitraan sponsorship.",
    themeColor: "#F59E0B",
    groupPhotoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop",
    badge: "Entrepreneurship & Business",
    photoStory: "Inkubator bisnis mandiri dan kemandirian ekonomi himpunan. Berfokus pada inovasi produk kreatif merchandise resmi himpunan, pembinaan jiwa technopreneurship mahasiswa TI, serta eksplorasi kemitraan sponsorship strategis.",
    coreValues: ["Kemandirian Finansial", "Kreativitas Produk", "Naluri Technopreneur"],
    sessionLocation: "Creative Business Lounge STMIK Widya Utama",
    photoQuote: "Kemandirian organisasi terwujud saat kreativitas bisnis bersinergi dengan ketulusan karya.",
  },
  medkominfo: {
    slug: "medkominfo",
    name: "Media Komunikasi & Informasi",
    short: "MEDKOMINFO",
    tagline: "Branding Visual, Pengelolaan Sosmed & Publikasi Digital",
    desc: "Menangani identitas visual branding HMPSTI SWU, pembuatan konten feeds Instagram, video dokumentasi, serta pengelolaan website.",
    themeColor: "#FF007F",
    groupPhotoUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop",
    badge: "Creative Media & Broadcasting",
    photoStory: "Jantung visual branding dan corong publikasi resmi HMPSTI STMIK Widya Utama. Mengabadikan setiap momen berharga organisasi melalui lensa fotografi, desain visual estetik, produksi konten sinematik, dan pengembangan portal web himpunan.",
    coreValues: ["Estetika Visual", "Storytelling Berdampak", "Presisi Desain"],
    sessionLocation: "Digital Media Studio STMIK Widya Utama",
    photoQuote: "Membingkai setiap perjuangan dan karya himpunan menjadi jejak visual yang menginspirasi.",
  },
  humas: {
    slug: "humas",
    name: "Hubungan Masyarakat & Kemitraan",
    short: "HUMAS",
    tagline: "Kemitraan Eksternal, Studi Banding & Pengabdian Masyarakat",
    desc: "Menghubungkan HMPSTI SWU dengan birokrasi kampus, himpunan universitas lain, serta kegiatan sosial pengabdian masyarakat.",
    themeColor: "#3B82F6",
    groupPhotoUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
    badge: "Public Relations & Diplomacy",
    photoStory: "Jembatan diplomasi dan silaturahmi terbuka HMPSTI ke dunia luar. Mengokohkan jejaring kemitraan antar ormawa universitas di seluruh Indonesia, menjembatani aspirasi mahasiswa dengan kampus, serta mengabdi kepada masyarakat luas lewat teknologi.",
    coreValues: ["Diplomasi Terbuka", "Jejaring Kolaboratif", "Pengabdian Sosial"],
    sessionLocation: "Plaza Kampus STMIK Widya Utama",
    photoQuote: "Menghubungkan hati dan gagasan, membuka gerbang kolaborasi tanpa batas.",
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
  const [customGroupPhoto, setCustomGroupPhoto] = useState<string>("");

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
        const [allMembers, allProkers, siteSettings, divisionPhotos] = await Promise.all([
          fetchDivisionMembers(),
          fetchWorkPrograms(slug),
          fetchSiteSettings(),
          fetchDivisionPhotos(),
        ]);

        if (isMounted) {
          if (siteSettings) setSettings(siteSettings as SiteSettings);
          if (divisionPhotos && divisionPhotos[slug]) {
            setCustomGroupPhoto(divisionPhotos[slug]);
          }

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

  // Identifikasi pimpinan divisi
  const leader1 = useMemo(() => {
    const ketuaMatch = divisionMembers.find((m) => {
      const r = (m.role || "").toLowerCase();
      return (
        (r.includes("ketua") || r.includes("koordinator") || r.includes("kadiv")) &&
        !r.includes("wakil")
      );
    });
    return ketuaMatch || divisionMembers[0] || (fallbackDivisionMembers[0] as DivisionMember);
  }, [divisionMembers]);

  const leader2 = useMemo(() => {
    const wakilMatch =
      divisionMembers.find((m) => {
        const r = (m.role || "").toLowerCase();
        return r.includes("wakil") && !r.includes("ahli");
      }) ||
      divisionMembers.find((m) => {
        const r = (m.role || "").toLowerCase();
        return r.includes("sekretaris");
      });
    return wakilMatch || divisionMembers[1] || (fallbackDivisionMembers[1] as DivisionMember);
  }, [divisionMembers]);

  // Untuk BPH: gunakan indeks switch (Ketua / Wakil); Untuk non-BPH: selalu leader1 (Koordinator)
  const activeLeader = isBph ? (activeLeaderIndex === 0 ? leader1 : leader2) : leader1;

  // Hydrate visitor like state when active leader changes
  useEffect(() => {
    if (activeLeader) {
      setIsLikedHero(getLocalLikeState("division_members", activeLeader.id));
    }
  }, [activeLeaderIndex, activeLeader?.id]);

  // Auto-switch leader every 25 seconds when playing (hanya untuk BPH dual leadership)
  useEffect(() => {
    if (!isPlayingHero || !isBph) return;
    const interval = setInterval(() => {
      setActiveLeaderIndex((prev) => (prev === 0 ? 1 : 0));
    }, 25000);
    return () => clearInterval(interval);
  }, [isPlayingHero, isBph]);

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

  const resolvedMeta = useMemo(
    () => ({
      ...currentMeta,
      groupPhotoUrl: customGroupPhoto || currentMeta.groupPhotoUrl,
    }),
    [currentMeta, customGroupPhoto]
  );

  if (isLoading) {
    return <DivisionLoading />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12 min-h-screen bg-[#0B0D14] text-white relative">
      {/* QUICK JUMP NAVIGATION BAR (IDENTIK DENGAN /STRUKTUR) */}
      <DivisionQuickNav
        currentSlug={slug}
        onScrollTo={scrollToSection}
      />

      {/* 1. HERO SECTION: DUAL LEADERSHIP SPOTLIGHT (IDENTIK DENGAN /STRUKTUR) */}
      <DivisionHero
        division={resolvedMeta}
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
