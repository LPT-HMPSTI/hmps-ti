"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoginHeader, LoginForm } from "@/components/modules/login";
import { loginAdminUser } from "@/services/adminUsers.service";

/**
 * Halaman Otentikasi Login Admin HMPSTI SWU.
 * Login dengan username & password yang diverifikasi ke tabel admin_users di Supabase.
 */
export default function LoginPage() {
  const [username, setUsername] = useState("");
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
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMsg(null);

      const result = await loginAdminUser(username.trim(), password);

      if (result.success && result.user) {
        // Simpan sesi dengan info user
        sessionStorage.setItem("hmpsti_admin_session", "authenticated");
        sessionStorage.setItem(
          "hmpsti_admin_user",
          JSON.stringify({
            id: result.user.id,
            username: result.user.username,
            keterangan: result.user.keterangan,
            role: result.user.role,
          })
        );
        localStorage.removeItem("hmpsti_admin_session");
        router.replace("/admin");
      } else {
        setLoading(false);
        setErrorMsg(result.error || "Username atau kata sandi tidak valid.");
      }
    },
    [username, password, router]
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
            username={username}
            onUsernameChange={setUsername}
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
