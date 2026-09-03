"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

/**
 * Header minimalis kartu login admin dengan badge neubrutalism.
 */
export const LoginHeader: React.FC = () => {
  return (
    <div className="space-y-3 text-center">
      <div className="flex justify-center mb-1">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 p-2 shadow-lg backdrop-blur-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-hmpsti.webp" alt="Logo Resmi HMPSTI" className="h-full w-full object-contain drop-shadow" />
        </div>
      </div>
      <div className="flex justify-center">
        <Badge variant="spotify" tilt="left">
          AKSES TERBATAS
        </Badge>
      </div>
      <h1 className="text-xl font-bold text-white tracking-tight">Login Admin HMPSTI</h1>
      <p className="text-xs text-slate-400">
        Masukkan kata sandi otorisasi untuk masuk ke backoffice.
      </p>
    </div>
  );
};
