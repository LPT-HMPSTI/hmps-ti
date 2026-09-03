"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoginHeader, LoginForm } from "@/components/modules/login";

/**
 * Halaman Otentikasi Login Admin HMPSTI SWU.
 * Mengorkestrasi sesi backoffice dan verifikasi passcode pengurus.
 */
export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Bersihkan sesi lama dan periksa jika sesi aktif sudah ada
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hmpsti_admin_session");
      const activeSession = sessionStorage.getItem("hmpsti_admin_session");
      if (activeSession === "authenticated") {
        router.replace("/admin");
      }
    }
  }, [router]);

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg(null);

      // Verifikasi Passcode Admin (Default passcode: admin123 / hmpsti2026)
      if (password === "admin123" || password === "hmpsti2026") {
        sessionStorage.setItem("hmpsti_admin_session", "authenticated");
        localStorage.removeItem("hmpsti_admin_session");
        router.replace("/admin");
      } else {
        setLoading(false);
        setErrorMsg("Kata sandi tidak valid. Silakan periksa kembali.");
      }
    },
    [password, router]
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <GlassCard glowColor="spotify" className="p-8 space-y-6 border-white/10 bg-[#121520]/90">
          <LoginHeader />
          <LoginForm
            password={password}
            onPasswordChange={setPassword}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((prev) => !prev)}
            onSubmit={handleLogin}
            loading={loading}
            errorMsg={errorMsg}
          />
        </GlassCard>
      </motion.div>
    </div>
  );
}
