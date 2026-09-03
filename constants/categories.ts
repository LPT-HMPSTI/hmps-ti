import { DivisionSlug } from "@/types";

/**
 * Daftar kategori artikel berita yang tersedia di portal HMPSTI SWU.
 */
export const NEWS_CATEGORIES = [
  "Informasi",
  "Akademik",
  "Prestasi",
  "Pengumuman",
  "Teknologi",
  "Workshop",
] as const;

/**
 * Daftar kategori event atau agenda kegiatan mahasiswa.
 */
export const EVENT_CATEGORIES = [
  "Workshop",
  "Event",
  "Webinar",
  "Kompetisi",
  "Makrab",
  "Seminar",
] as const;

/**
 * Kategori karya inovasi mahasiswa di halaman showcase.
 */
export const PROJECT_CATEGORIES = [
  "Web Application",
  "Mobile App",
  "Artificial Intelligence",
  "IoT & Hardware",
  "UI/UX Design",
] as const;

/**
 * Kategori album dokumentasi kegiatan galeri himpunan.
 */
export const GALLERY_CATEGORIES = [
  "MAKRAB & INAUGURASI",
  "WORKSHOP & SEMINAR",
  "STUDI EKSKURSI",
  "LOMBA & PRESTASI",
] as const;

/**
 * Topik pilihan aspirasi mahasiswa saat mengisi formulir masukan.
 */
export const ASPIRASI_TOPICS = [
  "Akademik & Kurikulum",
  "Fasilitas & Lab",
  "Kegiatan & Event",
  "Kritik & Saran Organisasi",
  "Lainnya",
] as const;

/**
 * Profil lengkap 6 divisi kepengurusan HMPSTI STMIK Widya Utama.
 */
export interface DivisionMeta {
  slug: DivisionSlug;
  name: string;
  shortName: string;
  color: string;
  accent: string;
  description: string;
}

export const DIVISIONS: DivisionMeta[] = [
  {
    slug: "bph",
    name: "Badan Pengurus Harian",
    shortName: "BPH",
    color: "from-emerald-400 to-[#1DB954]",
    accent: "#1DB954",
    description: "Pengarah strategis, penanggung jawab umum, tata kelola administrasi dan keuangan organisasi himpunan.",
  },
  {
    slug: "psdm",
    name: "Pengembangan Sumber Daya Mahasiswa",
    shortName: "PSDM",
    color: "from-blue-400 to-indigo-500",
    accent: "#3B82F6",
    description: "Kaderisasi berkala, peningkatan karakter kepemimpinan, dan pengembangan soft-skill mahasiswa Teknik Informatika.",
  },
  {
    slug: "lpt",
    name: "Literasi & Pengembangan Teknologi",
    shortName: "LPT",
    color: "from-cyan-400 to-teal-500",
    accent: "#06B6D4",
    description: "Riset terapan, workshop pemrograman web & mobile, artificial intelligence, dan pengembangan sistem TI kampus.",
  },
  {
    slug: "medkominfo",
    name: "Media, Komunikasi & Informasi",
    shortName: "MEDKOMINFO",
    color: "from-purple-400 to-pink-500",
    accent: "#A855F7",
    description: "Publikasi visual, pengelolaan media sosial, branding grafis, fotografi, dan komunikasi publik himpunan.",
  },
  {
    slug: "humas",
    name: "Hubungan Masyarakat",
    shortName: "HUMAS",
    color: "from-amber-400 to-orange-500",
    accent: "#F59E0B",
    description: "Jejaring relasi eksternal, kemitraan instansi teknologi, alumni, dan pengabdian masyarakat berbasis teknologi.",
  },
  {
    slug: "kwu",
    name: "Kewirausahaan",
    shortName: "KWU",
    color: "from-rose-400 to-red-500",
    accent: "#F43F5E",
    description: "Pengembangan kemandirian finansial organisasi, merchandise resmi, dan inkubasi technopreneurship mahasiswa.",
  },
];
