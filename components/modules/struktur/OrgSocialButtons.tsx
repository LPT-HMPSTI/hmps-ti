"use client";

import React from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { DivisionMember } from "@/types";

export interface OrgSocialButtonsProps {
  member: DivisionMember;
}

// Crisp Neubrutalist Social Button Helper
export const getNeubrutalistSocialStyle = (url: string, index: number) => {
  const u = (url || "").toLowerCase();
  const tiltClass = index % 2 === 0 ? "-rotate-2" : "rotate-2";

  let brandColors = "bg-[#FFD700] text-black"; // Yellow default (Website)
  if (u.includes("instagram.com") || u.includes("instagr.am")) {
    brandColors = "bg-[#FF007F] text-white"; // Hot Magenta (White Icon)
  } else if (u.includes("mailto:") || u.includes("gmail") || u.includes("email") || u.includes("@")) {
    brandColors = "bg-[#B31412] text-white"; // Maroon Khas Gmail (White Icon)
  } else if (u.includes("github.com")) {
    brandColors = "bg-[#24292E] text-white"; // GitHub Black (White Icon)
  } else if (u.includes("linkedin.com")) {
    brandColors = "bg-[#0A66C2] text-white"; // Deep LinkedIn Blue (White Icon)
  } else if (u.includes("wa.me") || u.includes("whatsapp")) {
    brandColors = "bg-[#25D366] text-black"; // WhatsApp Green (Black Icon)
  }

  return `flex h-7 w-7 items-center justify-center rounded-md border-2 border-black ${brandColors} shadow-[2px_2px_0px_0px_#000000] ${tiltClass} hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer shrink-0`;
};

/**
 * Deretan tombol tautan media sosial pengurus berdesain neubrutalism.
 * Otomatis mendeteksi platform (Instagram, Gmail, GitHub, LinkedIn, WhatsApp).
 */
export const OrgSocialButtons: React.FC<OrgSocialButtonsProps> = ({ member }) => {
  const links: string[] = [];
  if (member.instagram_url && member.instagram_url.trim()) links.push(member.instagram_url.trim());
  if (member.email && member.email.trim()) links.push(`mailto:${member.email.trim()}`);
  if (member.github_url && member.github_url.trim() && member.github_url.trim() !== "https://github.com") {
    links.push(member.github_url.trim());
  }
  if (member.linkedin_url && member.linkedin_url.trim() && member.linkedin_url.trim() !== "https://linkedin.com") {
    links.push(member.linkedin_url.trim());
  }
  if (Array.isArray(member.social_links)) {
    member.social_links.forEach((l) => {
      if (l && typeof l === "string" && l.trim() && !links.includes(l.trim())) {
        links.push(l.trim());
      }
    });
  }

  const uniqueLinks = Array.from(new Set(links)).filter(Boolean);

  return (
    <div className="flex items-center gap-1.5">
      {uniqueLinks.slice(0, 4).map((url, i) => (
        <a
          key={i}
          href={url.startsWith("mailto:") || url.startsWith("http") ? url : `https://${url}`}
          target={url.startsWith("mailto:") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className={getNeubrutalistSocialStyle(url, i)}
          title={url}
        >
          <SocialIcon url={url} size={14} weight="bold" />
        </a>
      ))}
    </div>
  );
};
