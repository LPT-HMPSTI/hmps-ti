"use client";

import React from "react";
import { ListMusic } from "lucide-react";
import { DivisionMember } from "@/types";
import { OrgSocialButtons } from "@/components/modules/struktur/OrgSocialButtons";

export interface DivisionLeadershipSectionProps {
  members: DivisionMember[];
  divisionSlug: string;
  divisionName: string;
  onSelectMember: (member: DivisionMember) => void;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

/**
 * Menghitung urutan posisi hirarki berdasarkan jabatan pengurus
 */
const getMemberRoleRank = (role: string = "", divisionSlug: string = ""): number => {
  const r = role.toLowerCase().trim();
  const slug = divisionSlug.toLowerCase().trim();
  const isBph = slug === "bph" || slug === "bph-core" || slug === "bph-staff";

  if (isBph) {
    if (r.includes("ketua") && !r.includes("wakil")) return 1;
    if (r.includes("wakil ketua") || r.includes("wakil")) return 2;
    if (r.includes("sekretaris 1") || r.includes("sekretaris i") || r.includes("sekretaris umum") || r === "sekretaris") return 3;
    if (r.includes("sekretaris 2") || r.includes("sekretaris ii")) return 4;
    if (r.includes("bendahara 1") || r.includes("bendahara i") || r.includes("bendahara umum") || r === "bendahara") return 5;
    if (r.includes("bendahara 2") || r.includes("bendahara ii")) return 6;
    if (r.includes("sekretaris")) return 3.5;
    if (r.includes("bendahara")) return 5.5;
    return 10;
  }

  if (r.includes("koordinator") || r.includes("koor") || r.includes("kadiv") || (r.includes("ketua") && !r.includes("wakil"))) return 1;
  if (r.includes("wakil koordinator") || r.includes("wakil koor") || r.includes("wakil")) return 2;
  if (r.includes("staff") || r.includes("staf") || r.includes("anggota")) return 3;
  return 10;
};

/**
 * Komponen Susunan Pengurus & Anggota Divisi bergaya Spotify Artist Grid:
 * foto bulat di atas → nama → jabatan → NIM → tombol sosial.
 */
export const DivisionLeadershipSection: React.FC<DivisionLeadershipSectionProps> = ({
  members,
  divisionSlug,
  divisionName,
  onSelectMember,
}) => {
  if (members.length === 0) return null;

  const sortedMembers = [...members].sort((a, b) => {
    const rankA = getMemberRoleRank(a.role, divisionSlug || a.division_slug);
    const rankB = getMemberRoleRank(b.role, divisionSlug || b.division_slug);
    return rankA - rankB;
  });

  return (
    <section
      id="pengurus-section"
      className="space-y-6 bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl scroll-mt-36 sm:scroll-mt-40"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <ListMusic size={20} className="text-[#1DB954]" />
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
            Lineup Pengurus &amp; Anggota {divisionName}
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {members.length} Officers
        </span>
      </div>

      {/* Artist Grid — maks 4 kolom, diurutkan berdasarkan jabatan */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {sortedMembers.map((member, idx) => (
          <div
            key={member.id || idx}
            onClick={() => onSelectMember(member)}
            className="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10"
          >
            {/* Circular Photo */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#1DB954]/50 bg-black transition-all duration-300 shadow-lg group-hover:shadow-[0_0_24px_rgba(29,185,84,0.3)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatar || PLACEHOLDER_IMAGE}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Number badge */}
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1DB954] text-[10px] font-mono font-black text-black border-2 border-[#121212]">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Info */}
            <div className="w-full space-y-1.5">
              <h4 className="text-sm sm:text-base font-bold text-white leading-tight group-hover:text-[#1DB954] transition-colors duration-200 line-clamp-2">
                {member.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-snug line-clamp-2">
                {member.role}
              </p>
              <p className="text-[11px] font-mono text-[#1DB954]/80 font-semibold tracking-wider">
                {member.nim || "—"}
              </p>
            </div>

            {/* Social Buttons */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center"
            >
              <OrgSocialButtons member={member} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
