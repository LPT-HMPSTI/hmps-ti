"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface MemberPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalFiltered: number;
  onPageChange: (page: number) => void;
}

/**
 * Komponen navigasi penomoran halaman (*pagination*) bertema Spotify untuk direktori anggota.
 */
export const MemberPagination: React.FC<MemberPaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalFiltered,
  onPageChange,
}) => {
  if (totalFiltered === 0) return null;

  return (
    <div className="mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info Text */}
      <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
        Menampilkan <strong className="text-white">{startIndex + 1} - {endIndex}</strong> dari{" "}
        <strong className="text-[#1DB954]">{totalFiltered}</strong> Anggota
      </div>

      {/* Pagination Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            currentPage === 1
              ? "opacity-30 cursor-not-allowed bg-white/[0.02] text-slate-500 border border-white/5"
              : "cursor-pointer bg-white/[0.05] text-slate-200 border border-white/10 hover:bg-white/[0.1] hover:text-white"
          }`}
          title="Halaman Sebelumnya"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Numbered Page Buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          if (
            totalPages > 7 &&
            pageNum !== 1 &&
            pageNum !== totalPages &&
            Math.abs(pageNum - currentPage) > 1
          ) {
            if (pageNum === 2 || pageNum === totalPages - 1) {
              return (
                <span key={pageNum} className="px-1 text-xs font-mono text-slate-500">
                  ...
                </span>
              );
            }
            return null;
          }

          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`h-8 w-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                isActive
                  ? "bg-[#1DB954] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] scale-105"
                  : "bg-white/[0.03] text-slate-300 border border-white/10 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            currentPage === totalPages
              ? "opacity-30 cursor-not-allowed bg-white/[0.02] text-slate-500 border border-white/5"
              : "cursor-pointer bg-white/[0.05] text-slate-200 border border-white/10 hover:bg-white/[0.1] hover:text-white"
          }`}
          title="Halaman Selanjutnya"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
