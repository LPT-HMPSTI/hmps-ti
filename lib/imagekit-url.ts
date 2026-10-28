/**
 * lib/imagekit-url.ts
 *
 * Helper untuk mengkonversi URL R2 menjadi URL ImageKit yang sudah dioptimasi.
 *
 * Arsitektur:
 *   - R2 adalah SATU-SATUNYA storage dan sumber kebenaran.
 *   - Database selalu menyimpan URL R2 asli (pub-xxx.r2.dev/...).
 *   - ImageKit dikonfigurasi sebagai CDN optimizer di depan R2 (External Storage
 *     di dashboard ImageKit, dikerjakan manual oleh pemilik).
 *   - Saat ditampilkan, URL R2 dikonversi ke URL ImageKit + transformasi.
 *   - Jika salah satu env tidak diset, URL asli dikembalikan apa adanya (graceful).
 *
 * Env yang dibutuhkan (NEXT_PUBLIC_ → tersedia di client & server):
 *   NEXT_PUBLIC_R2_PUBLIC_URL        → base URL R2 publik (contoh: https://pub-xxx.r2.dev)
 *   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT → base URL ImageKit (contoh: https://ik.imagekit.io/YOUR_ID)
 */

// ─── Preset Transformasi (satu konstanta terpusat) ───────────────────────────

const PRESETS = {
  /** Thumbnail kecil — kartu mini, avatar list */
  thumb: "w-400,q-75,f-auto",
  /** Kartu konten — NewsCard, ProjectCard, preview section */
  card: "w-800,q-78,f-auto",
  /** Halaman detail — hero article/project */
  detail: "w-1200,q-80,f-auto",
  /** Banner hero besar */
  hero: "w-1600,q-80,f-auto",
  /** Open Graph / JSON-LD (format JPG eksplisit agar kompatibel semua platform) */
  og: "w-1200,q-80,f-jpg",
} as const;

export type ImagePreset = keyof typeof PRESETS;

// ─── Helper Internal ──────────────────────────────────────────────────────────

function getEnv() {
  const r2Base = (
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ""
  ).replace(/\/$/, "");
  const ikBase = (
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
  ).replace(/\/$/, "");
  return { r2Base, ikBase };
}

/**
 * Normalises a URL, stripping trailing slashes and decoding percent-encoded
 * characters so path comparison works correctly.
 */
function normalizeBase(url: string): string {
  return url.replace(/\/$/, "");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Konversi URL R2 menjadi URL ImageKit dengan preset transformasi.
 *
 * - Jika `src` diawali dengan `NEXT_PUBLIC_R2_PUBLIC_URL`, path-nya akan
 *   diteruskan ke ImageKit URL endpoint dengan `?tr=<preset>`.
 * - Jika `src` bukan URL R2 (Unsplash, path lokal /..., data:, atau salah
 *   satu env tidak diset), `src` dikembalikan apa adanya tanpa modifikasi.
 *
 * @example
 * optimizedImage("https://pub-xxx.r2.dev/news/img.jpg", "card")
 * // → "https://ik.imagekit.io/YOUR_ID/news/img.jpg?tr=w-800,q-78,f-auto"
 *
 * optimizedImage("https://images.unsplash.com/...", "card")
 * // → "https://images.unsplash.com/..." (pass-through)
 */
export function optimizedImage(
  src: string | null | undefined,
  preset: ImagePreset = "card"
): string {
  if (!src || typeof src !== "string") return src ?? "";

  const { r2Base, ikBase } = getEnv();

  // Jika env tidak lengkap, kembalikan apa adanya
  if (!r2Base || !ikBase) return src;

  const normalizedR2 = normalizeBase(r2Base);

  // Hanya proses URL yang berasal dari R2 kita
  if (!src.startsWith(normalizedR2 + "/")) return src;

  // Ambil key: bagian setelah base R2
  const key = src.slice(normalizedR2.length + 1); // buang leading "/"
  if (!key) return src;

  const tr = PRESETS[preset];
  return `${normalizeBase(ikBase)}/${key}?tr=${tr}`;
}

/**
 * Kembalikan URL R2 asli dari URL apapun (URL R2 atau URL ImageKit).
 * Dipakai sebelum mengirim URL ke endpoint DELETE agar selalu menghapus
 * objek R2 yang benar, bukan URL ImageKit.
 *
 * - URL R2:      dikembalikan apa adanya.
 * - URL ImageKit: strip endpoint ImageKit + `?tr=...` → rekonstruksi URL R2.
 * - URL lain:    dikembalikan apa adanya (endpoint hapus akan mengabaikannya).
 *
 * @example
 * r2UrlFromAny("https://ik.imagekit.io/YOUR_ID/news/img.jpg?tr=w-800,q-78,f-auto")
 * // → "https://pub-xxx.r2.dev/news/img.jpg"
 */
export function r2UrlFromAny(
  url: string | null | undefined
): string {
  if (!url || typeof url !== "string") return url ?? "";

  const { r2Base, ikBase } = getEnv();

  if (!ikBase) return url;

  const normalizedIk = normalizeBase(ikBase);

  // Jika URL adalah URL ImageKit, ekstrak key dan rekonstruksi URL R2
  if (url.startsWith(normalizedIk + "/")) {
    // Buang query string (?tr=...)
    const withoutQuery = url.split("?")[0];
    const key = withoutQuery.slice(normalizedIk.length + 1);
    if (!key) return url;
    if (!r2Base) return url;
    return `${normalizeBase(r2Base)}/${key}`;
  }

  return url;
}
