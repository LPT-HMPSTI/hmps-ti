import type { Metadata } from "next";
import { fallbackProjects } from "@/constants";
import { fetchProjectsList } from "@/services";

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
      description: "Karya inovasi mahasiswa tidak ditemukan di showcase HMPSTI SWU.",
    };
  }

  const title = project.title || "Detail Karya Mahasiswa";
  const description =
    project.description ||
    "Portofolio inovasi teknologi mahasiswa STMIK Widya Utama.";
  const image = project.thumbnail_url || project.cover_image || "/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | HMPSTI SWU`,
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
      title: `${title} | HMPSTI SWU`,
      description,
      images: [image],
    },
  };
}

export default function DetailKaryaLayout({ children }: Props) {
  return children;
}
