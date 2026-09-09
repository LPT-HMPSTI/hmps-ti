"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const KaryaPreviewSection: React.FC = () => {
  const featuredProjects = [
    {
      id: "p1",
      title: "SWU Academic Cloud Hub",
      category: "WEB APP",
      author: "Aditya Pratama",
      badgeVariant: "spotify" as const,
      coverImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "p2",
      title: "AI Syntax Reviewer & Mentor",
      category: "AI & ML",
      author: "Siti Rahmawati",
      badgeVariant: "cyan" as const,
      coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "p3",
      title: "Smart Campus IoT Monitoring",
      category: "IOT & EMBEDDED",
      author: "Budi Santoso",
      badgeVariant: "yellow" as const,
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    },
  ];

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
          {featuredProjects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlassCard glowColor="cyan" className="group p-5 space-y-4 h-full flex flex-col justify-between">
                <div>
                  <div className="relative mb-4 aspect-square w-full rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <img src={proj.coverImage} alt={proj.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-3 left-3">
                      <Badge variant={proj.badgeVariant} tilt="left">
                        {proj.category}
                      </Badge>
                    </div>

                    <Link
                      href="/karya"
                      className="spotify-play-btn absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Play size={20} fill="currentColor" />
                    </Link>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#1DB954] transition-colors leading-snug">{proj.title}</h3>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{proj.author}</span>
                  <Link href="/karya" className="text-[#1DB954] font-bold flex items-center gap-1">
                    Detail <ExternalLink size={12} />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
