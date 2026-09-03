"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export default function ProfilDivisiPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "bph";
  const slug = rawSlug.toLowerCase();

  const divisionData: Record<string, any> = {
    bph: {
      name: "BPH",
      short: "BPH",
      tagline: "Sentral Manajemen & Pengambil Kebijakan Strategis HMPSTI SWU",
      desc: "Bertanggung jawab atas tata kelola, perumusan visi organisasi, administrasi persuratan, serta pengawasan keuangan himpunan.",
      roles: ["Ketua Umum", "Wakil Ketua Umum", "Sekretaris 1 & 2", "Bendahara 1 & 2"],
      proker: [
        { title: "Rapat Kerja Pengurus (Raker) 2026", status: "SELESAI", date: "Januari 2026", variant: "spotify" },
        { title: "Laporan Pertanggungjawaban Tengah Periode", status: "BERJALAN", date: "Juli 2026", variant: "cyan" },
        { title: "Musyawarah Anggota (MUSANG) HMPS-TI", status: "MENDATANG", date: "Desember 2026", variant: "yellow" },
      ],
      members: [
        { name: "Muhammad Rizky Pratama", role: "Ketua Umum", nim: "220101001" },
        { name: "Fadhil Syahputra", role: "Wakil Ketua", nim: "220101002" },
        { name: "Siti Nurhaliza", role: "Sekretaris 1", nim: "220101005" },
        { name: "Ahmad Bagus Trio", role: "Bendahara 1", nim: "220101008" },
      ],
    },
    psdm: {
      name: "PSDM",
      short: "PSDM",
      tagline: "Kaderisasi, Upgrading & Menjaga Keakraban Internal Anggota",
      desc: "Fokus pada pengembangan karakter kepemimpinan mahasiswa baru, upgrading keahlian softskill, dan iklim keakraban antar angkatan.",
      roles: ["Kepala Divisi PSDM", "Staff Kaderisasi", "Staff Upgrading"],
      proker: [
        { title: "Inaugurasi & Makrab TI 2026", status: "MENDATANG", date: "Oktober 2026", variant: "yellow" },
        { title: "Upgrading Soft-Skill & Leadership", status: "SELESAI", date: "Maret 2026", variant: "spotify" },
        { title: "Gathering Keakraban Lintas Angkatan", status: "BERJALAN", date: "Setiap Bulan", variant: "cyan" },
      ],
      members: [
        { name: "Andi Saputra", role: "Kepala Divisi PSDM", nim: "220101015" },
        { name: "Dinda Permata", role: "Staff Kaderisasi", nim: "230101045" },
        { name: "Reza Rahardian", role: "Staff Internal", nim: "230101050" },
      ],
    },
    lpt: {
      name: "LPT",
      short: "LPT",
      tagline: "Riset Teknologi, Pelatihan Koding & Kompetisi Software",
      desc: "Pusat riset dan pelatihan skill teknis mahasiswa (Next.js, Python, Supabase, AI, DevOps) serta pendampingan lomba coding.",
      roles: ["Kepala Divisi LPT", "Mentor Web Dev", "Mentor AI & IoT"],
      proker: [
        { title: "Workshop Next.js 15 & Supabase", status: "SELESAI", date: "Agustus 2026", variant: "spotify" },
        { title: "National Tech Summit & Hackathon", status: "MENDATANG", date: "September 2026", variant: "yellow" },
        { title: "Coding Bootcamp Rutin Akhir Pekan", status: "BERJALAN", date: "Setiap Minggu", variant: "cyan" },
      ],
      members: [
        { name: "Aditya Pratama", role: "Kepala Divisi LPT", nim: "220101010" },
        { name: "Deni Irawan", role: "Mentor Web", nim: "220101012" },
        { name: "Gita Gutawa", role: "Mentor AI", nim: "230101099" },
      ],
    },
    kwu: {
      name: "KWU",
      short: "KWU",
      tagline: "Penggalangan Dana, Merchandise Resmi & Kemandirian Finansial",
      desc: "Pengelolaan usaha mandiri himpunan, penjualan merchandise eksklusif (Jaket Himpunan, Kaos), serta kemitraan sponsorship.",
      roles: ["Kepala Divisi KWU", "Manager Merchandise", "Staff Penjualan"],
      proker: [
        { title: "Pre-Order Jaket Himpunan Batch 1", status: "SELESAI", date: "Juni 2026", variant: "spotify" },
        { title: "Bazar Entrepreneurship Kampus", status: "MENDATANG", date: "Desember 2026", variant: "yellow" },
        { title: "Kantin Kejujuran HMPS-TI", status: "BERJALAN", date: "Harian", variant: "cyan" },
      ],
      members: [
        { name: "Rina Kartika", role: "Kepala Divisi KWU", nim: "220101030" },
        { name: "Hendra Setiawan", role: "Manager Merch", nim: "230101022" },
      ],
    },
    medkominfo: {
      name: "MEDKOMINFO",
      short: "MEDKOMINFO",
      tagline: "Branding Visual, Pengelolaan Sosmed & Publikasi Digital",
      desc: "Menangani identitas visual branding HMPSTI SWU, pembuatan konten feeds Instagram, video dokumentasi, serta pengelolaan website.",
      roles: ["Kepala Divisi MEDKOMINFO", "UI/UX Designer", "Video Editor & Copywriter"],
      proker: [
        { title: "Redesign Website Resmi HMPSTI (Frost-Cyber)", status: "SELESAI", date: "Agustus 2026", variant: "spotify" },
        { title: "Workshop Visual Design Figma", status: "SELESAI", date: "Mei 2026", variant: "spotify" },
        { title: "Publikasi Konten Feeds & Reels Daily", status: "BERJALAN", date: "Setiap Hari", variant: "cyan" },
      ],
      members: [
        { name: "Bimo Wicaksono", role: "Kepala Divisi MEDKOMINFO", nim: "220101040" },
        { name: "Fifi Alawiyah", role: "Staff Graphic Design", nim: "240101012" },
      ],
    },
    humas: {
      name: "HUMAS",
      short: "HUMAS",
      tagline: "Kemitraan Eksternal, Studi Banding & Pengabdian Masyarakat",
      desc: "Menghubungkan HMPSTI SWU dengan birokrasi kampus, himpunan universitas lain, serta kegiatan sosial pengabdian masyarakat.",
      roles: ["Kepala Divisi HUMAS", "Staff Eksternal", "Staff Pengabdian"],
      proker: [
        { title: "Studi Banding Ke HMPS-TI Universitas Mitra", status: "SELESAI", date: "April 2026", variant: "spotify" },
        { title: "Bakti Sosial & Donor Darah SWU", status: "MENDATANG", date: "November 2026", variant: "yellow" },
        { title: "Penyaluran Aspirasi Mahasiswa", status: "BERJALAN", date: "Setiap Saat", variant: "cyan" },
      ],
      members: [
        { name: "Taufik Hidayat", role: "Kepala Divisi Humas", nim: "220101055" },
        { name: "Indah Permatasari", role: "Staff Eksternal", nim: "230101066" },
      ],
    },
  };

  const currentDiv = divisionData[slug] || divisionData.bph;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      <Link href="/struktur">
        <Button variant="glass" size="sm" icon={<ArrowLeft size={16} />} iconPosition="left">
          Kembali ke Struktur Organisasi
        </Button>
      </Link>

      {/* Clean Hero Banner Divisi */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#121520] p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 space-y-3">
          <Badge variant="spotify" tilt="left">
            DIVISI {currentDiv.short}
          </Badge>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
            {currentDiv.name}
          </h1>
          <p className="text-sm font-mono text-[#1DB954] font-semibold">{currentDiv.tagline}</p>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {currentDiv.desc}
          </p>
        </div>
      </div>

      {/* Program Kerja Section */}
      <div className="space-y-6">
        <div>
          <Badge variant="cyan" tilt="left">
            WORK PROGRAM
          </Badge>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Program Kerja Divisi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentDiv.proker.map((item: any, idx: number) => (
            <GlassCard key={idx} glowColor="emerald" className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#1DB954] font-bold">{item.date}</span>
                <Badge variant={item.variant as any} tilt="right">
                  {item.status}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Anggota Divisi */}
      <div className="space-y-6">
        <div>
          <Badge variant="yellow" tilt="left">
            TEAM MEMBERS
          </Badge>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Susunan Pengurus Divisi</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentDiv.members.map((m: any, idx: number) => (
            <GlassCard key={idx} glowColor="cyan" className="p-5 text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954]/20 text-[#1DB954] font-mono font-bold mx-auto border border-[#1DB954]/40">
                <Users size={20} />
              </div>
              <h3 className="text-sm font-bold text-white">{m.name}</h3>
              <p className="text-xs text-[#1DB954] font-semibold">{m.role}</p>
              <p className="text-[10px] font-mono text-slate-500">NIM: {m.nim}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
