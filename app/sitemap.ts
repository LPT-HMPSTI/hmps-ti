import type { MetadataRoute } from "next";
import { fallbackNews, fallbackProjects } from "@/constants";
import { fetchNewsList, fetchProjectsList } from "@/services";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://hmpsti-swu.vercel.app").replace(/\/$/, "");

  // 1. Halaman Statis Publik Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/berita`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/karya`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/karya/submit`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/galeri`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/struktur`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/keanggotaan`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/visi-misi`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/kontak`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/orbit/tentang`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Halaman Profil 6 Divisi
  const divisionSlugs = ["bph", "psdm", "lpt", "medkominfo", "humas", "kwu"];
  const divisionRoutes: MetadataRoute.Sitemap = divisionSlugs.map((slug) => ({
    url: `${siteUrl}/divisi/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 3. Rute Dinamis Berita & Agenda (fetch live dari DB / fallback)
  let newsList: { id: string; slug?: string; created_at?: string }[] = fallbackNews;
  try {
    const liveNews = await fetchNewsList();
    if (liveNews && liveNews.length > 0) {
      newsList = liveNews;
    }
  } catch {
    // fallback to static list
  }

  const newsRoutes: MetadataRoute.Sitemap = newsList.map((item) => ({
    url: `${siteUrl}/berita/${encodeURIComponent(item.slug || item.id)}`,
    ...(item.created_at ? { lastModified: new Date(item.created_at) } : {}),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 4. Rute Dinamis Showcase Karya Mahasiswa
  let projectList: { id: string; slug?: string; created_at?: string }[] = fallbackProjects;
  try {
    const liveProjects = await fetchProjectsList();
    if (liveProjects && liveProjects.length > 0) {
      projectList = liveProjects;
    }
  } catch {
    // fallback to static list
  }

  const projectRoutes: MetadataRoute.Sitemap = projectList.map((item) => ({
    url: `${siteUrl}/karya/${encodeURIComponent(item.slug || item.id)}`,
    ...(item.created_at ? { lastModified: new Date(item.created_at) } : {}),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...divisionRoutes, ...newsRoutes, ...projectRoutes];
}
