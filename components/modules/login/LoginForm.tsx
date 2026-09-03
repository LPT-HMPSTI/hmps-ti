"use client";

import React from "react";
import { Eye, EyeSlash, ArrowRight } from "@phosphor-icons/react";

export interface LoginFormProps {
  password: string;
  onPasswordChange: (val: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  errorMsg: string | null;
}

/**
 * Formulir login admin dengan input kata sandi, tombol intip sandi, dan status pemrosesan.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  onSubmit,
  loading,
  errorMsg,
}) => {
  return (
    <>
      {/* Error Message */}
      {errorMsg && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400 text-center font-mono">
          {errorMsg}
        </div>
      )}

      {/* Form Login Minimalis */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Kata Sandi</span>
            <span className="text-[10px] text-[#1DB954]">Default: admin123</span>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Password..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-slate-500 focus:border-[#1DB954] focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase bg-[#1DB954] text-black hover:bg-[#1ed760] transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{loading ? "Memproses..." : "Masuk"}</span>
          <ArrowRight size={14} weight="bold" />
        </button>
      </form>
    </>
  );
};
