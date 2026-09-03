"use client";

import React from "react";
import { ListMusic } from "lucide-react";
import { DivisionMember } from "@/types";
import { OrgSocialButtons } from "./OrgSocialButtons";

export interface OrgBphSectionProps {
  remainingBPH: DivisionMember[];
  onSelectMember: (member: DivisionMember) => void;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

/**
 * Komponen daftar pengurus inti BPH (Sekretaris & Bendahara) dengan tampilan tracklist Spotify.
 * Mengizinkan klik untuk membuka modal pop-up detail pengurus.
 */
export const OrgBphSection: React.FC<OrgBphSectionProps> = ({
  remainingBPH,
  onSelectMember,
}) => {
  if (remainingBPH.length === 0) return null;

  return (
    <section className="space-y-4 bg-[#121212] p-6 rounded-2xl border border-white/10 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <ListMusic size={18} className="text-[#1DB954]" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider">
            Featured BPH Fellow
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {remainingBPH.length} Officers
        </span>
      </div>

      <div className="space-y-2">
        {remainingBPH.map((bph, idx) => (
          <div
            key={bph.id || idx}
            onClick={() => onSelectMember(bph)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-all group border border-white/5 cursor-pointer"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-xs font-mono font-bold text-slate-400 w-5 text-center group-hover:text-[#1DB954]">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <div className="h-11 w-11 rounded-lg overflow-hidden border border-white/15 bg-black shrink-0">
                <img
                  src={bph.avatar || PLACEHOLDER_IMAGE}
                  alt={bph.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-[#1DB954] transition-colors">
                  {bph.name}
                </h4>
                <p className="text-xs font-mono text-slate-400 truncate">
                  {bph.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <span className="text-xs font-mono font-bold text-[#1DB954] hidden sm:inline-block">
                NIM: {bph.nim || "-"}
              </span>
              <OrgSocialButtons member={bph} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
