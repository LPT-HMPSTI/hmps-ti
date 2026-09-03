"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export const ADMIN_SESSION_KEY = "hmpsti_admin_session";

export interface UseAdminSessionReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

/**
 * Hook untuk proteksi sesi autentikasi Admin CMS.
 * Menggunakan sessionStorage sehingga sesi otomatis berakhir saat tab/browser ditutup,
 * mencegah akses tak terotorisasi di sesi berikutnya.
 */
export function useAdminSession(): UseAdminSessionReturn {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return;

    // Bersihkan residu persistensi lama agar selalu taat pada session
    localStorage.removeItem(ADMIN_SESSION_KEY);

    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    const valid = session === "authenticated";
    setIsAuthenticated(valid);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [checkAuth]);

  const login = (password: string): boolean => {
    if (typeof window === "undefined") return false;

    // Password admin default website
    if (password === "admin123" || password === "hmpsti2026") {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
