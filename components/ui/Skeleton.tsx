"use client";

import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Komponen Skeleton Shimmer Primitif untuk HMPSTI SWU.
 * Menggunakan aksen dark-glass neubrutalis dengan animasi pulse halus.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.06] border border-white/5 ${className}`}
      {...props}
    />
  );
};

/**
 * Skeleton khusus Card Neubrutalis.
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`rounded-2xl border-2 border-black bg-[#121520] p-6 shadow-[3px_3px_0px_0px_#000000] space-y-4 animate-pulse ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
      <div className="border-t border-white/10 pt-3 flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
    </div>
  );
};

/**
 * Skeleton khusus Halaman Detail (Berita / Karya).
 */
export const SkeletonDetail: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-pulse ${className}`}>
      <Skeleton className="h-9 w-40 rounded-xl" />

      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-10 sm:h-14 w-4/5 rounded-2xl" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
      </div>

      <div className="aspect-video w-full rounded-3xl border-2 border-black bg-[#121520] shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="space-y-3 max-w-3xl pt-4">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-11/12 rounded-md" />
        <Skeleton className="h-5 w-4/5 rounded-md" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-3/4 rounded-md" />
        </div>
      </div>
    </div>
  );
};

