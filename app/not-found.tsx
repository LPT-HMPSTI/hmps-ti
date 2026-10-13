import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, House } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="relative max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-white/10 bg-[#121520]/80 backdrop-blur-xl shadow-2xl">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-[#1DB954]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Logo HMPSTI */}
        <div className="relative flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-hmpsti.webp"
            alt="Logo Resmi HMPSTI STMIK Widya Utama"
            className="h-28 w-28 object-contain drop-shadow-[0_0_25px_rgba(29,185,84,0.3)] transition-transform hover:scale-105"
          />
        </div>

        {/* Keterangan Error 404 */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30">
            ERROR 404 // NOT FOUND
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            Halaman yang kamu tuju tidak tersedia atau alamat URL yang dimasukkan salah.
          </p>
        </div>

        {/* Tombol Kembali ke Beranda */}
        <div className="pt-2 flex justify-center">
          <Link href="/">
            <Button
              variant="spotify"
              size="md"
              icon={<House size={16} weight="bold" />}
              className="font-mono text-xs font-bold shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:scale-105 transition-all"
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
