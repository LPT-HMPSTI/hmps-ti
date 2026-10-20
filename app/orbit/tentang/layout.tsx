import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://hmpsti-swu.vercel.app").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Tentang Orbit — Platform Portofolio Mahasiswa TI",
  description:
    "Orbit adalah platform portofolio digital eksklusif untuk mahasiswa Teknik Informatika STMIK Widya Utama. Showcase karya, repository, dan profil profesional dalam satu tempat.",
  openGraph: {
    title: "Tentang Orbit | HMPS-TI SWU",
    description:
      "Orbit adalah platform portofolio digital eksklusif untuk mahasiswa Teknik Informatika STMIK Widya Utama. Showcase karya, repository, dan profil profesional dalam satu tempat.",
    url: `${siteUrl}/orbit/tentang`,
    images: [
      {
        url: `${siteUrl}/logo-orbit.png`,
        width: 1200,
        height: 630,
        alt: "Orbit — Platform Portofolio Mahasiswa TI STMIK Widya Utama",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Orbit | HMPS-TI SWU",
    description:
      "Orbit adalah platform portofolio digital eksklusif untuk mahasiswa Teknik Informatika STMIK Widya Utama.",
    images: [`${siteUrl}/logo-orbit.png`],
  },
};

export default function TentangOrbitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
