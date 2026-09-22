"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowsOut, X } from "@phosphor-icons/react";
import { fetchCabinetSlidePhotos, CabinetSlide } from "@/services";

const SLIDE_INTERVAL_MS = 4000;

export const CabinetPhotoSection: React.FC = () => {
  const [slides, setSlides] = useState<CabinetSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load slides on mount
  useEffect(() => {
    let isMounted = true;
    fetchCabinetSlidePhotos().then((data) => {
      if (isMounted && data.length > 0) setSlides(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-slide loop
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (slides.length > 1 ? (prev + 1) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    timerRef.current = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused, nextSlide]);

  // If no slides loaded yet, show nothing
  if (slides.length === 0) return null;

  const current = slides[currentIndex] || slides[0];

  return (
    <>
      {/* Full-bleed cabinet slideshow */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
        <div
          onClick={() => setIsLightboxOpen(true)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[300px] sm:h-[440px] lg:h-[560px] rounded-3xl overflow-hidden border border-white/10 bg-black cursor-pointer group shadow-2xl"
        >
          {/* Slides — cross-fade via opacity transition */}
          {slides.map((slide, idx) => (
            <img
              key={slide.slug}
              // eslint-disable-next-line @next/next/no-img-element
              src={slide.url}
              alt={slide.name || "Foto Bersama Seluruh Pengurus & Anggota HMPSTI SWU"}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
                idx === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

          {/* Caption text */}
          {current.name && (
            <div className="absolute bottom-10 sm:bottom-14 lg:bottom-16 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl pointer-events-none z-10 text-center">
              <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                {current.name}
              </h3>
            </div>
          )}

          {/* Dot indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className={`block rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-5 h-1.5 bg-[#1DB954]"
                      : "w-1.5 h-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Bottom-right expand pill — only shows on hover */}
          <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 pointer-events-none z-20">
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
            className="relative max-w-6xl w-full max-h-[90vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.name || "Foto Bersama Seluruh Anggota HMPSTI SWU Full"}
              className="w-full h-full max-h-[82vh] object-contain mx-auto"
            />
            {current.name && (
              <div className="w-full bg-black/80 border-t border-white/10 p-3 sm:p-4 text-center">
                <p className="text-xs sm:text-sm font-semibold text-white font-mono">
                  {current.name}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
