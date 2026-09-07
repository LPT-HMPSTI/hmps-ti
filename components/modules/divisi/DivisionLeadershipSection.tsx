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
 * Komponen Susunan Pengurus & Anggota Divisi bergaya Spotify Tracklist,
 * identik dengan komponen OrgBphSection pada halaman Struktur Organisasi (/struktur).
 */
export const DivisionLeadershipSection: React.FC<DivisionLeadershipSectionProps> = ({
  members,
  divisionSlug,
  divisionName,
  onSelectMember,
}) => {
  if (members.length === 0) return null;

  return (
    <section
      id="pengurus-section"
      className="space-y-4 bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl scroll-mt-36 sm:scroll-mt-40"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <ListMusic size={20} className="text-[#1DB954]" />
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
            Lineup Pengurus & Anggota {divisionName}
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {members.length} Officers
        </span>
      </div>

      {/* Members Track Rows */}
      <div className="space-y-2">
        {members.map((member, idx) => (
          <div
            key={member.id || idx}
            onClick={() => onSelectMember(member)}
            className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group border border-white/5 cursor-pointer"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-xs font-mono font-bold text-slate-400 w-6 text-center group-hover:text-[#1DB954] transition-colors">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <div className="h-11 w-11 rounded-lg overflow-hidden border border-white/15 bg-black shrink-0">
                <img
                  src={member.avatar || PLACEHOLDER_IMAGE}
                  alt={member.name}
                  className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="min-w-0 space-y-0.5">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs font-mono text-slate-400 truncate">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <span className="text-xs font-mono font-bold text-[#1DB954] hidden sm:inline-block">
                NIM: {member.nim || "-"}
              </span>
              <div onClick={(e) => e.stopPropagation()}>
                <OrgSocialButtons member={member} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
