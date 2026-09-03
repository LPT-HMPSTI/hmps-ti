import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Berita & Event Kampus",
  description:
    "Pusat warta, rilis berita terbaru, agenda event kampus, dan pengumuman resmi HMPSTI STMIK Widya Utama Purwokerto.",
  openGraph: {
    title: "Portal Berita & Event Kampus | HMPSTI SWU",
    description:
      "Pusat warta, rilis berita terbaru, agenda event kampus, dan pengumuman resmi HMPSTI STMIK Widya Utama Purwokerto.",
  },
};

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
