"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PaperPlaneTilt,
  CheckCircle,
  LinkSimple,
  UploadSimple,
  Code,
  Globe,
  GithubLogo,
  User,
  Envelope,
  IdentificationCard,
  Notebook,
  Sparkle,
} from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CyberSelect } from "@/components/ui/CyberSelect";

const CATEGORY_OPTIONS = [
  "WEB APP",
  "MOBILE APP",
  "AI & ML",
  "IOT & EMBEDDED",
  "UI/UX DESIGN",
  "GAMES",
  "LAINNYA",
];

export default function SubmitKaryaPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "WEB APP",
    author_name: "",
    author_nim: "",
    sender_email: "",
    tech_stack: "",
    cover_image: "",
    github_url: "",
    demo_url: "",
    orbit_url: "",
    description: "",
    content: "",
  });

  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDeviceFileUpload = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, cover_image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title.trim() || !formData.author_name.trim() || !formData.sender_email.trim() || !formData.description.trim()) {
      setErrorMessage("Harap lengkapi seluruh bidang yang wajib diisi (*).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submit-karya", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || "Gagal mengirim pengajuan karya. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setErrorMessage("Koneksi gagal. Pastikan jaringan internet kamu terhubung.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Back to Showcase button & Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link
            href="/karya"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-[#1DB954] transition-colors mb-3 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Showcase Karya</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="spotify" tilt="left">
              FORMULIR PENGAJUAN
            </Badge>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              • Ditinjau oleh Tim Admin HMPSTI SWU
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Kirim Karya Inovasi Mahasiswa
          </h1>
        </div>
      </div>

      {/* Success State */}
      {isSubmitted ? (
        <GlassCard glowColor="spotify" className="p-8 sm:p-12 text-center space-y-6 my-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] shadow-[0_0_30px_rgba(29,185,84,0.4)]">
            <CheckCircle size={48} weight="fill" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Karyamu Berhasil Dikirim! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Terima kasih! Detail karya milikmu telah terkirim ke email resmi pengurus HMPSTI STMIK Widya Utama (<span className="text-[#1DB954] font-mono">hmpstiswu@gmail.com</span>). Tim admin kami akan meninjau dan mempublikasikannya di showcase setelah verifikasi.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/karya">
              <Button variant="spotify" size="lg">
                Kembali ke Showcase Karya
              </Button>
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  title: "",
                  category: "WEB APP",
                  author_name: "",
                  author_nim: "",
                  sender_email: "",
                  tech_stack: "",
                  cover_image: "",
                  github_url: "",
                  demo_url: "",
                  orbit_url: "",
                  description: "",
                  content: "",
                });
              }}
              className="px-6 py-3 rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Kirim Karya Lainnya
            </button>
          </div>
        </GlassCard>
      ) : (
        /* Form State */
        <GlassCard glowColor="spotify" className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Isikan formulir di bawah ini dengan lengkap. Karya yang kamu kirimkan akan diteruskan ke tim pengurus HMPSTI SWU untuk diverifikasi dan diterbitkan di etalase karya website resmi.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Informasi Utama Proyek */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#1DB954] uppercase tracking-wider flex items-center gap-2">
                <Sparkle size={14} weight="fill" /> 1. Informasi Utama Karya
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Judul Karya / Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Sistem Deteksi Hama Padi Berbasis AI"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                  />
                </div>

                <div>
                  <CyberSelect
                    label="Kategori Karya *"
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val })}
                    options={CATEGORY_OPTIONS}
                    placeholder="Pilih Kategori..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Data Pembuat / Kontaktor */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <h3 className="text-xs font-mono font-bold text-[#1DB954] uppercase tracking-wider flex items-center gap-2">
                <User size={14} weight="bold" /> 2. Data Pembuat & Pengirim
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Nama Pembuat / Tim *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="Nama Lengkap / Nama Tim"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 pl-9 text-xs text-white focus:border-[#1DB954] focus:outline-none"
                    />
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    NIM Ketua / Pembuat
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.author_nim}
                      onChange={(e) => setFormData({ ...formData, author_nim: e.target.value })}
                      placeholder="e.g. 220101010"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 pl-9 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                    />
                    <IdentificationCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Email Pengirim (Untuk Konfirmasi) *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.sender_email}
                      onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                      placeholder="emailkamu@gmail.com"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 pl-9 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                    />
                    <Envelope size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Gambar & Tautan External */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <h3 className="text-xs font-mono font-bold text-[#1DB954] uppercase tracking-wider flex items-center gap-2">
                <Globe size={14} weight="bold" /> 3. Media & Tautan Proyek
              </h3>

              {/* Cover Image Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Gambar Cover / Screenshot Proyek
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {formData.cover_image && (
                    <div className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.cover_image}
                        alt="Preview Cover"
                        className="h-12 w-24 rounded-xl border-2 border-black bg-slate-900 object-cover shadow-md"
                      />
                    </div>
                  )}

                  <div className="flex-1 w-full">
                    {uploadMode === "url" ? (
                      <input
                        type="text"
                        value={formData.cover_image}
                        onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                        placeholder="https://... (URL Gambar Cover)"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDeviceFileUpload(file);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#1DB954] file:text-black file:font-bold file:text-xs hover:file:bg-[#1ed760] cursor-pointer"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        uploadMode === "url"
                          ? "bg-[#1DB954] text-black font-bold border-[#1DB954]"
                          : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white"
                      }`}
                    >
                      <LinkSimple size={14} weight="bold" /> URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                        uploadMode === "file"
                          ? "bg-[#1DB954] text-black font-bold border-[#1DB954]"
                          : "bg-white/[0.04] text-slate-400 border-white/10 hover:text-white"
                      }`}
                    >
                      <UploadSimple size={14} weight="bold" /> Upload File
                    </button>
                  </div>
                </div>
              </div>

              {/* External Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Teknologi Digunakan (Tech Stack) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.tech_stack}
                      onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                      placeholder="e.g. Next.js, Python, Tailwind"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 pl-9 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                    />
                    <Code size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Tautan Repositori GitHub
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 pl-9 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                    />
                    <GithubLogo size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Tautan Live Demo / Aplikasi
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.demo_url}
                      onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                      placeholder="https://my-app.vercel.app"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 pl-9 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                    />
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Tautan Profil Orbit Pembuat
                </label>
                <input
                  type="text"
                  value={formData.orbit_url}
                  onChange={(e) => setFormData({ ...formData, orbit_url: e.target.value })}
                  placeholder="https://... (Profil Orbit Pembuat)"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white font-mono focus:border-[#1DB954] focus:outline-none"
                />
              </div>
            </div>

            {/* Section 4: Deskripsi & Dokumentasi */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              <h3 className="text-xs font-mono font-bold text-[#1DB954] uppercase tracking-wider flex items-center gap-2">
                <Notebook size={14} weight="bold" /> 4. Deskripsi & Dokumentasi Lengkap
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Ringkasan Singkat Karya *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan 2-3 kalimat mengenai tujuan dan manfaat karya yang akan tampil di katalog..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white focus:border-[#1DB954] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Penjelasan & Dokumentasi Lengkap Karya
                </label>
                <textarea
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Jelaskan secara rinci latar belakang masalah, fitur utama, arsitektur sistem, serta tantangan dalam pembuatan karya..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs sm:text-sm text-white focus:border-[#1DB954] focus:outline-none leading-relaxed font-sans min-h-[220px]"
                />
              </div>
            </div>

            {/* Bottom Action Submit Button */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button
                variant="spotify"
                size="lg"
                disabled={isSubmitting}
                icon={<PaperPlaneTilt size={18} weight="fill" />}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Mengirimkan Karya..." : "Kirimkan Karya Sekarang"}
              </Button>
            </div>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
