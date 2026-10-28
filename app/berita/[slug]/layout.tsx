import type { Metadata } from "next";
import { fallbackNews } from "@/constants";
import { fetchNewsList } from "@/services";
import { optimizedImage } from "@/lib/imagekit-url";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let article: any = fallbackNews.find(
    (a) => a.slug === slug || a.id === slug
  );

  if (!article) {
    try {
      const list = await fetchNewsList();
      article = list.find((a: any) => a.slug === slug || a.id === slug);
    } catch {
      // fallback jika gagal query
    }
  }

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      description: "Artikel yang dicari tidak ditemukan di portal HMPS-TI SWU.",
    };
  }

  const title = article.title || "Detail Berita & Agenda Kegiatan";
  const description =
    article.excerpt ||
    (article.content ? article.content.substring(0, 160) : "") ||
    "Warta kegiatan resmi HMPS-TI STMIK Widya Utama.";
  const rawImage = article.cover_image || "/logo-hmpsti.webp";
  const image = optimizedImage(rawImage, "og");

  return {
    title,
    description,
    openGraph: {
      title: `${title} | HMPS-TI SWU`,
      description,
      type: "article",
      publishedTime: article.created_at || article.date,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HMPS-TI SWU`,
      description,
      images: [image],
    },
  };
}

export default async function DetailBeritaLayout({
  children,
  params,
}: Props) {
  const { slug } = await params;
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://hmpsti-swu.vercel.app"
  ).replace(/\/$/, "");

  let article: any = fallbackNews.find(
    (a) => a.slug === slug || a.id === slug
  );

  if (!article) {
    try {
      const list = await fetchNewsList();
      article = list.find((a: any) => a.slug === slug || a.id === slug);
    } catch {
      // fallback
    }
  }

  const title = article?.title || "Detail Berita & Agenda Kegiatan";
  const description =
    article?.excerpt ||
    (article?.content ? article.content.substring(0, 160) : "") ||
    "Warta kegiatan resmi HMPS-TI STMIK Widya Utama.";
  const rawImage = article?.cover_image || "/logo-hmpsti.webp";
  const image = optimizedImage(rawImage, "og");
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  const articleUrl = `${siteUrl}/berita/${encodeURIComponent(slug)}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "headline": title,
    "description": description,
    "image": [fullImageUrl],
    "datePublished": article?.created_at || new Date().toISOString(),
    "dateModified":
      article?.updated_at || article?.created_at || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name":
        article?.author_name || article?.author || "HMPS-TI STMIK Widya Utama",
      "url": siteUrl,
    },
    "publisher": {
      "@type": "Organization",
      "name": "HMPS-TI STMIK Widya Utama",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo-hmpsti.webp`,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Berita",
        "item": `${siteUrl}/berita`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
