"use client";

import React from "react";
import { FloppyDisk } from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface SettingsState {
  current_period: string;
  email: string;
  whatsapp: string;
  address: string;
  map_embed_url: string;
}

export interface SettingsTabProps {
  settings: SettingsState;
  onSettingsChange: (newSettings: SettingsState) => void;
  onSaveSettings: (e: React.FormEvent) => void;
}

/**
 * Tab Pengaturan Utama: Form konfigurasi tahun periode aktif, email, WhatsApp, alamat, dan Google Maps URL.
 */
export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onSettingsChange,
  onSaveSettings,
}) => {
  return (
    <GlassCard glowColor="emerald" className="p-6 sm:p-8 space-y-6 sm:space-y-7">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
        <div>
          <h2 className="text-lg font-bold text-white">Informasi Utama & Kontak Himpunan</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ubah Tahun Periode, Email, WhatsApp, Alamat, dan Custom/Google Maps Embed URL
          </p>
        </div>
        <div className="my-1 shrink-0">
          <Badge variant="spotify" tilt="right">
            PERIODE {settings.current_period}
          </Badge>
        </div>
      </div>

      <form onSubmit={onSaveSettings} className="space-y-4.5 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Tahun Periode Aktif
            </label>
            <input
              type="text"
              value={settings.current_period}
              onChange={(e) =>
                onSettingsChange({ ...settings, current_period: e.target.value })
              }
              placeholder="2026"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Email Resmi HMPS-TI
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                onSettingsChange({ ...settings, email: e.target.value })
              }
              placeholder="hmps-ti@stmik-widya-utama.ac.id"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
              Nomor WhatsApp Hima
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) =>
                onSettingsChange({ ...settings, whatsapp: e.target.value })
              }
              placeholder="+62 812-3456-7890"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
            Alamat Lengkap Sekretariat
          </label>
          <textarea
            rows={2}
            value={settings.address}
            onChange={(e) =>
              onSettingsChange({ ...settings, address: e.target.value })
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5 sm:mb-2">
            Google Maps Embed URL (src)
          </label>
          <input
            type="text"
            value={settings.map_embed_url}
            onChange={(e) =>
              onSettingsChange({ ...settings, map_embed_url: e.target.value })
            }
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none font-mono"
          />
        </div>

        <div className="pt-4 mt-5 border-t border-white/10 flex justify-start">
          <Button variant="spotify" size="md" icon={<FloppyDisk size={16} weight="bold" />}>
            Simpan Pengaturan Informasi
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};
