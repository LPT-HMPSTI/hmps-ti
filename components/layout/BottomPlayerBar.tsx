"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, MessageSquare, Radio, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRadarSync } from "./RadarSyncContext";

interface BottomPlayerBarProps {
  onOpenDirectLink: () => void;
}

export const BottomPlayerBar: React.FC<BottomPlayerBarProps> = ({ onOpenDirectLink }) => {
  const { items, currentIndex } = useRadarSync();

  const currentItem = items[currentIndex % (items.length || 1)] || items[0];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-20 border-t border-white/10 bg-[#0B0D14]/95 px-4 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] lg:left-64">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4">
        {/* Left Section: Synchronized Single / Carousel Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id + currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 min-w-0 flex-1 max-w-md"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1DB954]/40 overflow-hidden shadow-[0_0_15px_rgba(29,185,84,0.3)]">
              <img
                src={currentItem.thumbnail}
                alt={currentItem.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <Radio size={18} className="absolute text-[#1DB954] animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-xs font-bold text-white sm:text-sm">
                  {currentItem.title}
                </h4>
                <Badge variant={currentItem.badgeVariant} tilt="left" pulse className="hidden sm:inline-flex shrink-0">
                  {currentItem.badgeText}
                </Badge>
              </div>
              <p className="truncate text-[11px] text-slate-400">
                {currentItem.author} • STMIK Widya Utama
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Center Section: Ticker / Organization Stats Bar */}
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span>STMIK Widya Utama</span>
            <span>•</span>
            <span className="text-[#1DB954] font-bold">HMPSTI</span>
            <span>•</span>
            <span>Official Hub</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">            
            <span>Himpunan Mahasiswa Program Studi Teknik Informatika</span>
          </div>
        </div>

        {/* Right Section: Direct Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/kontak">
            <Button variant="glass" size="sm" icon={<MessageSquare size={14} strokeWidth={1.5} />} className="hidden sm:inline-flex">
              Aspirasi
            </Button>
          </Link>

          {/* Developing */}
          {/* <Button
            variant="spotify"
            size="sm"
            icon={<ExternalLink size={14} strokeWidth={1.5} />}
            onClick={onOpenDirectLink}
          >
            Direct Portal
          </Button> */}
        </div>
      </div>
    </footer>
  );
};
