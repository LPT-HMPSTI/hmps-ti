"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  submitAspirasiFeedback,
  fetchSiteSettings,
} from "@/services";
import { fallbackSiteSettings } from "@/constants";
import { SiteSettings } from "@/types";
import {
  ContactHero,
  AspirationForm,
  ContactInfoCards,
} from "@/components/modules/kontak";

/**
 * Halaman Kontak & Kotak Aspirasi Mahasiswa HMPSTI STMIK Widya Utama.
 * Mengorkestrasi pengiriman formulir aspirasi dan informasi narahubung himpunan.
 */
export default function KontakPage() {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings as SiteSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSiteSettings();
        if (data) setSettings(data as SiteSettings);
      } catch (err) {
        console.warn("Gagal memuat pengaturan situs kontak, fallback digunakan:", err);
      }
    }
    loadSettings();
  }, []);

  const handleSubmitAspiration = useCallback(
    async (payload: {
      name: string;
      email: string;
      message: string;
      isAnonymous: boolean;
    }) => {
      await submitAspirasiFeedback(payload);
    },
    []
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Editorial Header Banner */}
      <ContactHero currentPeriod={settings.current_period} />

      {/* Main Content Grid: Left Form Aspirasi, Right Kontak & Dark Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Form Aspirasi Mahasiswa (Col 7) */}
        <AspirationForm onSubmitAspiration={handleSubmitAspiration} />

        {/* Right Panel: Informasi Kontak & Dark Themed Map (Col 5) */}
        <ContactInfoCards settings={settings} />
      </div>
    </div>
  );
}
