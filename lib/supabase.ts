import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Memastikan kredensial URL dan Anon Key Supabase valid serta terhubung ke endpoint resmi.
 */
export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes("placeholder") &&
  supabaseUrl.startsWith("https://");

/**
 * Instance client Supabase utama aplikasi.
 * Bernilai null bila environment variable belum dikonfigurasi.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper timeout pelindung agar permintaan data ke Supabase tidak hang jika jaringan lambat.
 */
export async function withTimeout<T>(promiseLike: PromiseLike<T>, ms = 3000): Promise<T> {
  let timer: any;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Supabase request timeout")), ms);
  });
  return Promise.race([Promise.resolve(promiseLike), timeout]).finally(() => clearTimeout(timer));
}

// ==========================================
// CENTRAL RE-EXPORTS (FOR BACKWARDS COMPATIBILITY)
// ==========================================
export * from "@/constants";
export * from "@/services";
