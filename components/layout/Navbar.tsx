"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MagnifyingGlass, ArrowSquareOut, List, X, CaretLeft, CaretRight, SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

import { MAIN_NAV_LINKS } from "@/constants";

interface NavbarProps {
  onOpenDirectLink: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDirectLink }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hmpsti_admin_session");
      }
      const session = sessionStorage.getItem("hmpsti_admin_session");
      setIsAdminLoggedIn(session === "authenticated");
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const handleAdminLogout = () => {
    sessionStorage.removeItem("hmpsti_admin_session");
    localStorage.removeItem("hmpsti_admin_session");
    setIsAdminLoggedIn(false);
    router.push("/login");
  };

  const navLinks = MAIN_NAV_LINKS;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-white/10 bg-[#0B0D14]/90 px-4 backdrop-blur-xl lg:pl-4 lg:pr-8 shadow-md shadow-black/40">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left: Mobile Brand Logo, History Buttons & Search Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xl">
          <Link href="/" className="flex items-center lg:hidden shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-1 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-hmpsti.webp" alt="Logo Resmi HMPSTI" className="h-full w-full object-contain" />
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => window.history.back()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 transition-colors hover:bg-white/[0.12] hover:text-white cursor-pointer"
              aria-label="Kembali"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              onClick={() => window.history.forward()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 transition-colors hover:bg-white/[0.12] hover:text-white cursor-pointer"
              aria-label="Maju"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berita, karya mahasiswa, atau divisi HMPSTI..."
              className="w-full rounded-full border border-white/10 bg-white/[0.05] py-2 pl-10 pr-8 text-xs text-white placeholder-slate-400 backdrop-blur-md transition-all focus:border-[#1DB954] focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
            />
            <MagnifyingGlass size={18} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono z-10 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions & Spotify Styled Navbar Logout */}
        <div className="flex items-center gap-3">
          <Badge variant="cyan" tilt="left" className="hidden xl:inline-flex">
            STMIK Widya Utama
          </Badge>

          {/* Spotify Styled Navbar Logout Button */}
          {isAdminLoggedIn && (
            <Button
              variant="glass"
              size="sm"
              icon={<SignOut size={15} weight="bold" />}
              onClick={handleAdminLogout}
              className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
            >
              <span className="hidden sm:inline">Keluar Admin</span>
            </Button>
          )}

          {/* Developing */}
          {/* <Button
            variant="spotify"
            size="sm"
            icon={<ArrowSquareOut size={16} weight="bold" />}
            onClick={onOpenDirectLink}
            className="hidden sm:inline-flex"
          >
            Direct Portal
          </Button> */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 lg:hidden hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-white/10 bg-[#0B0D14]/95 p-4 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  pathname === link.href ? "text-[#1DB954] bg-white/[0.06]" : "text-slate-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {isAdminLoggedIn && (
                <Button
                  variant="glass"
                  size="sm"
                  className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10"
                  icon={<SignOut size={16} weight="bold" />}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAdminLogout();
                  }}
                >
                  Keluar Admin (Logout)
                </Button>
              )}
              <Button
                variant="spotify"
                size="sm"
                className="w-full"
                icon={<ArrowSquareOut size={16} weight="bold" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDirectLink();
                }}
              >
                Buka Direct Portal Menu
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
