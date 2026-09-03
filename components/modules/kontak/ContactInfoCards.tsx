"use client";

import React from "react";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SiteSettings } from "@/types";

export interface ContactInfoCardsProps {
  settings: SiteSettings;
}

/**
 * Komponen informasi kontak sekretariat, email, WhatsApp, serta peta lokasi Google Maps.
 */
export const ContactInfoCards: React.FC<ContactInfoCardsProps> = ({ settings }) => {
  // Format clean whatsapp link
  const cleanPhone = (settings.whatsapp || "").replace(/[^0-9]/g, "");
  const waLink = cleanPhone.startsWith("0")
    ? `https://wa.me/62${cleanPhone.slice(1)}`
    : cleanPhone.startsWith("62")
    ? `https://wa.me/${cleanPhone}`
    : `https://wa.me/${cleanPhone}`;

  return (
    <div className="lg:col-span-5 space-y-6">
      <GlassCard glowColor="cyan" className="p-6 sm:p-8 space-y-5">
        <h3 className="text-base sm:text-lg font-bold text-white border-b border-white/10 pb-3">
          Sekretariat & Kontak
        </h3>

        {/* Simple Clean Contact Info Rows */}
        <div className="space-y-3.5 text-xs">
          {/* Alamat */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-[#1DB954] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">Alamat Sekretariat</p>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                {settings.address || "STMIK Widya Utama, Purwokerto"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-cyan-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">Email Resmi</p>
              <a
                href={`mailto:${settings.email}`}
                className="text-slate-400 text-[11px] font-mono hover:text-cyan-400 transition-colors block truncate mt-0.5"
              >
                {settings.email || "hmti@stmik-widya-utama.ac.id"}
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-yellow-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">WhatsApp Official</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 text-[11px] font-mono hover:text-[#1DB954] transition-colors block mt-0.5"
              >
                {settings.whatsapp || "+62 812-3456-7890"}
              </a>
            </div>
          </div>
        </div>

        {/* Dark Mode Map */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <Badge variant="cyan" tilt="left">
              LOCATION MAP
            </Badge>
            <a
              href="https://maps.google.com/?q=STMIK+Widya+Utama+Purwokerto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <span>Buka di Google Maps</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0B0D14]">
            {settings.map_embed_url ? (
              <iframe
                src={settings.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="dark-map-embed w-full h-full"
              />
            ) : (
              <div className="h-full w-full p-4 flex flex-col justify-center items-center text-center space-y-1">
                <MapPin size={24} className="text-[#1DB954]" />
                <p className="text-xs font-bold text-white">STMIK Widya Utama Campus</p>
                <p className="text-[10px] text-slate-400 font-mono">Purwokerto, Jawa Tengah</p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
