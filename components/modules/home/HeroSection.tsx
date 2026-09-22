"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Code } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { fetchSiteSettings } from "@/services";
import { fallbackSiteSettings } from "@/constants";

export const HeroSection: React.FC = () => {
  const [settings, setSettings] = useState(fallbackSiteSettings);

  useEffect(() => {
    async function load() {
      const s = await fetchSiteSettings();
      if (s) setSettings(s);
    }
    load();
  }, []);

  return (
    <section className="relative overflow-hidden p-4 sm:p-6 lg:p-8" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      {/* Soft Frosted Glass Header Banner */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#1DB954]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-5">
        <div className="inline-block pb-1">
          <Badge variant="spotify" tilt="left">
            OFFICIAL HMPSTI SWU HUB
          </Badge>
        </div>

        {/* Typography Hierarchy */}
        <h1 className="flex flex-col space-y-1">
          <span className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
            HMPSTI SWU
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-[#1DB954] sm:text-4xl lg:text-5xl leading-tight">
            Official Hub
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Pusat informasi, etalase karya teknologi, dan wadah komunikasi mahasiswa program studi Teknik Informatika STMIK Widya Utama Purwokerto.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Badge variant="cyan" tilt="left">Smart</Badge>
          <Badge variant="yellow" tilt="right">Winner</Badge>
          <Badge variant="spotify" tilt="left">Universe</Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <Link href="/berita">
            <Button variant="spotify" size="lg" icon={<Play size={18} weight="fill" />}>
              Jelajahi Portal
            </Button>
          </Link>

          <Link href="/karya">
            <Button variant="glass" size="lg" icon={<Code size={18} weight="light" />}>
              Showcase Karya
            </Button>
          </Link>
        </div>
      </div>

    </section>
  );
};
