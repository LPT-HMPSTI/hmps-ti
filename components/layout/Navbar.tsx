"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CaretDown,
  List,
  X,
  CaretRight,
  ArrowSquareOut,
  Gauge,
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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  // Bersihkan timeout saat unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup mobile menu & dropdown saat route berubah
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(null);
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
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#0B0D14]/95 shadow-lg shadow-black/40 backdrop-blur-xl"
            : "border-b border-white/5 bg-[#0B0D14]/80 backdrop-blur-lg"
        }`}
      >
        <div className="relative mx-auto flex h-20 max-w-[1600px] items-center px-4 sm:px-6 lg:px-8">

          {/* ===== BRAND / LOGO (klik → beranda) ===== */}
          <Link href="/" className="group flex shrink-0 items-center gap-3 z-10">
            {/* Logo Badge */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 p-1 shadow-[0_0_20px_rgba(29,185,84,0.2)] transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(29,185,84,0.4)] group-hover:border-[#1DB954]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-hmpsti.webp"
                alt="Logo Resmi HMPSTI SWU"
                className="h-full w-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-110"
              />
              {/* Pulse dot */}
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954] animate-pulse" />
            </div>

            {/* Text Brand */}
            <div className="flex flex-col leading-none">
              <span className="font-mono font-extrabold tracking-widest text-white text-2xl uppercase transition-colors duration-200 group-hover:text-[#1DB954]">
                HMPS-TI
              </span>
              <span className="text-xs font-medium tracking-tight text-slate-400 transition-colors duration-200 group-hover:text-slate-300">
                STMIK Widya Utama
              </span>
            </div>
          </Link>

          {/* ===== MAIN NAV — Desktop (Centered Absolute) ===== */}
          {/* ===== MAIN NAV — Desktop (Centered Absolute) ===== */}
          <div
            ref={dropdownRef}
            className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 max-w-[calc(100%-450px)]"
          >
            <nav className="flex items-center gap-1 xl:gap-1.5 whitespace-nowrap">
              {/* Dashboard Admin Button (jika admin sedang login, ditaruh di sebelah kiri menu berita) */}
              {isAdminLoggedIn && (
                <Link
                  href="/admin"
                  prefetch={true}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[15px] whitespace-nowrap transition-all duration-200 ${
                    pathname.startsWith("/admin")
                      ? "text-[#1DB954] bg-[#1DB954]/10 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.06] font-semibold"
                  }`}
                >                  
                  <span className="whitespace-nowrap">Dashboard Admin</span>
                </Link>
              )}

              {navLinks.map((item) => {
                const hasChildren = !!item.children?.length;
                const isActive = isMenuActive(item);
                const isOpen = openDropdown === item.name;

                return (
                  <div 
                    key={item.name} 
                    className="relative shrink-0"
                    onMouseEnter={() => hasChildren && handleMouseEnter(item.name)}
                    onMouseLeave={() => hasChildren && handleMouseLeave()}
                  >
                    {hasChildren ? (
                      /* Dropdown trigger */
                      <button
                        type="button"
                        onClick={() => {
                          if (timeoutRef.current) clearTimeout(timeoutRef.current);
                          setOpenDropdown(isOpen ? null : item.name);
                        }}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[15px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "text-[#1DB954] bg-[#1DB954]/10 font-semibold"
                            : isOpen
                            ? "text-white bg-white/[0.08] font-semibold"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.06] font-semibold"
                        }`}
                        aria-expanded={isOpen}
                      >
                        <span className="whitespace-nowrap">{item.name}</span>
                        <CaretDown
                          size={15}
                          weight="bold"
                          className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    ) : (
                      /* Regular link */
                      <Link
                        href={item.href}
                        prefetch={true}
                        className={`flex items-center rounded-xl px-3.5 py-2 text-[15px] whitespace-nowrap transition-all duration-200 ${
                          isActive
                            ? "text-[#1DB954] bg-[#1DB954]/10 font-semibold"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.06] font-semibold"
                        }`}
                      >
                        <span className="whitespace-nowrap">{item.name}</span>
                      </Link>
                    )}

                    {/* Dropdown Panel */}
                    {hasChildren && isOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[60]">
                        {/* Invisible bridge to catch cursor movement seamlessly */}
                        <div className="absolute -top-2 inset-x-0 h-4 bg-transparent" />
                        <div className="min-w-[210px] rounded-2xl border border-white/10 bg-[#121520]/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                          {/* Dropdown glow accent */}
                          <div className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-[#1DB954]/50 to-transparent" />
                          {item.children!.map((child) => {
                            const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                prefetch={true}
                                onClick={() => {
                                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                  setOpenDropdown(null);
                                }}
                                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] transition-all duration-150 ${
                                  childActive
                                    ? "text-[#1DB954] bg-[#1DB954]/12 font-semibold border-l-2 border-[#1DB954]"
                                    : "text-slate-300 hover:text-white hover:bg-white/[0.06] font-medium"
                                }`}
                              >
                                {/* Dot warna untuk divisi */}
                                {"color" in child && child.color ? (
                                  <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${child.color} shrink-0`} />
                                ) : (
                                  <CaretRight
                                    size={12}
                                    weight="bold"
                                    className={childActive ? "text-[#1DB954]" : "text-slate-500"}
                                  />
                                )}
                                <span className="whitespace-nowrap">{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* ===== RIGHT ACTIONS ===== */}
          <div className="flex items-center gap-2 lg:gap-3 ml-auto z-10">

            {/* Admin Logout button (di sebelah kiri menu ORBIT) */}
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="hidden sm:flex items-center rounded-xl px-3.5 py-2 text-[15px] whitespace-nowrap font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
              >
                <span>Logout</span>
              </button>
            )}

            {/* ===== ORBIT (paling kanan, desktop) ===== */}
            <div
              className="relative hidden lg:block"
              onMouseEnter={() => handleMouseEnter('ORBIT')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setOpenDropdown(openDropdown === 'ORBIT' ? null : 'ORBIT');
                }}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 cursor-pointer transition-all duration-200 ${
                  openDropdown === 'ORBIT'
                    ? "bg-white/[0.08] border border-white/15"
                    : "border border-transparent hover:bg-white/[0.06] hover:border-white/10"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-orbit.png" alt="ORBIT Logo" className="w-6 h-6 object-contain" />
                <span className="text-[15px] font-bold text-white tracking-wide">ORBIT</span>
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`text-slate-300 transition-transform duration-200 ${
                    openDropdown === 'ORBIT' ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === 'ORBIT' && (
                <div className="absolute top-full right-0 pt-2 z-[60]">
                  <div className="absolute -top-2 inset-x-0 h-4 bg-transparent" />
                  <div className="min-w-[200px] rounded-2xl border border-white/10 bg-[#121520]/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-[#1DB954]/50 to-transparent" />
                    <Link
                      href="/orbit/tentang"
                      prefetch={true}
                      onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpenDropdown(null); }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all whitespace-nowrap"
                    >
                      <span>Tentang ORBIT</span>
                    </Link>
                    <a
                      href="https://orbit.hmpsti.site/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpenDropdown(null); }}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[#1DB954] hover:bg-[#1DB954]/10 transition-all whitespace-nowrap"
                    >
                      <span>Mari MengORBIT!</span>
                      <ArrowSquareOut size={16} className="ml-auto" />
                    </a>
                  </div>
                </div>
              )}
            </div>

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
                            isActive
                              ? "text-[#1DB954] bg-[#1DB954]/10 font-semibold"
                              : isMobileOpen
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
                                  prefetch={true}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                                    childActive
                                      ? "text-[#1DB954] bg-[#1DB954]/10 font-semibold"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {"color" in child && child.color ? (
                                    <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${child.color} shrink-0`} />
                                  ) : (
                                    <CaretRight size={10} weight="bold" className={childActive ? "text-[#1DB954] shrink-0" : "text-slate-500 shrink-0"} />
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
                        prefetch={true}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "text-[#1DB954] bg-[#1DB954]/10 font-semibold"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Menu ORBIT di Mobile */}
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setMobileOpenDropdown(mobileOpenDropdown === "ORBIT" ? null : "ORBIT")}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
                    mobileOpenDropdown === "ORBIT"
                      ? "text-[#1DB954] bg-[#1DB954]/10"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo-orbit.png" alt="ORBIT" className="w-5 h-5 object-contain" />
                    <span>ORBIT</span>
                  </div>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`transition-transform duration-200 ${mobileOpenDropdown === "ORBIT" ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileOpenDropdown === "ORBIT" && (
                  <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                    <Link
                      href="/orbit/tentang"
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-all"
                    >
                      <CaretRight size={10} weight="bold" className="text-slate-500 shrink-0" />
                      Tentang ORBIT
                    </Link>
                    <a
                      href="https://orbit.hmpsti.site/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-[#1DB954] hover:bg-[#1DB954]/10 transition-all"
                    >
                      <span>Mari MengORBIT!</span>
                      <ArrowSquareOut size={14} />
                    </a>
                  </div>
                )}
              </div>

              {/* Admin mobile */}
              {isAdminLoggedIn && (
                <div className="pt-2 border-t border-white/10 mt-2 flex flex-col gap-2">
                  <Link
                    href="/admin"
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:text-[#1DB954] hover:bg-white/[0.05] transition-all"
                  >
                    <Gauge size={16} weight="bold" className="text-[#1DB954]" />
                    Dashboard Admin
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleAdminLogout();
                    }}
                    className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
