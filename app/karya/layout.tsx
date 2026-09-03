import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase Karya & Inovasi Mahasiswa",
  description:
    "Kumpulan portofolio produk digital, aplikasi web, mobile, IoT, dan riset teknologi karya mahasiswa Teknik Informatika STMIK Widya Utama.",
  openGraph: {
    title: "Showcase Karya Mahasiswa | HMPSTI SWU",
    description:
      "Kumpulan portofolio produk digital, aplikasi web, mobile, IoT, dan riset teknologi karya mahasiswa Teknik Informatika STMIK Widya Utama.",
  },
};

export default function KaryaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
