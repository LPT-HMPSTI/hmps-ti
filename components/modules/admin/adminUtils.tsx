"use client";

import React from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { NeubrutalistVariant } from "@/types";

/**
 * Daftar opsi divisi pengurus HMPSTI.
 */
export const divisionOptions: string[] = [
  "LPT",
  "PSDM",
  "HUMAS",
  "KWU",
  "MEDKOMINFO",
  "BPH",
];

/**
 * Normalisasi nama divisi berdasarkan slug yang diberikan.
 */
export const getDivisionName = (slug: string): string => {
  const s = (slug || "").toLowerCase().trim();
  switch (s) {
    case "bph":
    case "bph-core":
    case "bph-staff":
      return "BPH";
    case "psdm":
      return "PSDM";
    case "lpt":
      return "LPT";
    case "medkominfo":
    case "medkom":
      return "MEDKOMINFO";
    case "humas":
      return "HUMAS";
    case "kwu":
    case "kewirausahaan":
      return "KWU";
    default:
      return "BPH";
  }
};

/**
 * Menghasilkan properti badge neubrutalis untuk divisi.
 */
export const getDivisionBadgeProps = (
  slug: string
): { variant: NeubrutalistVariant; label: string } => {
  const s = (slug || "").toLowerCase().trim();
  switch (s) {
    case "bph":
    case "bph-core":
    case "bph-staff":
      return { variant: "spotify", label: "BPH" };
    case "psdm":
      return { variant: "cyan", label: "PSDM" };
    case "lpt":
      return { variant: "yellow", label: "LPT" };
    case "kwu":
    case "kewirausahaan":
      return { variant: "orange", label: "KWU" };
    case "medkominfo":
    case "medkom":
      return { variant: "purple", label: "MEDKOMINFO" };
    case "humas":
      return { variant: "magenta", label: "HUMAS" };
    default:
      return { variant: "spotify", label: "BPH" };
  }
};

/**
 * Mengambil varian warna badge untuk kategori status keanggotaan.
 */
export const getMemberBadgeVariant = (status: string): NeubrutalistVariant => {
  const s = (status || "").toLowerCase().trim();
  if (s.includes("pengurus aktif") || s.includes("pengurus")) {
    return "spotify";
  }
  if (s.includes("alumni")) {
    return "yellow";
  }
  if (s.includes("dosen") || s.includes("pembina") || s.includes("penanggung jawab")) {
    return "cyan";
  }
  return "magenta";
};

// Opsi kategori terpisah untuk Berita vs Event / Agenda
export const newsCategoryOptions = ["Informasi", "Akademik", "Prestasi", "Pengumuman", "Teknologi"];
export const eventCategoryOptions = ["Workshop", "Event", "Webinar", "Kompetisi", "Makrab"];

/**
 * Memeriksa apakah artikel merupakan jenis kegiatan/agenda (event).
 */
export const isEventArticle = (article: any): boolean => {
  if (!article) return false;
  if (article.is_event === true || article.is_event === "true") return true;
  const cat = (article.category || "").trim().toLowerCase();
  const eventCats = ["event", "workshop", "webinar", "kompetisi", "makrab"];
  return eventCats.includes(cat);
};

/**
 * Membersihkan awalan "Divisi " pada penulisan nama divisi.
 */
export const cleanDivisionName = (name: string): string => {
  if (!name) return "LPT";
  const clean = name.replace(/^Divisi\s+/i, "").trim();
  const upper = clean.toUpperCase();
  if (upper === "MEDKOM") return "MEDKOMINFO";
  if (upper === "KEWIRAUSAHAAN") return "KWU";
  return clean;
};

/**
 * Helper styling tombol sosial neubrutalism sesuai platform.
 */
export const getNeubrutalistSocialStyle = (url: string, index: number): string => {
  const u = (url || "").toLowerCase();
  const tiltClass = index % 2 === 0 ? "-rotate-2" : "rotate-2";

  let brandColors = "bg-[#FFD700] text-black"; // Default Website (Kuning)
  if (u.includes("instagram.com") || u.includes("instagr.am")) {
    brandColors = "bg-[#FF007F] text-white"; // Hot Magenta
  } else if (u.includes("mailto:") || u.includes("gmail") || u.includes("email") || u.includes("@")) {
    brandColors = "bg-[#B31412] text-white"; // Merah Gmail
  } else if (u.includes("github.com")) {
    brandColors = "bg-[#24292E] text-white"; // GitHub Dark
  } else if (u.includes("linkedin.com")) {
    brandColors = "bg-[#0A66C2] text-white"; // LinkedIn Blue
  } else if (u.includes("wa.me") || u.includes("whatsapp")) {
    brandColors = "bg-[#25D366] text-black"; // WhatsApp Green
  }

  return `flex h-7 w-7 items-center justify-center rounded-md border-2 border-black ${brandColors} shadow-[2px_2px_0px_0px_#000000] ${tiltClass} hover:rotate-0 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-200 cursor-pointer shrink-0`;
};

/**
 * Merender daftar ikon tautan sosial media neubrutalism pada kartu anggota/pengurus.
 */
