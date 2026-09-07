"use client";

import React from "react";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

/**
 * Skeleton khusus untuk Admin Backoffice Console.
 * Menggantikan spinner sederhana saat verifikasi otentikasi / pemuatan data awal.
 */
export const AdminSkeleton: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* 1. Header Banner Skeleton */}
      <div className="rounded-3xl border-2 border-black bg-[#121520] p-6 shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* 2. Tab Navigation Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-10 w-32 rounded-xl shrink-0 border-2 border-black" />
        ))}
      </div>

      {/* 3. Form Input Container Skeleton */}
      <div className="rounded-3xl border-2 border-black bg-[#121520] p-6 sm:p-7 shadow-[4px_4px_0px_0px_#000000] space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Skeleton className="h-6 w-56 rounded-lg" />
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>

        <Skeleton className="h-28 rounded-xl" />

        <div className="pt-3 border-t border-white/10 flex justify-start">
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>

      {/* 4. Search & List Grid Skeleton */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-9 w-72 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
