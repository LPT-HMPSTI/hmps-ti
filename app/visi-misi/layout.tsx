import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi & Misi Organisasi",
  description:
    "Visi, misi, prinsip kerja, dan arah strategis HMPSTI STMIK Widya Utama dalam mewujudkan himpunan mahasiswa yang inovatif dan berdaya saing global.",
  openGraph: {
    title: "Visi & Misi | HMPSTI SWU",
    description:
      "Visi dan arah strategis HMPSTI STMIK Widya Utama dalam mewujudkan himpunan mahasiswa yang inovatif.",
  },
};

export default function VisiMisiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
