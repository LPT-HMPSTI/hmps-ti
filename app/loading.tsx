import React from "react";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

/**
 * Global Route Loading Skeleton untuk Next.js App Router.
 * Menggantikan animasi spinner lama dengan kerangka skeleton neubrutalis.
 */
export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#0B0D14] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12">
      {/* Spinner utama */}
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/10 bg-[#121520] shadow-2xl">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1DB954] border-t-transparent" />
        <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-white uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-ping" />
          <span>Memuat Halaman HMPSTI SWU...</span>
        </div>
      </div>

      <div className="w-full max-w-7xl space-y-8">
        {/* 1. Header / Hero Skeleton */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-black bg-[#0c0e14] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#000000] space-y-5 animate-pulse">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 sm:h-14 w-3/4 sm:w-1/2 rounded-2xl" />
            <Skeleton className="h-5 w-2/3 sm:w-1/3 rounded-lg" />
            <Skeleton className="h-12 w-full max-w-2xl rounded-xl" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>

        {/* 2. Filter / Nav Pill Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
          <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
          <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
          <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
        </div>

        {/* 3. Grid of Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
