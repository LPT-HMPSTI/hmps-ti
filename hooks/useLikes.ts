"use client";

import { useState, useEffect, useCallback } from "react";
import { getLocalLikeState, toggleDatabaseLike } from "@/services";

export type LikeTargetTable =
  | "news"
  | "student_projects"
  | "members"
  | "division_members";

export interface UseLikesOptions {
  table: LikeTargetTable;
  id: string;
  initialCount?: number;
  onLikeChanged?: (newCount: number, isLiked: boolean) => void;
}

export interface UseLikesReturn {
  isLiked: boolean;
  likesCount: number;
  isPending: boolean;
  toggleLike: () => Promise<void>;
}

/**
 * Hook untuk mengelola interaksi tombol suka (like) pada artikel, karya mahasiswa, atau profil anggota.
 * Mendukung pembaruan visual instan (optimistic UI) dan sinkronisasi atomik ke database Supabase.
 *
 * @param options Konfigurasi target tabel database, ID item, dan jumlah like awal
 */
export function useLikes({
  table,
  id,
  initialCount = 0,
  onLikeChanged,
}: UseLikesOptions): UseLikesReturn {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(initialCount);
  const [isPending, setIsPending] = useState<boolean>(false);

  // Inisialisasi status like dari localStorage browser
  useEffect(() => {
    if (id) {
      const likedInStorage = getLocalLikeState(table, id);
      setIsLiked(likedInStorage);
    }
  }, [table, id]);

  // Sinkronkan count jika properti initialCount dari server/parent berubah
  useEffect(() => {
    setLikesCount(initialCount);
  }, [initialCount]);

  const toggleLike = useCallback(async () => {
    if (!id || isPending) return;

    const nextLiked = !isLiked;
    const optimisticCount = nextLiked
      ? likesCount + 1
      : Math.max(0, likesCount - 1);

    // 1. Optimistic update visual langsung tanpa menunggu network
    setIsLiked(nextLiked);
    setLikesCount(optimisticCount);
    setIsPending(true);

    if (onLikeChanged) {
      onLikeChanged(optimisticCount, nextLiked);
    }

    try {
      // 2. Sinkronkan ke database Supabase
      const res = await toggleDatabaseLike(table, id, nextLiked, likesCount);
      if (res && typeof res.newCount === "number") {
        setLikesCount(res.newCount);
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi like ke database:", err);
      // Rollback jika terjadi kegagalan jaringan fatal
      setIsLiked(!nextLiked);
      setLikesCount(likesCount);
    } finally {
      setIsPending(false);
    }
  }, [table, id, isLiked, likesCount, isPending, onLikeChanged]);

  return {
    isLiked,
    likesCount,
    isPending,
    toggleLike,
  };
}
