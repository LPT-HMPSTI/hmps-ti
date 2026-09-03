import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi & Kepengurusan",
  description:
    "Bagan struktur kepengurusan resmi HMPSTI STMIK Widya Utama, susunan Badan Pengurus Harian (BPH), dan koordinator 6 divisi.",
  openGraph: {
    title: "Struktur Organisasi | HMPSTI SWU",
    description:
      "Bagan struktur kepengurusan resmi HMPSTI STMIK Widya Utama, susunan BPH, dan divisi himpunan.",
  },
};

export default function StrukturLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
