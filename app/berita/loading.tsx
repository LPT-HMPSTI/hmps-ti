import React from "react";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function BeritaLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header Skeleton */}
      <div className="rounded-3xl border-2 border-black bg-[#0c0e14] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#000000] space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 sm:h-14 w-2/3 max-w-xl rounded-2xl" />
        <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
      </div>

      {/* Category Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
        <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
        <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
        <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
