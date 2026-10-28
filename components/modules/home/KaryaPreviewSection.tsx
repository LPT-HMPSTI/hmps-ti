"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchProjectsList } from "@/services";
import { StudentProject } from "@/types";
import { optimizedImage } from "@/lib/imagekit-url";

const getCategoryBadgeVariant = (cat: string) => {
  const c = (cat || "").toUpperCase();
  if (c.includes("AI") || c.includes("ML")) return "cyan" as const;
  if (c.includes("MOBILE")) return "spotify" as const;
  if (c.includes("IOT") || c.includes("EMBEDDED")) return "yellow" as const;
  return "spotify" as const;
};

export const KaryaPreviewSection: React.FC = () => {
  const [projects, setProjects] = useState<StudentProject[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchProjectsList().then((data) => {
      if (isMounted && data) {
        setProjects(data.slice(0, 3));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-8 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="cyan" tilt="left">
              SHOWCASE KARYA
            </Badge>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Karya Inovasi <span className="text-[#1DB954]">Mahasiswa TI</span>
            </h2>
          </div>
          <Link href="/karya">
            <Button variant="glass" size="sm" icon={<ArrowUpRight size={16} />}>
              Lihat Katalog Karya
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj, idx) => {
            const projectUrl = `/karya/${proj.slug || proj.id}`;
            const cover = proj.cover_image || "/logo-hmpsti.webp";

            return (
              <motion.div
                key={proj.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <GlassCard glowColor="cyan" className="group p-5 space-y-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="relative mb-4 aspect-square w-full rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/40">
                      <img
                        src={optimizedImage(cover, "card")}
                        alt={proj.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      <div className="absolute top-3 left-3">
                        <Badge variant={getCategoryBadgeVariant(proj.category)} tilt="left">
                          {proj.category}
                        </Badge>
                      </div>

                      <Link
                        href={projectUrl}
                        className="spotify-play-btn absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                        title={`Buka ${proj.title}`}
                      >
                        <Play size={20} fill="currentColor" />
                      </Link>
                    </div>

                    <Link href={projectUrl}>
                      <h3 className="text-base font-bold text-white group-hover:text-[#1DB954] transition-colors leading-snug line-clamp-2">
                        {proj.title}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="truncate max-w-[150px]">{proj.author_name || "Mahasiswa TI"}</span>
                    <Link href={projectUrl} className="text-[#1DB954] font-bold flex items-center gap-1 hover:underline">
                      Detail <ExternalLink size={12} />
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
