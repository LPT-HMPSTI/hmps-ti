"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { SpotifyDivisionCarousel } from "@/components/ui/SpotifyDivisionCarousel";
import { DivisionMember } from "@/types";

export interface DivisionItemConfig {
  slug: string;
  aliases: string[];
  name: string;
  fullname: string;
  variantColor: string;
  desc: string;
}

export interface OrgDivisionSectionProps {
  divisionConfigs: DivisionItemConfig[];
  divisionMembers: DivisionMember[];
}

/**
 * Komponen seksi album divisi kepengurusan dengan Track Carousel Spotify horizontal.
 */
export const OrgDivisionSection: React.FC<OrgDivisionSectionProps> = ({
  divisionConfigs,
  divisionMembers,
}): React.JSX.Element => {
  return (
    <section className="space-y-12 pt-4">
      <div className="text-center space-y-2 border-t border-white/10 pt-10">
        <Badge variant="spotify" tilt="left">
          DIVISION ALBUMS
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Introduce Our Division
        </h2>
      </div>

      {/* Division Carousels */}
      {divisionConfigs.map((config) => {
        const divMembers = divisionMembers.filter((m) => {
          const slug = (m.division_slug || "").toLowerCase().trim();
          return config.aliases.some((alias) => slug.includes(alias));
        });

        return (
          <div key={config.slug} id={`divisi-${config.slug}`} className="scroll-mt-36 sm:scroll-mt-40">
            <SpotifyDivisionCarousel
              title={config.name}
              fullname={config.fullname}
              desc={config.desc}
              members={divMembers}
              variantColor={config.variantColor}
            />
          </div>
        );
      })}
    </section>
  );
};