export const renderSocialIconsList = (item: any) => {
  const links: string[] = [];
  if (item?.instagram_url && item.instagram_url.trim()) links.push(item.instagram_url.trim());
  if (item?.email && item.email.trim()) links.push(`mailto:${item.email.trim()}`);
  if (item?.github_url && item.github_url.trim() && item.github_url.trim() !== "https://github.com") {
    links.push(item.github_url.trim());
  }
  if (item?.linkedin_url && item.linkedin_url.trim() && item.linkedin_url.trim() !== "https://linkedin.com") {
    links.push(item.linkedin_url.trim());
  }
  if (Array.isArray(item?.social_links)) {
    item.social_links.forEach((l: string) => {
      if (l && typeof l === "string" && l.trim()) {
        const trimmed = l.trim();
        if (trimmed !== "https://github.com" && trimmed !== "https://linkedin.com" && !links.includes(trimmed)) {
          links.push(trimmed);
        }
      }
    });
  }
  const unique = Array.from(new Set(links)).filter(Boolean);
  if (unique.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap pt-1">
      {unique.map((url, idx) => (
        <a
          key={idx}
          href={url.startsWith("mailto:") || url.startsWith("http") ? url : `https://${url}`}
          target={url.startsWith("mailto:") ? "_self" : "_blank"}
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={getNeubrutalistSocialStyle(url, idx)}
          title={url}
        >
          <SocialIcon url={url} size={14} weight="bold" />
        </a>
      ))}
    </div>
  );
};

/**
 * Menghitung tahun angkatan mahasiswa dari NIM kampus (misal: STI202303494 -> 2023).
 */
export const deriveCohortFromNim = (nim: string): string => {
  const clean = (nim || "").trim().toUpperCase();

  // 1. Format Kampus: 3 huruf (STI) + 4 digit tahun (2023) + digit (STI202303494 -> 2023)
  const campusMatch = clean.match(/^[A-Z]{3}(\d{4})/);
  if (campusMatch && campusMatch[1]) {
    return campusMatch[1];
  }

  // 2. Fallback: 4 digit tahun di awal NIM (202301010 -> 2023)
  const yearMatch = clean.match(/^(\d{4})/);
  if (yearMatch && yearMatch[1]) {
    return yearMatch[1];
  }

  // 3. Fallback: 2 digit tahun di awal NIM (220101010 -> 2022)
  const shortYearMatch = clean.match(/^(\d{2})/);
  if (shortYearMatch && shortYearMatch[1]) {
    return `20${shortYearMatch[1]}`;
  }

  return "2024";
};

/**
 * Sinkronisasi otomatis data Pengurus Divisi -> Direktori Keanggotaan & Alumni.
 */
export const prepareAutoMemberFromPengurus = (divMember: any) => {
  const socialLinks = Array.isArray(divMember.social_links)
    ? divMember.social_links.filter(Boolean)
    : [];
  const githubLink =
    socialLinks.find((l: string) => l.includes("github.com")) || divMember.github_url || "";
  const linkedinLink =
    socialLinks.find((l: string) => l.includes("linkedin.com")) || divMember.linkedin_url || "";

  return {
    name: divMember.name || "",
    nim: divMember.nim || "",
    cohort: deriveCohortFromNim(divMember.nim),
    status: "Pengurus Aktif",
    role: divMember.role || "Staff Divisi",
    avatar: divMember.avatar || divMember.image_url || "",
    variant: "spotify" as NeubrutalistVariant,
    email: divMember.email || "",
    instagram_url: divMember.instagram_url || "",
    github_url: githubLink,
    linkedin_url: linkedinLink,
    social_links: socialLinks,
  };
};

/**
 * Sanitasi data formulir pengurus divisi sebelum disimpan ke database Supabase.
 */
export const prepareDivMemberTablePayload = (data: any) => {
  const socialLinks = Array.isArray(data.social_links)
    ? data.social_links.map((s: string) => (s || "").trim()).filter(Boolean)
    : [];
  const githubLink =
    socialLinks.find((l: string) => l.includes("github.com")) ||
    (data.github_url && data.github_url.trim() !== "https://github.com" ? data.github_url.trim() : "");
  const linkedinLink =
    socialLinks.find((l: string) => l.includes("linkedin.com")) ||
    (data.linkedin_url && data.linkedin_url.trim() !== "https://linkedin.com" ? data.linkedin_url.trim() : "");

  const payload: any = {
    name: data.name || "",
    nim: data.nim || "",
    division_slug: data.division_slug || "bph",
    role: data.role || "Staff Divisi",
    avatar:
      data.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    email: (data.email || "").trim(),
    instagram_url: (data.instagram_url || "").trim(),
    github_url: githubLink,
    linkedin_url: linkedinLink,
    social_links: socialLinks,
    order_index: typeof data.order_index === "number" ? data.order_index : Number(data.order_index) || 0,
  };

  if (data.id) {
    payload.id = data.id;
  }

  return payload;
};

/**
 * Sanitasi data formulir direktori keanggotaan sebelum disimpan ke database Supabase.
 */
export const prepareMemberTablePayload = (data: any) => {
  const socialLinks = Array.isArray(data.social_links)
    ? data.social_links.map((s: string) => (s || "").trim()).filter(Boolean)
    : [];
  const githubLink =
    socialLinks.find((l: string) => l.includes("github.com")) ||
    (data.github_url && data.github_url.trim() !== "https://github.com" ? data.github_url.trim() : "");
  const linkedinLink =
    socialLinks.find((l: string) => l.includes("linkedin.com")) ||
    (data.linkedin_url && data.linkedin_url.trim() !== "https://linkedin.com" ? data.linkedin_url.trim() : "");

  const payload: any = {
    name: data.name || "",
    nim: data.nim || "",
    cohort: data.cohort || deriveCohortFromNim(data.nim),
    status: data.status || "Alumni HMPS-TI",
    role: data.role || "Alumni Mahasiswa",
    avatar: data.avatar || data.image_url || data.avatar_url || "",
    variant: getMemberBadgeVariant(data.status || "Alumni HMPS-TI"),
    email: (data.email || "").trim(),
    instagram_url: (data.instagram_url || "").trim(),
    github_url: githubLink,
    linkedin_url: linkedinLink,
    social_links: socialLinks,
  };

  if (data.id) {
    payload.id = data.id;
  }

  return payload;
};
