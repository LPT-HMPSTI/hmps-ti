import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi Kegiatan",
  description:
    "Dokumentasi visual foto dan momen penting perjalanan organisasi, workshop, seminar, dan keakraban HMPS-TI STMIK Widya Utama.",
  openGraph: {
    title: "Galeri Kegiatan | HMPS-TI SWU",
    description:
      "Dokumentasi visual foto dan momen penting perjalanan organisasi HMPS-TI STMIK Widya Utama.",
  },
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
