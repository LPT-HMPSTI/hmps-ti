/**
 * Menu navigasi utama website (Top Navbar).
 * Mendukung children untuk dropdown menu.
 */
export const MAIN_NAV_LINKS = [
  {
    name: "Berita & Agenda",
    href: "/berita",
  },
  {
    name: "Tentang HMPS-TI",
    href: "#",
    children: [
      { name: "Visi & Misi", href: "/visi-misi" },
      { name: "Struktur Organisasi", href: "/struktur" },
      { name: "Keanggotaan", href: "/keanggotaan" },
      { name: "Galeri Kegiatan", href: "/galeri" },
    ],
  },
  {
    name: "Showcase Karya",
    href: "/karya",
  },
  {
    name: "Divisi HMPS-TI",
    href: "#",
    children: [
      { name: "BPH", href: "/divisi/bph", color: "from-cyan-500 to-blue-500" },
      { name: "PSDM", href: "/divisi/psdm", color: "from-emerald-500 to-teal-500" },
      { name: "LPT", href: "/divisi/lpt", color: "from-cyan-400 to-emerald-400" },
      { name: "MEDKOMINFO", href: "/divisi/medkominfo", color: "from-purple-500 to-cyan-400" },
      { name: "HUMAS", href: "/divisi/humas", color: "from-blue-400 to-emerald-400" },
      { name: "KWU", href: "/divisi/kwu", color: "from-amber-400 to-emerald-500" },
    ],
  },
  {
    name: "Kontak & Aspirasi",
    href: "/kontak",
  },
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
