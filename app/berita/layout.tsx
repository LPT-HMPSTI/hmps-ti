import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Berita & Event Kampus",
  description:
    "Pusat warta, rilis berita terbaru, agenda event kampus, dan pengumuman resmi HMPS-TI STMIK Widya Utama Purwokerto.",
  openGraph: {
    title: "Portal Berita & Event Kampus | HMPS-TI SWU",
    description:
      "Pusat warta, rilis berita terbaru, agenda event kampus, dan pengumuman resmi HMPS-TI STMIK Widya Utama Purwokerto.",
  },
};

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
