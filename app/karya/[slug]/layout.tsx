import type { Metadata } from "next";
import { fallbackProjects } from "@/constants";
import { fetchProjectsList } from "@/services";
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
  let project: any = fallbackProjects.find(
    (p) => p.slug === slug || p.id === slug
  );

  if (!project) {
    try {
      const list = await fetchProjectsList();
      project = list.find((p: any) => p.slug === slug || p.id === slug);
    } catch {
      // fallback jika gagal query
    }
  }

  if (!project) {
    return {
      title: "Karya Tidak Ditemukan",
      description: "Karya inovasi mahasiswa tidak ditemukan di showcase HMPS-TI SWU.",
    };
  }

  const title = project.title || "Detail Karya Mahasiswa";
  const description =
    project.description ||
    "Portofolio inovasi teknologi mahasiswa STMIK Widya Utama.";
  const rawImage = project.thumbnail_url || project.cover_image || "/logo-hmpsti.webp";
  const image = optimizedImage(rawImage, "og");

  return {
    title,
    description,
    openGraph: {
      title: `${title} | HMPS-TI SWU`,
      description,
      type: "website",
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

export default async function DetailKaryaLayout({
  children,
  params,
}: Props) {
  const { slug } = await params;
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://hmpsti-swu.vercel.app"
  ).replace(/\/$/, "");

  let project: any = fallbackProjects.find(
    (p) => p.slug === slug || p.id === slug
  );

  if (!project) {
    try {
      const list = await fetchProjectsList();
      project = list.find((p: any) => p.slug === slug || p.id === slug);
    } catch {
      // fallback
    }
  }

  const title = project?.title || "Detail Karya Mahasiswa";
  const description =
    project?.description ||
    "Portofolio inovasi teknologi mahasiswa STMIK Widya Utama.";
  const rawImage =
    project?.thumbnail_url || project?.cover_image || "/logo-hmpsti.webp";
  const image = optimizedImage(rawImage, "og");
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;
  const projectUrl = `${siteUrl}/karya/${encodeURIComponent(slug)}`;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": projectUrl,
    },
    "name": title,
    "headline": title,
    "description": description,
    "image": [fullImageUrl],
    "datePublished": project?.created_at || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": project?.author_name || "Mahasiswa Teknik Informatika",
    },
    "provider": {
      "@type": "Organization",
      "name": "HMPS-TI STMIK Widya Utama",
      "url": siteUrl,
    },
    ...(project?.demo_url ? { "url": project.demo_url } : {}),
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
        "name": "Karya",
        "item": `${siteUrl}/karya`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": projectUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
