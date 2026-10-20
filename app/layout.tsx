import type { Metadata } from "next";
import Script from "next/script";
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
    default: "HMPS-TI STMIK Widya Utama | Official Portal & Student Hub",
    template: "%s | HMPS-TI SWU",
  },
  description:
    "Portal Resmi Himpunan Mahasiswa Teknik Informatika (HMTI/HMPS-TI) STMIK Widya Utama Purwokerto. Pusat Berita, Karya Mahasiswa, & Direct Portal Akses Kampus.",
  keywords: [
    "HMTI",
    "HMPS-TI",
    "STMIK Widya Utama",
    "Teknik Informatika",
    "SWU",
    "Purwokerto",
    "Karya Mahasiswa",
    "Komunitas IT Kampus",
    "Organisasi Mahasiswa",
  ],
  authors: [{ name: "HMPS-TI STMIK Widya Utama", url: "https://stmik-widya-utama.ac.id" }],
  icons: {
    icon: "/logo-hmpsti.webp",
    apple: "/logo-hmpsti.webp",
  },
  creator: "HMPS-TI STMIK Widya Utama",
  publisher: "STMIK Widya Utama",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    title: "HMPS-TI STMIK Widya Utama | Official Portal & Student Hub",
    description:
      "Portal Resmi Himpunan Mahasiswa Teknik Informatika STMIK Widya Utama Purwokerto. Pusat Berita, Karya Mahasiswa, & Direct Portal Akses Kampus.",
    siteName: "HMPS-TI STMIK Widya Utama",
    images: [
      {
        url: `${siteUrl}/logo-hmpsti.webp`,
        width: 1200,
        height: 630,
        alt: "HMPS-TI STMIK Widya Utama — Portal Resmi Himpunan Mahasiswa Teknik Informatika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMPS-TI STMIK Widya Utama | Official Portal & Student Hub",
    description:
      "Portal Resmi Himpunan Mahasiswa Teknik Informatika STMIK Widya Utama Purwokerto. Pusat Berita, Karya Mahasiswa, & Direct Portal Akses Kampus.",
    images: [`${siteUrl}/logo-hmpsti.webp`],
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
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src={
              process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
              "https://cloud.umami.is/script.js"
            }
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  "name": "HMPS-TI STMIK Widya Utama",
                  "alternateName": ["HMTI SWU", "HMPS-TI SWU", "Himpunan Mahasiswa Teknik Informatika STMIK Widya Utama"],
                  "url": siteUrl,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${siteUrl}/logo-hmpsti.webp`,
                    "width": 512,
                    "height": 512,
                  },
                  "parentOrganization": {
                    "@type": "CollegeOrUniversity",
                    "name": "STMIK Widya Utama Purwokerto",
                    "url": "https://stmik-widya-utama.ac.id",
                  },
                  "sameAs": [
                    "https://www.instagram.com/hmps_ti_swu",
                    "https://github.com/hmps-ti-swu",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  "url": siteUrl,
                  "name": "HMPS-TI STMIK Widya Utama",
                  "description":
                    "Portal Resmi Himpunan Mahasiswa Teknik Informatika STMIK Widya Utama Purwokerto. Pusat Berita, Karya Mahasiswa, & Direct Portal Akses Kampus.",
                  "publisher": {
                    "@id": `${siteUrl}/#organization`,
                  },
                  "inLanguage": "id-ID",
                },
              ],
            }),
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
