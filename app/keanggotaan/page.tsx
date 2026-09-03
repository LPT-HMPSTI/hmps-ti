"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchMembersList,
  fetchDivisionMembers,
  fetchSiteSettings,
  getLocalLikeState,
  setLocalLikeState,
  toggleDatabaseLike,
} from "@/services";
import { fallbackSiteSettings } from "@/constants";
import { SiteSettings } from "@/types";
import {
  MemberHero,
  MemberTable,
  MemberPagination,
  normalizeMemberStatus,
  getMemberSortPriority,
} from "@/components/modules/keanggotaan";

const ITEMS_PER_PAGE = 10;
const COHORTS = ["Semua", "2022", "2023", "2024", "2025"];

/**
 * Halaman Direktori Anggota HMPSTI SWU bertema Spotify Playlist & Tracklist neubrutalism.
 * Mengorkestrasi data anggota, pengurus aktif, alumni, dan dosen penanggung jawab.
 */
export default function KeanggotaanPage() {
  const [selectedCohort, setSelectedCohort] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState<
    "Semua" | "Pengurus Aktif" | "Alumni" | "Dosen Penanggung Jawab"
  >("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCombinedMembers, setAllCombinedMembers] = useState<any[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings as SiteSettings);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  // Like system with popup reaction badges
  const [isLikedPlaylist, setIsLikedPlaylist] = useState(false);
  const [playlistReactionBadge, setPlaylistReactionBadge] = useState<string | null>(null);
  const [likedMembers, setLikedMembers] = useState<Record<string, boolean>>({});
  const [memberReactionBadges, setMemberReactionBadges] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [s, mList, dList] = await Promise.all([
          fetchSiteSettings(),
          fetchMembersList(),
          fetchDivisionMembers(),
        ]);

        if (s) setSettings(s as SiteSettings);

        // Petakan pengurus divisi aktif menjadi entitas anggota
        const mappedActivePengurus = (dList || []).map((p: any) => ({
          id: `div-${p.id || p.nim}`,
          name: p.name,
          nim: p.nim,
          cohort: p.period === (s?.current_period || "2026") ? "2022" : "2023",
          status: "PENGURUS AKTIF",
          role: p.role || "Pengurus Himpunan",
          division: p.division_slug ? p.division_slug.toUpperCase() : "HMPSTI",
          avatar: p.avatar || p.image_url || null,
          instagram_url: p.instagram_url || "",
          github_url: p.github_url || "",
          linkedin_url: p.linkedin_url || "",
          email: p.email || "",
          social_links: p.social_links || [],
        }));

        const existingNims = new Set(mappedActivePengurus.map((p: any) => p.nim));
        const filteredMembersOnly = (mList || [])
          .filter((m: any) => !existingNims.has(m.nim))
          .map((m: any) => ({
            ...m,
            avatar: m.avatar || m.avatar_url || m.image_url || null,
            division: m.division || "TEKNIK INFORMATIKA",
            status: m.status || (m.cohort === "2022" ? "ALUMNI" : "PENGURUS AKTIF"),
          }));

        const combined = [...mappedActivePengurus, ...filteredMembersOnly];

        // Sort by defined hierarchy (BPH -> Divisi -> Alumni -> Dosen)
        combined.sort((a, b) => {
          const pa = getMemberSortPriority(a);
          const pb = getMemberSortPriority(b);
          if (pa.categoryRank !== pb.categoryRank) return pa.categoryRank - pb.categoryRank;
          if (pa.divisionRank !== pb.divisionRank) return pa.divisionRank - pb.divisionRank;
          if (pa.roleRank !== pb.roleRank) return pa.roleRank - pb.roleRank;
          return pa.name.localeCompare(pb.name);
        });

        setAllCombinedMembers(combined);

        // Hydrate visitor like states from localStorage
        setIsLikedPlaylist(getLocalLikeState("site_settings", "playlist"));
        const initialMemberLikes: Record<string, boolean> = {};
        combined.forEach((m: any) => {
          const table = m.id?.startsWith("div-") ? "division_members" : "members";
          const rawId = m.id?.replace("div-", "") || m.id;
          if (
            getLocalLikeState(table, rawId) ||
            getLocalLikeState("members", m.nim) ||
            getLocalLikeState("members", m.id)
          ) {
            initialMemberLikes[m.id] = true;
          }
        });
        setLikedMembers(initialMemberLikes);
      } catch (err) {
        console.warn("Gagal memuat data keanggotaan terbaru:", err);
      }
    }
    loadData();
  }, []);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allCombinedMembers.filter((m) => {
      // Cohort filter
      const matchCohort = selectedCohort === "Semua" || m.cohort === selectedCohort;

      // Category filter (Pengurus Aktif / Alumni / Dosen Penanggung Jawab)
      let matchCategory = true;
      const normalized = normalizeMemberStatus(m.status, m.role);
      if (selectedCategory === "Pengurus Aktif") {
        matchCategory = normalized.label === "PENGURUS AKTIF";
      } else if (selectedCategory === "Alumni") {
        matchCategory = normalized.label === "ALUMNI";
      } else if (selectedCategory === "Dosen Penanggung Jawab") {
        matchCategory = normalized.label === "DOSEN PENANGGUNG JAWAB";
      }

      // Search filter
      const matchSearch =
        !q ||
        (m.name || "").toLowerCase().includes(q) ||
        (m.nim || "").toLowerCase().includes(q) ||
        (m.role || "").toLowerCase().includes(q) ||
        (m.division || "").toLowerCase().includes(q) ||
        (m.cohort || "").toLowerCase().includes(q);

      return matchCohort && matchCategory && matchSearch;
    });
  }, [allCombinedMembers, selectedCohort, selectedCategory, searchQuery]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCohort, selectedCategory]);

  // Pagination calculation (Max 10 per page)
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length);
  const currentPaginatedMembers = useMemo(() => {
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, startIndex, endIndex]);

  const handleTogglePlay = useCallback((id: string) => {
    setActivePlayingId((prev) => (prev === id ? null : id));
  }, []);

  const handleTogglePlayFirst = useCallback(() => {
    if (currentPaginatedMembers.length > 0) {
      const firstId = currentPaginatedMembers[0].id;
      setActivePlayingId((prev) => (prev === firstId ? null : firstId));
    }
  }, [currentPaginatedMembers]);

  // Toggle Playlist Like
  const handleTogglePlaylistLike = useCallback(() => {
    const nextState = !isLikedPlaylist;
    setIsLikedPlaylist(nextState);
    setLocalLikeState("site_settings", "playlist", nextState);
    const badgeText = nextState ? ":) Liked!" : ":( Unliked";
    setPlaylistReactionBadge(badgeText);
    setTimeout(() => {
      setPlaylistReactionBadge(null);
    }, 2000);
  }, [isLikedPlaylist]);

  // Toggle Member Track Like
  const handleToggleMemberLike = useCallback(
    async (id: string, currentLikes: number, e: React.MouseEvent) => {
      e.stopPropagation();
      const nextLiked = !likedMembers[id];
      setLikedMembers((prev) => ({ ...prev, [id]: nextLiked }));

      const badgeText = nextLiked ? ":) Liked!" : ":( Unliked";
      setMemberReactionBadges((r) => ({ ...r, [id]: badgeText }));
      setTimeout(() => {
        setMemberReactionBadges((r) => {
          const copy = { ...r };
          delete copy[id];
          return copy;
        });
      }, 2000);

      // Optimistically update list state
      setAllCombinedMembers((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                likes_count: Math.max(
                  0,
                  nextLiked ? (m.likes_count || 0) + 1 : (m.likes_count || 1) - 1
                ),
              }
            : m
        )
      );

      const table = id.startsWith("div-") ? "division_members" : "members";
      const rawId = id.replace("div-", "");
      await toggleDatabaseLike(table, rawId, nextLiked, currentLikes);
    },
    [likedMembers]
  );

  const totalLikes = useMemo(() => {
    return (
      allCombinedMembers.reduce((sum, m) => sum + (m.likes_count || 0), 0) +
      (isLikedPlaylist ? 1 : 0)
    );
  }, [allCombinedMembers, isLikedPlaylist]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* SPOTIFY PLAYLIST HEADER / HERO SHOWCASE */}
      <MemberHero
        settings={settings}
        filteredCount={filteredMembers.length}
        totalLikes={totalLikes}
        isLikedPlaylist={isLikedPlaylist}
        onTogglePlaylistLike={handleTogglePlaylistLike}
        playlistReactionBadge={playlistReactionBadge}
        activePlayingId={activePlayingId}
        onTogglePlayFirst={handleTogglePlayFirst}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedCohort={selectedCohort}
        onSelectCohort={setSelectedCohort}
        cohorts={COHORTS}
      />

      {/* SPOTIFY MEMBER DIRECTORY TABLE */}
      <MemberTable
        members={currentPaginatedMembers}
        startIndex={startIndex}
        activePlayingId={activePlayingId}
        onTogglePlay={handleTogglePlay}
        likedMembers={likedMembers}
        memberReactionBadges={memberReactionBadges}
        onToggleLike={handleToggleMemberLike}
      />

      {/* SPOTIFY STYLE PAGINATION CONTROLS */}
      <MemberPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalFiltered={filteredMembers.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
