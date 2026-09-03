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
    <div className="p-4 sm:p-6 lg:p-12 space-y-16 sm:space-y-24 max-w-5xl mx-auto min-h-screen">
      {/* 1. TOP MINIMAL PAGE HEADER */}
      <VisionHero currentPeriod={settings.current_period} />

      {/* 2. VISI UTAMA SECTION */}
      <VisionSection
        vision={visionData.vision}
        currentPeriod={settings.current_period}
      />

      {/* 3. MISI PERJUANGAN SECTION */}
      <MissionList missions={visionData.missions || []} />
    </div>
  );
}
