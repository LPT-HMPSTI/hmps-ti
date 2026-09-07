import React from "react";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function StrukturLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Header Skeleton */}
      <div className="rounded-3xl border-2 border-black bg-[#0c0e14] p-6 sm:p-10 shadow-[4px_4px_0px_0px_#000000] space-y-4">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-10 sm:h-14 w-2/3 max-w-xl rounded-2xl" />
        <Skeleton className="h-5 w-full max-w-lg rounded-lg" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Leadership 2-Col Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-72 rounded-2xl border-2 border-black bg-[#0e1322] p-6 space-y-4 shadow-[4px_4px_0px_0px_#000000]">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-1/3 mx-auto rounded-md" />
        </div>
        <div className="h-72 rounded-2xl border-2 border-black bg-[#0e1322] p-6 space-y-4 shadow-[4px_4px_0px_0px_#000000]">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-1/3 mx-auto rounded-md" />
        </div>
      </div>

      {/* Division Cards Carousel Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
