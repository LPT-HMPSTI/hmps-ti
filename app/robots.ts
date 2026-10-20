import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://hmpsti-swu.vercel.app").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/manage", "/manage/*", "/api/*"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: ["/manage", "/manage/*", "/api/*"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

