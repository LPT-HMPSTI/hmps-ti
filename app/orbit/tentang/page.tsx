"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Code,
  GitBranch,
  Trophy,
  Medal,
  ChatCircleText,
  CheckCircle,
  ShieldCheck,
  Globe,
  ArrowRight,
  Play,
  UserCheck,
  Lightning,
  Users,
  Sparkle,
  GraduationCap,
  RocketLaunch,
  InstagramLogo,
  Terminal,
} from "@phosphor-icons/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function TentangOrbitPage() {
  const features = [
    {
      icon: <Code size={26} className="text-[#1DB954]" />,
      title: "Showcase Repository",
      description:
        "Tampilkan repository GitHub terbaikmu lengkap dengan tag akademik (personal research, team project, coursework, dsb).",
    },
    {
      icon: <GitBranch size={26} className="text-cyan-400" />,
      title: "Activity Tracking Otomatis",
      description:
        "Setiap push, pull request, dan release yang kamu lakukan di GitHub tercatat otomatis lewat integrasi webhook, tanpa perlu update manual.",
    },
    {
      icon: <Trophy size={26} className="text-amber-400" />,
      title: "Leaderboard & Poin",
      description:
        "Kumpulkan poin dari aktivitas coding, kontribusi, dan konsistensi streak-mu. Sistem dilengkapi deteksi anti-spam dan anomali untuk menjaga keadilan peringkat.",
    },
    {
      icon: <Medal size={26} className="text-purple-400" />,
      title: "Badge Pencapaian",
      description:
        "Dapatkan badge sebagai penanda pencapaian tertentu di perjalanan coding-mu.",
    },
    {
      icon: <ChatCircleText size={26} className="text-pink-400" />,
      title: "Forum Diskusi per Repository",
      description:
        "Buka diskusi atau komentar langsung di setiap repository untuk berkolaborasi dan bertukar masukan dengan mahasiswa lain.",
    },
    {
      icon: <CheckCircle size={26} className="text-emerald-400" />,
      title: "Verifikasi Bahasa Pemrograman",
      description:
        "Sesama member bisa saling memverifikasi kemampuanmu di bahasa pemrograman tertentu.",
    },
    {
      icon: <ShieldCheck size={26} className="text-blue-400" />,
      title: "Identitas Pseudonim",
      description:
        "Kenyamanan terjaga: identitas asli hanya terlihat oleh sesama pengguna terdaftar.",
    },
    {
      icon: <Globe size={26} className="text-[#1DB954]" />,
      title: "Profil Publik",
      description:
        "Portofolio digital yang siap dibagikan ke recruiter maupun komunitas luas.",
    },
  ];

  const teamMembers = [
    { name: "Maulana Yusuf", role: "Lead Developer / Creator", isLead: true },
    { name: "Alhijra Mohammad Phasa Alisyahbana", role: "Tim LPT HMPS-TI", isLead: false },
    { name: "Arief Sidik Wijayanto", role: "Tim LPT HMPS-TI", isLead: false },
    { name: "Leovan Gamalia Nauli Butar Butar", role: "Tim LPT HMPS-TI", isLead: false },
    { name: "Nur Faizatun Nisa", role: "Tim LPT HMPS-TI", isLead: false },
  ];

  return (
    <main className="min-h-screen bg-[#0B0D14] text-white selection:bg-[#1DB954] selection:text-black">
      {/* 1. HERO SECTION WITH DIRECT BANNER OVERLAY */}
      <section className="relative min-h-[560px] sm:min-h-[640px] flex items-center py-16 sm:py-24 overflow-hidden border-b border-white/10">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/orbit-banner.png"
            alt="ORBIT Banner Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark Gradient Overlays for readable text over background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D14]/90 via-[#0B0D14]/70 to-[#0B0D14]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-[#0B0D14]/70" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center sm:text-left">
          <div className="max-w-3xl space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1DB954]/50 bg-[#0B0D14]/80 backdrop-blur-md px-4 py-1.5 text-xs font-mono font-bold tracking-wider text-[#1DB954] uppercase shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#1DB954] animate-pulse" />
              OFFICIAL PLATFORM HMPS-TI
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                ORBIT
              </h1>
              <p className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1DB954] tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                Open Repository Base for Informatic Talents
              </p>
            </div>

            {/* Tagline & Subtext */}
            <div className="space-y-3">
              <p className="text-lg sm:text-2xl font-bold text-slate-100 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                &ldquo;Showcase your code, build your future.&rdquo;
              </p>
              <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-2xl">
                Platform mahasiswa STMIK Widya Utama untuk menampilkan proyek open source, berkolaborasi dengan sesama mahasiswa, dan membangun portofolio profesional.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <a
                href="https://orbit.hmpsti.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] px-8 py-4 text-base font-extrabold text-black transition-all duration-300 shadow-[0_0_35px_rgba(29,185,84,0.5)] hover:scale-105"
              >
                <span>Jelajahi ORBIT</span>
                <Play size={18} weight="fill" />
              </a>
              <a
                href="https://orbit.hmpsti.site/members"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-[#0B0D14]/70 hover:bg-white/20 px-8 py-4 text-base font-bold text-white transition-all duration-300 backdrop-blur-md hover:border-white/50 shadow-lg"
              >
                <span>Browse Members</span>
                <Code size={20} weight="bold" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LATAR BELAKANG & TUJUAN */}
      <section className="py-16 bg-white/[0.01] border-y border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-3">
            <Badge variant="spotify" className="uppercase font-mono">
              LATAR BELAKANG
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kenapa ORBIT Hadir?
            </h2>
          </div>

          <GlassCard glowColor="spotify" className="p-6 sm:p-10 rounded-3xl space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed border border-white/10">
            <p>
              Perkembangan teknologi digital menuntut mahasiswa untuk tidak hanya memahami teori, tetapi juga memiliki keterampilan praktis dan kemampuan membangun project nyata. Sayangnya, banyak karya coding mahasiswa yang berhenti di laptop masing-masing tanpa pernah ditampilkan atau diketahui orang lain.
            </p>
            <p className="text-white font-medium border-l-4 border-[#1DB954] pl-4 py-1 bg-[#1DB954]/5 rounded-r-xl">
              ORBIT hadir sebagai jawaban atas kebutuhan itu — sebuah platform yang dikembangkan oleh HMPS-TI STMIK Widya Utama untuk menjadi wadah bagi mahasiswa menampilkan project dan repository GitHub yang dimiliki, sekaligus mendorong budaya berbagi karya, kolaborasi, dan pengembangan open source di lingkungan kampus.
            </p>
            <p>
              Melalui ORBIT, mahasiswa tidak hanya belajar coding, tapi juga belajar membangun jejak digital dan portofolio yang bisa dibawa ke dunia kerja.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 3. UNTUK SIAPA PLATFORM INI */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="cyan" className="uppercase font-mono">
              AKSESIBILITAS PLATFORM
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Terbuka untuk Seluruh Mahasiswa SWU
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Meskipun dikembangkan oleh HMPS-TI, ORBIT bukan hanya untuk mahasiswa Teknik Informatika. Platform ini terbuka untuk <strong className="text-white">seluruh mahasiswa STMIK Widya Utama</strong>, baik dari Program Studi Teknik Informatika maupun Sistem Informasi, yang ingin menampilkan karya dan membangun portofolio digital mereka.
            </p>
          </div>

          {/* 2 Program Studi Badges / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <GlassCard glowColor="cyan" className="p-8 rounded-3xl border border-white/10 flex items-center gap-5 group hover:border-cyan-400/50 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-400 group-hover:scale-110 transition-transform">
                <Terminal size={32} weight="bold" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 uppercase tracking-wider">
                  PROGRAM STUDI
                </span>
                <h3 className="text-2xl font-black text-white">Teknik Informatika</h3>
                <p className="text-xs text-slate-400">Software Engineering, AI, Web & Mobile Dev</p>
              </div>
            </GlassCard>

            <GlassCard glowColor="yellow" className="p-8 rounded-3xl border border-white/10 flex items-center gap-5 group hover:border-amber-400/50 transition-all">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-110 transition-transform">
                <GraduationCap size={32} weight="bold" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                  PROGRAM STUDI
                </span>
                <h3 className="text-2xl font-black text-white">Sistem Informasi</h3>
                <p className="text-xs text-slate-400">Business Systems, Data Analytics, UI/UX & DB</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 4. FITUR-FITUR UTAMA */}
      <section id="fitur" className="py-20 bg-white/[0.01] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="spotify" className="uppercase font-mono">
              FITUR UNGGULAN
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Apa yang Bisa Kamu Lakukan di ORBIT?
            </h2>
            <p className="text-slate-400 text-base">
              Berbagai fitur inovatif dirancang khusus untuk mendukung perkembangan ekosistem coding mahasiswa SWU.
            </p>
          </div>

          {/* Grid 8 Fitur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <GlassCard
                key={idx}
                glowColor="spotify"
                className="p-6 rounded-3xl border border-white/10 hover:border-[#1DB954]/50 transition-all duration-300 space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1DB954]/10 transition-all">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#1DB954] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CARA BERGABUNG */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge variant="spotify" className="uppercase font-mono">
              PANDUAN CEPAT
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Mulai dalam 2 Langkah
            </h2>
          </div>

          {/* 2 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard glowColor="spotify" className="p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-4 group">
              <span className="text-7xl font-black font-mono text-[#1DB954]/20 absolute top-4 right-6 pointer-events-none group-hover:text-[#1DB954]/30 transition-colors">
                01
              </span>
              <div className="h-12 w-12 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954]">
                <UserCheck size={26} weight="bold" />
              </div>
              <h3 className="text-xl font-bold text-white">Login dengan akun MySWU (SIAKAD)</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Digunakan hanya untuk verifikasi bahwa kamu adalah mahasiswa aktif STMIK Widya Utama secara aman dan terverifikasi.
              </p>
            </GlassCard>

            <GlassCard glowColor="cyan" className="p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-4 group">
              <span className="text-7xl font-black font-mono text-cyan-400/20 absolute top-4 right-6 pointer-events-none group-hover:text-cyan-400/30 transition-colors">
                02
              </span>
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <GitBranch size={26} weight="bold" />
              </div>
              <h3 className="text-xl font-bold text-white">Hubungkan Akun GitHub-mu</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                ORBIT akan otomatis mulai melacak aktivitas coding, commit, serta menampilkan repository pilihanmu secara real-time.
              </p>
            </GlassCard>
          </div>

          {/* Bottom Step text & CTA */}
          <div className="text-center space-y-6 pt-4">
            <p className="text-base text-slate-300 max-w-xl mx-auto">
              Setelah itu, kamu tinggal lengkapi profil, atur showcase repo favoritmu, dan mulai berkolaborasi dengan komunitas.
            </p>
            <a
              href="https://orbit.hmpsti.site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] px-8 py-4 text-base font-bold text-black transition-all shadow-[0_0_30px_rgba(29,185,84,0.4)] hover:scale-105"
            >
              <span>Kunjungi ORBIT</span>
              <ArrowRight size={18} weight="bold" />
            </a>
          </div>
        </div>
      </section>

      {/* 6. TIM PENGEMBANG */}
      <section className="py-16 bg-white/[0.01] border-y border-white/5 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="spotify" className="uppercase font-mono">
              KONTRIBUTOR &amp; TIM
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dibalik Layar ORBIT
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              ORBIT dikembangkan oleh <strong className="text-white font-bold">Maulana Yusuf</strong>, developer yang berkolaborasi dengan HMPS-TI dalam membangun platform ini dari nol, bersama tim <strong className="text-[#1DB954]">Divisi LPT (Literasi dan Pengembangan Teknologi) HMPS-TI</strong>:
            </p>
          </div>

          {/* Team Members List / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {teamMembers.map((m, idx) => (
              <GlassCard
                key={idx}
                glowColor={m.isLead ? "spotify" : "cyan"}
                className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                  m.isLead
                    ? "border-[#1DB954]/50 bg-[#1DB954]/5 lg:col-span-1"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="h-12 w-12 mx-auto rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-bold text-white">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{m.name}</h4>
                  <p className="text-[11px] font-mono text-[#1DB954] mt-0.5">{m.role}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed pt-2">
            Proyek ini dikembangkan menggunakan tech stack modern dengan infrastruktur VPS dan domain yang disiapkan khusus untuk mendukung keberlanjutan platform dalam jangka panjang.
          </p>
        </div>
      </section>

      {/* 7. PENCAAPAIAN & STATUS */}
      <section className="py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-4 max-w-3xl">
            <Badge variant="yellow" className="uppercase font-mono">
              STATUS SAAT INI
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ORBIT Hari Ini
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              ORBIT resmi dikembangkan dan diluncurkan sebagai bagian dari program <strong className="text-white">SkillUp Class dan ORBIT</strong> yang berlangsung Juni–Agustus 2026. Sejak diluncurkan, ORBIT terus digunakan sebagai wadah bagi mahasiswa SWU untuk menampilkan karya, membangun portofolio, dan berkolaborasi dalam ekosistem open source kampus — dan akan terus dikembangkan secara bertahap sesuai kebutuhan pengguna.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <GlassCard glowColor="spotify" className="p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#1DB954]">100+</span>
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Mahasiswa SWU</p>
            </GlassCard>

            <GlassCard glowColor="cyan" className="p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">250+</span>
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Repositories</p>
            </GlassCard>

            <GlassCard glowColor="yellow" className="p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">1,500+</span>
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Commits Tracked</p>
            </GlassCard>

            <GlassCard glowColor="magenta" className="p-5 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-pink-400">100%</span>
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Open Source</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION PENUTUP */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard glowColor="spotify" className="p-10 sm:p-16 rounded-3xl border border-[#1DB954]/30 bg-gradient-to-b from-[#121820] to-[#0B0D14] text-center space-y-8 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-[#1DB954]/20 rounded-full blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px]" />

            <div className="space-y-4 max-w-2xl mx-auto relative z-10">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase">
                Siap Tunjukkan Karyamu?
              </h2>
              <p className="text-slate-300 text-base sm:text-lg">
                Jangan biarkan project keren kamu cuma tersimpan sendirian. Gabung sekarang dan jadi bagian dari komunitas open source mahasiswa SWU.
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center justify-center gap-4 relative z-10">
              <a
                href="https://orbit.hmpsti.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] px-10 py-4 text-lg font-extrabold text-black transition-all duration-300 shadow-[0_0_40px_rgba(29,185,84,0.5)] hover:scale-105"
              >
                <span>orbit.hmpsti.site</span>
                <ArrowRight size={22} weight="bold" />
              </a>

              <p className="text-xs text-slate-400 pt-2 flex items-center gap-2 justify-center">
                <span>Info lebih lanjut: Instagram HMPS-TI</span>
                <a
                  href="https://instagram.com/hmpsti.swu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1DB954] font-semibold hover:underline flex items-center gap-1"
                >
                  <InstagramLogo size={14} weight="bold" />
                  @hmpsti.swu
                </a>
              </p>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
