"use client";

import React, { useState, useEffect } from "react";
import { ArrowsOut, X } from "@phosphor-icons/react";
import { fetchDivisionPhotos, fallbackDivisionPhotos } from "@/services";

const DEFAULT_CABINET_PHOTO =
  fallbackDivisionPhotos.all_members?.url ||
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop";

export const CabinetPhotoSection: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string>(DEFAULT_CABINET_PHOTO);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    fetchDivisionPhotos().then((photos) => {
      if (isMounted && photos && photos.all_members) {
        setPhotoUrl(photos.all_members);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Full-bleed cabinet photo — no padding wrapper, flush edge-to-edge */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-[300px] sm:h-[440px] lg:h-[560px] rounded-3xl overflow-hidden border border-white/10 bg-black cursor-pointer group shadow-2xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="Foto Bersama Seluruh Pengurus & Anggota HMPSTI SWU"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />

          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Hover expand prompt — center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-5 py-2.5 text-xs font-bold text-black shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
              <ArrowsOut size={16} weight="bold" />
              Lihat Foto Ukuran Penuh
            </span>
          </div>

          {/* Bottom-right expand icon pill */}
          <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowsOut size={12} weight="bold" className="text-[#1DB954]" />
              Perbesar
            </span>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer shadow-xl"
            aria-label="Tutup foto"
          >
            <X size={22} weight="bold" />
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[90vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Foto Bersama Seluruh Anggota HMPSTI SWU Full"
              className="w-full h-full max-h-[90vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};
