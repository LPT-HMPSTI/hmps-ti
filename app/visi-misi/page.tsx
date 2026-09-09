"use client";

import React, { useState, useEffect } from "react";
import {
  fetchVisionMissions,
  fetchSiteSettings,
} from "@/services";
import { fallbackVisionMissions, fallbackSiteSettings } from "@/constants";
import { SiteSettings } from "@/types";
import {
  VisionHero,
  VisionSection,
  MissionList,
} from "@/components/modules/visi-misi";

/**
 * Halaman Visi & Misi Kabinet HMPSTI STMIK Widya Utama.
 * Mengorkestrasi data visi utama (dengan efek typewriter) dan pilar misi organisasi.
 */
export default function VisiMisiPage() {
  const [visionData, setVisionData] = useState(fallbackVisionMissions);
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings as SiteSettings);

  useEffect(() => {
    async function loadData() {
      try {
        const [v, s] = await Promise.all([
          fetchVisionMissions(),
          fetchSiteSettings(),
        ]);
        if (v && v.vision) setVisionData(v);
        if (s && s.current_period) setSettings(s as SiteSettings);
      } catch (err) {
        console.warn("Gagal memuat data Visi & Misi terbaru, fallback digunakan:", err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 w-full max-w-[1500px] mx-auto min-h-[calc(100vh-5.5rem)] flex flex-col justify-start">
      {/* 1. TOP PAGE HEADER */}
      <VisionHero currentPeriod={settings.current_period} />

      {/* 2. DUA SECTION BERJEJER HORIZONTAL: VISI DI KIRI, MISI DI KANAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start flex-1">
        {/* KIRI: VISI UTAMA (SPOTIFY CANVAS CARD) */}
        <div className="order-1 h-full">
          <VisionSection
            vision={visionData.vision}
            currentPeriod={settings.current_period}
          />
        </div>

        {/* KANAN: 5 POIN MISI PERJUANGAN */}
        <div className="order-2 h-full">
          <MissionList missions={visionData.missions || []} />
        </div>
      </div>
    </div>
  );
}
