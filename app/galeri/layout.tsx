import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi Kegiatan",
  description:
    "Dokumentasi visual foto dan momen penting perjalanan organisasi, workshop, seminar, dan keakraban HMPSTI STMIK Widya Utama.",
  openGraph: {
    title: "Galeri Kegiatan | HMPSTI SWU",
    description:
      "Dokumentasi visual foto dan momen penting perjalanan organisasi HMPSTI STMIK Widya Utama.",
  },
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
