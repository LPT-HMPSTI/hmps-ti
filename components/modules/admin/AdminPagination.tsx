"use client";

import React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  itemName?: string;
  className?: string;
}

/**
 * Komponen Pagination Neubrutalism untuk Console Admin.
 * Menampilkan kontrol navigasi halaman (Sebelumnya / Selanjutnya / Nomor Halaman),
 * serta ringkasan rentang data yang sedang ditampilkan.
 */
export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 6,
  onPageChange,
  itemName = "data",
  className = "",
}) => {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Perhitungan daftar nomor halaman yang tampil
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 mt-6 select-none ${className}`}
    >
      <div className="text-xs font-mono text-slate-400">
        Menampilkan{" "}
        <span className="text-white font-bold">
          {startItem}-{endItem}
        </span>{" "}
        dari <span className="text-[#1DB954] font-bold">{totalItems}</span> {itemName}{" "}
        <span className="text-slate-500">
          (Halaman <strong className="text-white">{currentPage}</strong> / {totalPages})
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Tombol Sebelumnya */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman Sebelumnya"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-black bg-[#121520] text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#121520] disabled:hover:text-slate-300 transition-all shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
        >
          <CaretLeft size={14} weight="bold" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Tombol Nomor Halaman */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs font-mono text-slate-500 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-label={`Halaman ${pageNum}`}
                className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-lg border-2 border-black text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1DB954] text-black shadow-[2px_2px_0px_0px_#000000] -rotate-1"
                    : "bg-[#121520] text-slate-300 hover:text-white hover:bg-white/10 shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Tombol Selanjutnya */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman Selanjutnya"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-black bg-[#121520] text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#121520] disabled:hover:text-slate-300 transition-all shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
};
