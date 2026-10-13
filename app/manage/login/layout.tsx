import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Console Pengurus",
  description: "Portal autentikasi khusus pengurus dan admin HMPS-TI SWU.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
