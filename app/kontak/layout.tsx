import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak & Kotak Aspirasi Mahasiswa",
  description:
    "Kanal komunikasi resmi sekretariat HMPSTI STMIK Widya Utama dan wadah aspirasi daring bagi seluruh mahasiswa Teknik Informatika.",
  openGraph: {
    title: "Kontak & Kotak Aspirasi | HMPSTI SWU",
    description:
      "Kanal komunikasi resmi sekretariat HMPSTI STMIK Widya Utama dan wadah aspirasi daring mahasiswa.",
  },
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
