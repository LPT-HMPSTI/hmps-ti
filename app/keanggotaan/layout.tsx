import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direktori Keanggotaan & Alumni",
  description:
    "Pangkalan data direktori profil mahasiswa aktif dan jejaring alumni Teknik Informatika STMIK Widya Utama Purwokerto.",
  openGraph: {
    title: "Direktori Keanggotaan & Alumni | HMPSTI SWU",
    description:
      "Pangkalan data direktori profil mahasiswa aktif dan alumni Teknik Informatika STMIK Widya Utama.",
  },
};

export default function KeanggotaanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
