/**
 * Menu navigasi utama website yang tampil pada Navbar dan drawer mobile.
 */
export const MAIN_NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Berita", href: "/berita" },
  { name: "Visi & Misi", href: "/visi-misi" },
  { name: "Struktur", href: "/struktur" },
  { name: "Keanggotaan", href: "/keanggotaan" },
  { name: "Karya", href: "/karya" },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
] as const;

/**
 * Tautan pintas ke portal dan sistem akademik resmi STMIK Widya Utama.
 */
export const CAMPUS_PORTALS = [
  {
    name: "SIAKAD",
    category: "Akademik",
    url: "https://siakad.stmik-widya-utama.ac.id",
    description: "Sistem Informasi Akademik, KRS online, dan kartu hasil studi mahasiswa.",
    icon: "GraduationCap",
  },
  {
    name: "E-Learning",
    category: "Perkuliahan",
    url: "https://elearning.stmik-widya-utama.ac.id",
    description: "Portal perkuliahan daring, materi kuliah, tugas, dan ujian mahasiswa.",
    icon: "BookOpen",
  },
  {
    name: "Website SWU",
    category: "Portal Resmi",
    url: "https://stmik-widya-utama.ac.id",
    description: "Portal resmi kampus STMIK Widya Utama Purwokerto.",
    icon: "Globe",
  },
  {
    name: "PMB Online",
    category: "Pendaftaran",
    url: "https://pmb.stmik-widya-utama.ac.id",
    description: "Penerimaan Mahasiswa Baru STMIK Widya Utama.",
    icon: "IdentificationCard",
  },
  {
    name: "Perpustakaan",
    category: "Referensi",
    url: "https://perpus.stmik-widya-utama.ac.id",
    description: "E-Library, repositori skripsi, jurnal, dan karya ilmiah mahasiswa.",
    icon: "Bookmarks",
  },
  {
    name: "Tracer Study",
    category: "Karir",
    url: "https://tracer.stmik-widya-utama.ac.id",
    description: "Pusat karir, jejaring alumni, dan survei penyerapan lulusan kerja.",
    icon: "Briefcase",
  },
] as const;
