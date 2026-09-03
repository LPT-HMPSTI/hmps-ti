import type { MetadataRoute } from "next";
import { fallbackNews, fallbackProjects } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmpsti-swu.vercel.app";
  const now = new Date();

  // Halaman Statis Utama
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/berita",
    "/karya",
    "/galeri",
    "/struktur",
    "/keanggotaan",
    "/visi-misi",
    "/kontak",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/berita" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Halaman Divisi (6 Divisi)
  const divisionRoutes: MetadataRoute.Sitemap = [
    "bph",
    "psdm",
    "lpt",
    "medkominfo",
    "humas",
    "kwu",
  ].map((slug) => ({
    url: `${siteUrl}/divisi/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Rute Dinamis Berita
  const newsRoutes: MetadataRoute.Sitemap = fallbackNews.map((item) => ({
    url: `${siteUrl}/berita/${item.slug || item.id}`,
    lastModified: item.created_at ? new Date(item.created_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Rute Dinamis Karya Mahasiswa
  const projectRoutes: MetadataRoute.Sitemap = fallbackProjects.map((item) => ({
    url: `${siteUrl}/karya/${item.slug || item.id}`,
    lastModified: item.created_at ? new Date(item.created_at) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...divisionRoutes, ...newsRoutes, ...projectRoutes];
}
