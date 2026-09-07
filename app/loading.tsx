import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-[55vh] flex flex-col items-center justify-center py-24 px-4 animate-in fade-in duration-150">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/5 bg-[#121520]/60 backdrop-blur-md shadow-2xl">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#1DB954]/20 animate-ping" />
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1DB954] border-t-transparent shadow-[0_0_15px_rgba(29,185,84,0.3)]" />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-pulse" />
          <span>Memuat Halaman...</span>
        </div>
      </div>
    </div>
  );
}
