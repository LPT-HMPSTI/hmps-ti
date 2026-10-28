/**
 * Helper Utility untuk mengunggah dan menghapus gambar via API Route internal (/api/upload-image).
 *
 * Alur Upload:
 *   Browser → /api/upload-image (POST) → Cloudflare R2 (storage utama)
 *   → URL R2 publik dikembalikan → disimpan di database Supabase
 *
 * Alur Delete:
 *   Browser → /api/upload-image (DELETE) → objek dihapus dari R2
 *   → cache ImageKit di-purge sebagai best-effort (jika IMAGEKIT_PRIVATE_KEY diset)
 *
 * Catatan: Database SELALU menyimpan URL R2 asli. ImageKit hanya CDN optimizer
 *          di depan R2, dikonfigurasi manual di dashboard ImageKit sebagai External
 *          Storage. Konversi URL R2 → ImageKit terjadi di helper lib/imagekit-url.ts
 *          saat rendering, bukan saat upload/simpan.
 */

import { r2UrlFromAny } from "./imagekit-url";

export interface UploadImageResult {
  success: boolean;
  url: string;
  key?: string;
  error?: string;
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Unggah file gambar ke Cloudflare R2 melalui API Route internal.
 * Mengembalikan URL R2 publik yang langsung bisa disimpan ke database.
 *
 * @param file File gambar dari input perangkat
 * @param folder Sub-folder di R2 (contoh: "news", "avatars", "gallery", "projects", "divisions", "cabinet")
 * @returns URL publik R2 dari gambar yang terunggah
 */
export async function uploadImageToR2(
  file: File,
  folder: string = "general"
): Promise<string> {
  if (!file) {
    throw new Error("File gambar tidak ditemukan.");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Format file tidak didukung. Harap gunakan JPEG, PNG, WebP, GIF, atau SVG."
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      "Ukuran file terlalu besar! Maksimal ukuran file adalah 10MB."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Gagal membaca respons dari server unggah gambar.");
  }

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Gagal mengunggah gambar ke server.");
  }

  return data.url;
}

/**
 * Menghapus satu atau beberapa file gambar dari Cloudflare R2.
 * Aman dipanggil dengan URL non-R2 (Unsplash, lokal) — backend mengabaikannya.
 * Setelah dihapus dari R2, cache ImageKit di-purge secara best-effort di server.
 *
 * @param urlOrUrls URL R2 (atau URL ImageKit — backend akan meng-ekstrak key R2)
 * @returns boolean status keberhasilan penghapusan
 */
export async function deleteImageFromR2(
  urlOrUrls: string | (string | null | undefined)[] | null | undefined
): Promise<boolean> {
  if (!urlOrUrls) return true;

  const rawList = Array.isArray(urlOrUrls) ? urlOrUrls : [urlOrUrls];
  const urls = rawList
    .filter(
      (u): u is string =>
        typeof u === "string" &&
        u.trim().length > 0 &&
        !u.startsWith("data:image")
    )
    .map((u) => r2UrlFromAny(u.trim()));

  if (urls.length === 0) return true;

  try {
    let adminToken = "authenticated";
    if (typeof window !== "undefined") {
      const activeSession = sessionStorage.getItem("hmpsti_admin_session");
      if (activeSession) adminToken = activeSession;
    }

    const res = await fetch("/api/upload-image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-auth": adminToken,
      },
      body: JSON.stringify({ urls }),
    });

    const data = await res.json().catch(() => ({}));
    return Boolean(data.success);
  } catch (err) {
    console.warn("deleteImageFromR2 error (non-fatal):", err);
    return false;
  }
}
