"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  CaretDown,
  List,
  X,
  CaretRight,
  SignOut,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MAIN_NAV_LINKS } from "@/constants";

// Type helper untuk mutable menu
type NavChild = { name: string; href: string; color?: string };
type NavItem = {
  name: string;
  href: string;
  children?: readonly NavChild[];
};

interface NavbarProps {
  onOpenDirectLink: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDirectLink }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll listener untuk efek backdrop
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth check
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

  // Tutup dropdown saat klik luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup mobile menu saat route berubah
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileOpenDropdown(null);
  }, [pathname]);

  const handleAdminLogout = () => {
    sessionStorage.removeItem("hmpsti_admin_session");
    localStorage.removeItem("hmpsti_admin_session");
    setIsAdminLoggedIn(false);
    router.push("/login");
  };

  const navLinks = MAIN_NAV_LINKS as readonly NavItem[];

  // Cek apakah suatu menu (termasuk children-nya) sedang aktif
  const isMenuActive = (item: NavItem): boolean => {
    if (item.href !== "#" && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"));
    }
    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#0B0D14]/95 shadow-lg shadow-black/40 backdrop-blur-xl"
            : "border-b border-white/5 bg-[#0B0D14]/80 backdrop-blur-lg"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* ===== BRAND / LOGO (klik → beranda) ===== */}
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            {/* Logo Badge */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-1 shadow-[0_0_20px_rgba(29,185,84,0.2)] transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(29,185,84,0.4)] group-hover:border-[#1DB954]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-hmpsti.webp"
                alt="Logo Resmi HMPSTI SWU"
                className="h-full w-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-110"
              />
              {/* Pulse dot */}
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954] animate-pulse" />
            </div>

            {/* Text Brand */}
            <div className="flex flex-col leading-none">
              <span className="font-mono font-extrabold tracking-widest text-white text-lg uppercase transition-colors duration-200 group-hover:text-[#1DB954]">
                HMPS-TI
              </span>
              <span className="text-[10px] font-medium tracking-tight text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
                STMIK Widya Utama
              </span>
            </div>
          </Link>

          {/* ===== MAIN NAV — Desktop ===== */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const hasChildren = !!item.children?.length;
              const isActive = isMenuActive(item);
              const isOpen = openDropdown === item.name;

              return (
                <div key={item.name} className="relative">
                  {hasChildren ? (
                    /* Dropdown trigger */
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                        isActive || isOpen
                          ? "text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/25"
                          : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{item.name}</span>
                      <CaretDown
                        size={13}
                        weight="bold"
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    /* Regular link */
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
                        isActive
                          ? "text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/25"
                          : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Dropdown Panel */}
                  {hasChildren && isOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] rounded-2xl border border-white/10 bg-[#121520]/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Dropdown glow accent */}
                      <div className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-[#1DB954]/50 to-transparent" />
                      {item.children!.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium transition-all duration-150 ${
                              childActive
                                ? "text-[#1DB954] bg-[#1DB954]/10"
                                : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                            }`}
                          >
                            {/* Dot warna untuk divisi */}
                            {"color" in child && child.color ? (
                              <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${child.color} shrink-0`} />
                            ) : (
                              <CaretRight
                                size={10}
                                weight="bold"
                                className={childActive ? "text-[#1DB954]" : "text-slate-500"}
                              />
                            )}
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ===== RIGHT ACTIONS ===== */}
          <div className="flex items-center gap-2.5">
            {/* Search (tersembunyi di mobile kecil) */}
            <div className="relative hidden md:block transition-all duration-300 w-40 lg:w-48 xl:w-56 focus-within:w-48 lg:focus-within:w-56 xl:focus-within:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari..."
                className="w-full rounded-full border border-white/10 bg-white/[0.05] py-1.5 pl-9 pr-7 text-xs text-white placeholder-slate-500 backdrop-blur-md transition-all focus:border-[#1DB954] focus:bg-white/[0.08] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
              />
              <MagnifyingGlass
                size={15}
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none z-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer z-10"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Badge kampus */}
            <Badge variant="cyan" tilt="left" className="hidden xl:inline-flex shrink-0">
              STMIK Widya Utama
            </Badge>

            {/* Admin Logout */}
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

            {/* Hamburger (mobile) */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 lg:hidden hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </div>

        {/* ===== MOBILE MENU DRAWER ===== */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-50 border-b border-white/10 bg-[#0B0D14]/98 backdrop-blur-2xl lg:hidden shadow-2xl">
            <div className="flex flex-col p-4 gap-1">
              {/* Search mobile */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita, karya, divisi..."
                  className="w-full rounded-full border border-white/10 bg-white/[0.05] py-2 pl-10 pr-8 text-xs text-white placeholder-slate-400 focus:border-[#1DB954] focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                />
                <MagnifyingGlass size={16} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1DB954] pointer-events-none" />
              </div>

              {navLinks.map((item) => {
                const hasChildren = !!item.children?.length;
                const isActive = isMenuActive(item);
                const isMobileOpen = mobileOpenDropdown === item.name;

                return (
                  <div key={item.name}>
                    {hasChildren ? (
                      <>
                        {/* Accordion trigger */}
                        <button
                          onClick={() => setMobileOpenDropdown(isMobileOpen ? null : item.name)}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
                            isActive || isMobileOpen
                              ? "text-[#1DB954] bg-[#1DB954]/10"
                              : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                          }`}
                        >
                          <span>{item.name}</span>
                          <CaretDown
                            size={14}
                            weight="bold"
                            className={`transition-transform duration-200 ${isMobileOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Accordion content */}
                        {isMobileOpen && (
                          <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                            {item.children!.map((child) => {
                              const childActive = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                                    childActive
                                      ? "text-[#1DB954]"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {"color" in child && child.color ? (
                                    <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${child.color} shrink-0`} />
                                  ) : (
                                    <CaretRight size={10} weight="bold" className="text-slate-500 shrink-0" />
                                  )}
                                  {child.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "text-[#1DB954] bg-[#1DB954]/10"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Admin logout mobile */}
              {isAdminLoggedIn && (
                <div className="pt-2 border-t border-white/10 mt-2">
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
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
