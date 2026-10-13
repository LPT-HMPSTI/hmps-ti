"use client";

import React from "react";

interface LoadingSpinnerProps {
  /** Ukuran keseluruhan spinner dalam px (default: 120) */
  size?: number;
  /** Teks label di bawah spinner (opsional) */
  label?: string;
  /** Apakah menutup seluruh layar sebagai overlay */
  fullScreen?: boolean;
}

/**
 * LoadingSpinner — Ikon loading HMPSTI SWU.
 *
 * Menampilkan logo HMPSTI di tengah, dikelilingi oleh ring berputar
 * dengan titik yang mengorbit. Digunakan di loading.tsx dan tempat lain
 * yang membutuhkan indikator loading premium.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 120,
  label = "Memuat...",
  fullScreen = false,
}) => {
  const logoSize = size * 0.48;
  const outerRingSize = size;
  const innerRingSize = size * 0.78;

  const spinner = (
    <div
      className="flex flex-col items-center justify-center gap-5"
      aria-label="Memuat halaman"
      role="status"
    >
      {/* ── Ring + Logo Container ── */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: outerRingSize, height: outerRingSize }}
      >
        {/* Ambient glow di belakang logo */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(29,185,84,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Ring luar — berputar perlahan berlawanan arah (CCW) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1.5px solid rgba(29,185,84,0.20)",
            animation: "hmpsti-spin-ccw 8s linear infinite",
          }}
        />

        {/* Ring tengah — berputar lebih cepat (CW) dengan dash */}
        <div
          className="absolute rounded-full"
          style={{
            width: innerRingSize,
            height: innerRingSize,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px dashed rgba(29,185,84,0.25)",
            animation: "hmpsti-spin-cw 5s linear infinite",
          }}
        />

        {/* Titik orbit utama — berputar mengelilingi ring */}
        <div
          className="absolute inset-0"
          style={{ animation: "hmpsti-spin-cw 1.6s linear infinite" }}
        >
          <div
            className="absolute rounded-full bg-[#1DB954]"
            style={{
              width: size * 0.08,
              height: size * 0.08,
              top: "50%",
              left: "50%",
              marginTop: -(outerRingSize / 2),
              marginLeft: -(size * 0.08 / 2),
              boxShadow: "0 0 8px 3px rgba(29,185,84,0.8)",
            }}
          />
        </div>

        {/* Titik orbit kedua — offset 180° */}
        <div
          className="absolute inset-0"
          style={{
            animation: "hmpsti-spin-cw 1.6s linear infinite",
            animationDelay: "-0.8s",
          }}
        >
          <div
            className="absolute rounded-full bg-[#1DB954]/50"
            style={{
              width: size * 0.05,
              height: size * 0.05,
              top: "50%",
              left: "50%",
              marginTop: -(outerRingSize / 2),
              marginLeft: -(size * 0.05 / 2),
              boxShadow: "0 0 6px 2px rgba(29,185,84,0.4)",
            }}
          />
        </div>

        {/* Logo HMPSTI di tengah */}
        <div
          className="relative z-10 rounded-full flex items-center justify-center"
          style={{
            width: logoSize,
            height: logoSize,
            background: "rgba(18,21,32,0.90)",
            backdropFilter: "blur(8px)",
            boxShadow:
              "0 0 30px rgba(29,185,84,0.12), inset 0 0 20px rgba(0,0,0,0.4)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-hmpsti.webp"
            alt="Logo HMPSTI STMIK Widya Utama"
            style={{
              width: logoSize * 0.72,
              height: logoSize * 0.72,
              objectFit: "contain",
              filter: "drop-shadow(0 0 10px rgba(29,185,84,0.35))",
            }}
          />
        </div>
      </div>

      {/* Label teks */}
      {label && (
        <div className="flex items-center gap-2">
          <span
            className="block rounded-full bg-[#1DB954] animate-pulse"
            style={{ width: 6, height: 6 }}
          />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            {label}
          </span>
          <span
            className="block rounded-full bg-[#1DB954] animate-pulse"
            style={{ width: 6, height: 6, animationDelay: "0.4s" }}
          />
        </div>
      )}

      {/* Keyframes CSS */}
      <style>{`
        @keyframes hmpsti-spin-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hmpsti-spin-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0D14]/95 backdrop-blur-sm"
        aria-live="polite"
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};
