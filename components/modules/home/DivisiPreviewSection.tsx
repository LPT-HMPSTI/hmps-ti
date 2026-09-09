"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { fetchDivisionPhotos } from "@/services";

export const DivisiPreviewSection: React.FC = () => {
  const [divisionPhotos, setDivisionPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    fetchDivisionPhotos().then((photos) => {
      if (isMounted && photos) {
        setDivisionPhotos(photos);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const divisions = [
    {
      id: "bph",
      name: "BPH",
      short: "BPH",
      desc: "Ketua, Wakil, Sekretaris, dan Bendahara pengambil kebijakan utama HMPSTI.",
      badgeVariant: "spotify" as const,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "psdm",
      name: "PSDM",
      short: "PSDM",
      desc: "Kaderisasi mahasiswa baru, upgrading keahlian, dan keakraban internal.",
      badgeVariant: "cyan" as const,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "lpt",
      name: "LPT",
      short: "LPT",
      desc: "Pelatihan koding, riset teknologi web/AI, dan pendampingan lomba.",
      badgeVariant: "yellow" as const,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "kwu",
      name: "KWU",
      short: "KWU",
      desc: "Usaha mandiri himpunan, merchandise resmi, dan kemitraan Sponsorship.",
      badgeVariant: "orange" as const,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "medkominfo",
      name: "MEDKOMINFO",
      short: "MEDKOMINFO",
      tagline: "Branding Visual & Sosmed",
      desc: "Desain grafis feeds, video dokumentasi, dan visual branding HMPSTI.",
      badgeVariant: "purple" as const,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "humas",
      name: "HUMAS",
      short: "HUMAS",
      desc: "Kemitraan eksternal, pengabdian masyarakat, dan advokasi aspirasi.",
      badgeVariant: "magenta" as const,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-8 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="spotify" tilt="left">
              6 DIVISI HMPSTI
            </Badge>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Divisi Kepengurusan <span className="text-[#1DB954]">HMPSTI SWU</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {divisions.map((div, idx) => (
            <motion.div
              key={div.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link href={`/divisi/${div.id}`}>
                <GlassCard glowColor="emerald" className="group p-4 text-center space-y-3 h-full flex flex-col justify-between hover:border-[#1DB954]">
                  <div>
                    <div className="relative mx-auto mb-3 h-20 w-20">
                      <div className="h-full w-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#1DB954] transition-all duration-300">
                        <img
                          src={divisionPhotos[div.id] || div.avatar}
                          alt={div.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="spotify-play-btn absolute -bottom-1 -right-1 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-xl">
                        <Play size={14} fill="currentColor" />
                      </div>
                    </div>

                    <Badge variant={div.badgeVariant} tilt="right" className="mb-2">
                      {div.short}
                    </Badge>

                    <h3 className="text-xs font-bold text-white group-hover:text-[#1DB954] transition-colors leading-tight">{div.name}</h3>
                  </div>

                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed pt-1">
                    {div.desc}
                  </p>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
