"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, Layers, Code, Award } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export const StatsCounterSection: React.FC = () => {
  const stats = [
    {
      id: "stat-1",
      number: "500+",
      label: "Mahasiswa Aktif",
      subtext: "Prodi Teknik Informatika",
      icon: Users,
      glow: "cyan" as const,
    },
    {
      id: "stat-2",
      number: "5",
      label: "Divisi Utama",
      subtext: "Medkom, Iptek, Humas, Danus, PSDM",
      icon: Layers,
      glow: "emerald" as const,
    },
    {
      id: "stat-3",
      number: "40+",
      label: "Karya & Inovasi",
      subtext: "Web, Mobile, AI & IoT",
      icon: Code,
      glow: "cyan" as const,
    },
    {
      id: "stat-4",
      number: "25+",
      label: "Program Kerja",
      subtext: "Terlaksana Per Periode",
      icon: Award,
      glow: "emerald" as const,
    },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard glowColor={stat.glow} className="p-6 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10">
                      <IconComponent size={20} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {stat.number}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-200">{stat.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{stat.subtext}</p>
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
