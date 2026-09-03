"use client";

import React from "react";
import {
  Gear,
  EnvelopeOpen,
  NewspaperClipping,
  TreeStructure,
  Users,
  Target,
  CodeBlock,
  Image as ImageIcon,
} from "@phosphor-icons/react";

export type AdminTabType =
  | "settings"
  | "aspirasi"
  | "berita"
  | "struktur"
  | "keanggotaan"
  | "visi-misi"
  | "karya"
  | "galeri";

export interface AdminTabNavProps {
  activeTab: AdminTabType;
  onSelectTab: (tab: AdminTabType) => void;
  unreadAspirasiCount: number;
}

/**
 * Bilah navigasi tab backoffice admin dengan gaya neubrutalis Spotify.
 */
export const AdminTabNav: React.FC<AdminTabNavProps> = ({
  activeTab,
  onSelectTab,
  unreadAspirasiCount,
}) => {
  const tabs = [
    { id: "settings" as AdminTabType, label: "Pengaturan Utama", icon: Gear },
    {
      id: "aspirasi" as AdminTabType,
      label: `Inbox Aspirasi (${unreadAspirasiCount})`,
      icon: EnvelopeOpen,
    },
    { id: "berita" as AdminTabType, label: "Berita & Event", icon: NewspaperClipping },
    { id: "struktur" as AdminTabType, label: "Struktur Divisi", icon: TreeStructure },
    { id: "keanggotaan" as AdminTabType, label: "Keanggotaan & Alumni", icon: Users },
    { id: "visi-misi" as AdminTabType, label: "Visi & Misi", icon: Target },
    { id: "karya" as AdminTabType, label: "Showcase Karya", icon: CodeBlock },
    { id: "galeri" as AdminTabType, label: "Galeri Kegiatan", icon: ImageIcon },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-[#1DB954] text-black shadow-lg"
                : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]"
            }`}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
