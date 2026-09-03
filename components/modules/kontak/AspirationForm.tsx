"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  Lock,
  Unlock,
  MessageSquare,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const ASPIRASI_TOPICS = [
  "Akademik & Fasilitas",
  "Kegiatan & Event",
  "Kritik & Evaluasi",
  "Ide Inovasi",
  "Lainnya",
] as const;

export interface AspirationFormProps {
  onSubmitAspiration: (payload: {
    name: string;
    email: string;
    message: string;
    isAnonymous: boolean;
  }) => Promise<void>;
}

/**
 * Formulir pengiriman aspirasi mahasiswa dengan opsi mode anonim,
 * pilihan topik, validasi karakter, dan animasi konfirmasi terkirim.
 */
export const AspirationForm: React.FC<AspirationFormProps> = ({
  onSubmitAspiration,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("Akademik & Fasilitas");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const fullMessage = `[Topik: ${selectedTopic}]\n${message.trim()}`;

    try {
      await onSubmitAspiration({
        name: isAnonymous ? "Mahasiswa Anonim" : name.trim(),
        email: isAnonymous ? "" : email.trim(),
        message: fullMessage,
        isAnonymous,
      });
    } finally {
      setIsSubmitting(false);
    }

    setSubmitted(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSubmitted(false);
    }, 4500);
  };

  return (
    <div className="lg:col-span-7">
      <GlassCard glowColor="emerald" className="p-6 sm:p-8 space-y-6">
        {/* Form Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-[#1DB954]" />
              Form Aspirasi
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Suara dan aspirasi Anda untuk himpunan
            </p>
          </div>

          {/* Mode Anonim Toggle */}
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              isAnonymous
                ? "bg-[#1DB954] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                : "bg-white/[0.05] text-slate-300 border border-white/10 hover:bg-white/10"
            }`}
          >
            {isAnonymous ? <Lock size={12} /> : <Unlock size={12} />}
            <span>{isAnonymous ? "Mode Anonim: ON" : "Kirim Terbuka"}</span>
          </button>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[#1DB954]/40 bg-[#1DB954]/10 p-10 text-center space-y-3 my-auto"
          >
            <div className="h-16 w-16 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center mx-auto text-[#1DB954]">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Aspirasi Berhasil Disampaikan!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-mono">
              Terima kasih atas partisipasi Anda. Pesan Anda telah tersimpan secara aman di database dan akan ditinjau pada agenda evaluasi HMPSTI SWU.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Filter Pills */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Topik Aspirasi
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ASPIRASI_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedTopic === topic
                        ? "bg-[#1DB954] text-black font-bold border border-black shadow-[2px_2px_0px_0px_#000000]"
                        : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Identity Inputs */}
            <AnimatePresence mode="popLayout">
              {!isAnonymous && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Mahasiswa"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder-slate-500 focus:border-[#1DB954] focus:outline-none transition-colors font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@stmik-widya-utama.ac.id"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder-slate-500 focus:border-[#1DB954] focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pesan */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300">
                  Pesan / Aspirasi / Saran *
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  {message.length}/1000
                </span>
              </div>
              <textarea
                required
                rows={5}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan aspirasi, kritik, atau ide kegiatan Anda di sini..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white placeholder-slate-500 focus:border-[#1DB954] focus:outline-none transition-colors leading-relaxed font-mono"
              />
            </div>

            <Button
              variant="spotify"
              size="md"
              className="w-full font-bold cursor-pointer"
              disabled={isSubmitting}
              icon={<Send size={15} />}
            >
              {isSubmitting ? "Mengirimkan..." : "Kirim Aspirasi Sekarang"}
            </Button>
          </form>
        )}
      </GlassCard>
    </div>
  );
};
