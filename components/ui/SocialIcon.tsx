"use client";

import React from "react";
import { AtSign } from "lucide-react";
import {
  InstagramLogo,
  LinkedinLogo,
  GithubLogo,
  FacebookLogo,
  TwitterLogo,
  TiktokLogo,
  YoutubeLogo,
  Globe,
  WhatsappLogo,
  Plus,
  X,
} from "@phosphor-icons/react";

/**
 * Mendeteksi platform media sosial berdasarkan URL yang diberikan.
 * Mendukung Instagram, LinkedIn, GitHub, Facebook, Twitter/X, TikTok, YouTube, WhatsApp, dan Email.
 * Mengembalikan "website" jika tidak cocok dengan platform manapun.
 */
export function detectSocialPlatform(url: string) {
  const l = (url || "").toLowerCase().trim();
  if (!l) return "website";
  if (l.startsWith("mailto:") || l.includes("@") || l.includes("gmail") || l.includes("email")) return "email";
  if (l.includes("instagram.com") || l.includes("instagr.am")) return "instagram";
  if (l.includes("linkedin.com")) return "linkedin";
  if (l.includes("github.com")) return "github";
  if (l.includes("facebook.com") || l.includes("fb.com") || l.includes("fb.watch")) return "facebook";
  if (l.includes("twitter.com") || l.includes("x.com")) return "twitter";
  if (l.includes("tiktok.com")) return "tiktok";
  if (l.includes("youtube.com") || l.includes("youtu.be")) return "youtube";
  if (l.includes("wa.me") || l.includes("whatsapp")) return "whatsapp";
  return "website";
}

/** Mengembalikan label singkat platform (contoh: "IG", "WA", "YT") untuk ditampilkan pada badge kartu. */
export function getSocialPlatformShortLabel(url: string) {
  const platform = detectSocialPlatform(url);
  switch (platform) {
    case "instagram": return "IG";
    case "email": return "Email";
    case "linkedin": return "LinkedIn";
    case "github": return "GitHub";
    case "whatsapp": return "WA";
    case "facebook": return "FB";
    case "twitter": return "X";
    case "tiktok": return "TikTok";
    case "youtube": return "YT";
    default: return "Web";
  }
}

export function getSolidBadgeColor(platform: string) {
  switch (platform) {
    case "instagram":
      return { bg: "bg-[#FF007F]", text: "text-white", inputBg: "bg-black/30 text-white placeholder-white/60", icon: "text-white" };
    case "email":
      return { bg: "bg-[#B31412]", text: "text-white", inputBg: "bg-black/30 text-white placeholder-white/60", icon: "text-white" };
    case "linkedin":
      return { bg: "bg-[#0A66C2]", text: "text-white", inputBg: "bg-black/30 text-white placeholder-white/60", icon: "text-white" };
    case "github":
      return { bg: "bg-[#24292E]", text: "text-white", inputBg: "bg-black/30 text-white placeholder-white/60", icon: "text-white" };
    case "whatsapp":
      return { bg: "bg-[#25D366]", text: "text-black", inputBg: "bg-black/20 text-black placeholder-black/50", icon: "text-black" };
    case "facebook":
      return { bg: "bg-[#3b5998]", text: "text-white", inputBg: "bg-black/30 text-white placeholder-white/60", icon: "text-white" };
    case "twitter":
      return { bg: "bg-[#1DA1F2]", text: "text-white", inputBg: "bg-black/30 text-white placeholder-white/60", icon: "text-white" };
    default:
      return { bg: "bg-[#FFD700]", text: "text-black", inputBg: "bg-black/20 text-black placeholder-black/50", icon: "text-black" };
  }
}

export function SocialIcon({
  url,
  size = 15,
  className = "",
  weight = "bold",
}: {
  url: string;
  size?: number;
  className?: string;
  weight?: "bold" | "regular" | "fill";
}) {
  const platform = detectSocialPlatform(url);
  switch (platform) {
    case "instagram":
      return <InstagramLogo size={size} className={`text-current ${className}`} weight={weight} />;
    case "email":
      return <AtSign size={size} className={`text-current ${className}`} strokeWidth={2.5} />;
    case "linkedin":
      return <LinkedinLogo size={size} className={`text-current ${className}`} weight={weight} />;
    case "github":
      return <GithubLogo size={size} className={`text-current ${className}`} weight={weight} />;
    case "whatsapp":
      return <WhatsappLogo size={size} className={`text-current ${className}`} weight={weight} />;
    case "facebook":
      return <FacebookLogo size={size} className={`text-current ${className}`} weight={weight} />;
    case "twitter":
      return <TwitterLogo size={size} className={`text-current ${className}`} weight={weight} />;
    case "tiktok":
      return <TiktokLogo size={size} className={`text-current ${className}`} weight={weight} />;
    case "youtube":
      return <YoutubeLogo size={size} className={`text-current ${className}`} weight={weight} />;
    default:
      return <Globe size={size} className={`text-current ${className}`} weight={weight} />;
  }
}

/**
 * Komponen input manajemen kontak & social media untuk form admin.
 * Menyediakan 2 kartu wajib (Instagram + Email) dan hingga 3 kartu opsional.
 * Platform terdeteksi otomatis berdasarkan URL yang diketik, lalu warna kartu
 * menyesuaikan brand color masing-masing platform.
 *
 * @param extraLinks          - Array URL link tambahan (maks 3 entri).
 * @param onExtraLinksChange  - Callback untuk memperbarui array link tambahan.
 */
