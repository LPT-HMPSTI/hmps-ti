import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0D14]/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/10 bg-[#121520] shadow-2xl">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1DB954] border-t-transparent" />
        <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-white uppercase tracking-wider">
          <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-ping" />
          <span>Memuat Halaman HMPSTI SWU...</span>
        </div>
      </div>
    </div>
  );
}
