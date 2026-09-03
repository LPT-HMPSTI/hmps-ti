import type { Metadata } from "next";
import { fallbackNews } from "@/constants";
import { fetchNewsList } from "@/services";

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
      description: "Artikel yang dicari tidak ditemukan di portal HMPSTI SWU.",
    };
  }

  const title = article.title || "Detail Berita & Agenda Kegiatan";
  const description =
    article.excerpt ||
    (article.content ? article.content.substring(0, 160) : "") ||
    "Warta kegiatan resmi HMPSTI STMIK Widya Utama.";
  const image = article.cover_image || "/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | HMPSTI SWU`,
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
      title: `${title} | HMPSTI SWU`,
      description,
      images: [image],
    },
  };
}

export default function DetailBeritaLayout({ children }: Props) {
  return children;
}
