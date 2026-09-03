import type { Metadata } from "next";

const divisionTitles: Record<string, { name: string; desc: string }> = {
  bph: {
    name: "Badan Pengurus Harian (BPH)",
    desc: "Sentral manajemen, tata kelola, perumusan visi, dan pengambil kebijakan strategis HMPSTI SWU.",
  },
  psdm: {
    name: "Divisi PSDM",
    desc: "Kaderisasi, pengembangan softskill, upgrading kapasitas pengurus, dan iklim keakraban internal anggota.",
  },
  lpt: {
    name: "Divisi LPT (Litbang)",
    desc: "Pengembangan riset teknologi, pelatihan coding mahasiswa, dan inovasi piranti lunak himpunan.",
  },
  medkominfo: {
    name: "Divisi MEDKOMINFO",
    desc: "Sentral publikasi visual, pengelolaan media sosial, branding grafis, dan dokumentasi resmi organisasi.",
  },
  humas: {
    name: "Divisi HUMAS",
    desc: "Jembatan komunikasi eksternal kampus, kemitraan industri, sponsorship, dan relasi antar himpunan.",
  },
  kwu: {
    name: "Divisi KWU (Kewirausahaan)",
    desc: "Pengembangan kemandirian finansial himpunan melalui official merchandise dan inkubasi usaha kreatif mahasiswa.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = (slug || "bph").toLowerCase();
  const info = divisionTitles[key] || {
    name: `Divisi ${key.toUpperCase()}`,
    desc: "Profil divisi kepengurusan HMPSTI STMIK Widya Utama.",
  };

  return {
    title: info.name,
    description: info.desc,
    openGraph: {
      title: `${info.name} | HMPSTI SWU`,
      description: info.desc,
    },
  };
}

export default function ProfilDivisiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
