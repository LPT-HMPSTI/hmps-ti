import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmpsti-swu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HMPSTI STMIK Widya Utama | Official Portal & Student Hub",
    template: "%s | HMPSTI SWU",
  },
  description:
    "Portal Resmi Himpunan Mahasiswa Teknik Informatika (HMTI/HMPSTI) STMIK Widya Utama Purwokerto. Pusat Berita, Karya Mahasiswa, & Direct Portal Akses Kampus.",
  keywords: [
    "HMTI",
    "HMPSTI",
    "STMIK Widya Utama",
    "Teknik Informatika",
    "SWU",
    "Purwokerto",
    "Karya Mahasiswa",
    "Komunitas IT Kampus",
    "Organisasi Mahasiswa",
  ],
  authors: [{ name: "HMPSTI STMIK Widya Utama", url: "https://stmik-widya-utama.ac.id" }],
  icons: {
    icon: "/logo-hmpsti.webp",
    apple: "/logo-hmpsti.webp",
  },
  creator: "HMPSTI STMIK Widya Utama",
  publisher: "STMIK Widya Utama",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "HMPSTI STMIK Widya Utama | Official Portal & Student Hub",
    description:
      "Portal Resmi Himpunan Mahasiswa Teknik Informatika STMIK Widya Utama Purwokerto. Pusat Berita, Karya Mahasiswa, & Direct Portal Akses Kampus.",
    siteName: "HMPSTI STMIK Widya Utama",
  },
  twitter: {
    card: "summary_large_image",
    title: "HMPSTI STMIK Widya Utama | Official Portal & Student Hub",
    description:
      "Portal Resmi Himpunan Mahasiswa Teknik Informatika STMIK Widya Utama Purwokerto. Pusat Berita, Karya Mahasiswa, & Direct Portal Akses Kampus.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#0B0D14] text-[#FFFFFF] font-sans antialiased selection:bg-[#1DB954]/30 selection:text-[#1DB954]"
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
