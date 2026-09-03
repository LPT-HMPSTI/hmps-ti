import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Backoffice Admin",
  description: "Panel manajemen konten dan kontrol operasional website HMPSTI SWU.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
