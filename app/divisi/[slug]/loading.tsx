import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Loading Skeleton Khusus Halaman Profil Divisi,
 * identik dengan struktur halaman /struktur dengan penyesuaian section program kerja.
 */
export default function DivisionLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12 min-h-screen bg-[#0B0D14] text-white relative">
      {/* Quick Nav Capsule Skeleton */}
      <div className="flex justify-center py-2">
        <Skeleton className="h-10 w-96 rounded-full" />
      </div>

      {/* 1. Hero Dual Leadership Spotlight Skeleton */}
      <div className="rounded-3xl bg-[#121212] p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Dual covers */}
          <div className="lg:col-span-5 flex justify-center sm:justify-start gap-4 sm:gap-6">
            <Skeleton className="aspect-square w-40 sm:w-48 rounded-2xl" />
            <Skeleton className="aspect-square w-36 sm:w-44 rounded-2xl mt-4 sm:mt-6" />
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-12 sm:h-14 w-3/4 rounded-2xl" />
            <Skeleton className="h-5 w-1/2 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>

        {/* Player controls */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. Featured Fellows Tracklist Skeleton (OrgBphSection style) */}
      <div className="space-y-4 bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <Skeleton className="h-6 w-56 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Program Kerja Tracklist Skeleton */}
      <div className="space-y-4 bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Skeleton className="h-6 w-64 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="space-y-1.5 flex-1 max-w-md">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3.5 w-1/2 rounded-md" />
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-2 w-28 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