interface SocialLinksInputProps {
  instagramUrl: string;
  onInstagramChange: (val: string) => void;
  email?: string;
  onEmailChange?: (val: string) => void;
  extraLinks?: string[];
  onExtraLinksChange?: (links: string[]) => void;
}

export const SocialLinksInput: React.FC<SocialLinksInputProps> = ({
  instagramUrl,
  onInstagramChange,
  email = "",
  onEmailChange,
  extraLinks = [],
  onExtraLinksChange,
}) => {
  const totalCards = 2 + extraLinks.length; // 2 Wajib (IG & Email) + Max 3 Ekstra = 5
  const canAddMore = totalCards < 5;

  const handleAddCard = () => {
    if (!onExtraLinksChange || !canAddMore) return;
    onExtraLinksChange([...extraLinks, ""]);
  };

  const handleUpdateExtraLink = (index: number, val: string) => {
    if (!onExtraLinksChange) return;
    const updated = [...extraLinks];
    updated[index] = val;
    onExtraLinksChange(updated);
  };

  const handleRemoveExtraLink = (index: number) => {
    if (!onExtraLinksChange) return;
    const updated = extraLinks.filter((_, i) => i !== index);
    onExtraLinksChange(updated);
  };

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-3.5 backdrop-blur-xl">
      {/* 1. Spotify Container Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
          <InstagramLogo size={15} className="text-pink-400" weight="bold" />
          Kontak & Social Media (2 Wajib + Maks 3 Opsional)
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {totalCards} / 5 Card
        </span>
      </div>

      {/* 2. Compact Horizontal Row of 5 Cards Max */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        
        {/* Card 1: Default Instagram Solid Badge Card (Wajib 1) */}
        <div className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#FF007F] p-1 pl-2 shadow-[2px_2px_0px_0px_#000000] text-white font-mono text-xs flex-1 min-w-[170px] max-w-[220px]">
          <div className="flex items-center gap-1 shrink-0 font-black uppercase text-[10px] tracking-wide">
            <InstagramLogo size={15} weight="bold" className="text-white shrink-0" />
            <span>IG:</span>
          </div>
          <input
            type="text"
            value={instagramUrl}
            onChange={(e) => onInstagramChange(e.target.value)}
            placeholder="instagram.com/user..."
            className="w-full rounded-md border border-black/30 bg-black/30 px-2 py-0.5 text-xs text-white placeholder-white/60 font-mono focus:bg-black/50 focus:outline-none"
          />
        </div>

        {/* Card 2: Default Email Solid Badge Card (Wajib 2) */}
        <div className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#B31412] p-1 pl-2 shadow-[2px_2px_0px_0px_#000000] text-white font-mono text-xs flex-1 min-w-[170px] max-w-[220px]">
          <div className="flex items-center gap-1 shrink-0 font-black uppercase text-[10px] tracking-wide">
            <AtSign size={15} strokeWidth={2.5} className="text-white shrink-0" />
            <span>Email:</span>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange && onEmailChange(e.target.value)}
            placeholder="email@domain.com..."
            className="w-full rounded-md border border-black/30 bg-black/30 px-2 py-0.5 text-xs text-white placeholder-white/60 font-mono focus:bg-black/50 focus:outline-none"
          />
        </div>

        {/* Dynamic Cards 3, 4, 5: Extra Social Links Solid Badge Cards */}
        {extraLinks.map((link, idx) => {
          const platform = detectSocialPlatform(link);
          const colorStyle = getSolidBadgeColor(platform);
          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 rounded-xl border-2 border-black p-1 pl-2 shadow-[2px_2px_0px_0px_#000000] font-mono text-xs flex-1 min-w-[170px] max-w-[220px] ${colorStyle.bg} ${colorStyle.text}`}
            >
              <div className="flex items-center gap-1 shrink-0 font-black uppercase text-[10px] tracking-wide">
                <SocialIcon url={link} size={15} className={colorStyle.icon} />
                <span>{getSocialPlatformShortLabel(link)}:</span>
              </div>
              <input
                type="text"
                value={link}
                onChange={(e) => handleUpdateExtraLink(idx, e.target.value)}
                placeholder="URL link..."
                className={`w-full rounded-md border border-black/20 px-2 py-0.5 text-xs font-mono focus:outline-none ${colorStyle.inputBg}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveExtraLink(idx)}
                className="h-5 w-5 rounded-md border border-black bg-black text-white hover:bg-rose-600 transition-all flex items-center justify-center cursor-pointer shrink-0"
                title="Hapus Link Ini"
              >
                <X size={11} weight="bold" />
              </button>
            </div>
          );
        })}

        {/* Compact Plus Button right next to the last card, auto-hides when totalCards === 5 */}
        {canAddMore && onExtraLinksChange && (
          <button
            type="button"
            onClick={handleAddCard}
            className="h-[36px] w-[36px] rounded-xl border-2 border-black bg-[#1DB954] text-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#1ed760] hover:rotate-3 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center shrink-0"
            title="Tambah Link Sosmed Opsional (Maks 5 Card Total)"
          >
            <Plus size={18} weight="bold" />
          </button>
        )}

      </div>
    </div>
  );
};
