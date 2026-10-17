/**
 * Helper Utility untuk mengunggah gambar ke Cloudflare R2 via API Route internal (/api/upload-image).
 * Digunakan oleh Backoffice Admin dan Halaman Publik (Showcase).
 */

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
 * Unggah file gambar ke Cloudflare R2.
 * @param file File gambar dari input perangkat
 * @param folder Sub-folder penyimpanan di R2 (contoh: "news", "avatars", "gallery", "projects", "divisions", "cabinet")
 * @returns URL publik gambar yang tersimpan di R2
 */
export async function uploadImageToR2(
  file: File,
  folder: string = "general"
): Promise<string> {
  if (!file) {
    throw new Error("File gambar tidak ditemukan.");
  }

  // Validasi format file
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Format file tidak didukung. Harap gunakan JPEG, PNG, WebP, GIF, atau SVG."
    );
  }

  // Validasi ukuran file
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
 * Menghapus satu atau beberapa file gambar dari Cloudflare R2 via API Route internal (/api/upload-image).
 * Aman dipanggil untuk URL non-R2 (seperti Unsplash) karena backend akan mengabaikannya secara aman.
 * @param urlOrUrls Satu URL string atau array URL string yang ingin dihapus
 * @returns boolean status keberhasilan
 */
export async function deleteImageFromR2(
  urlOrUrls: string | (string | null | undefined)[] | null | undefined
): Promise<boolean> {
  if (!urlOrUrls) return true;

  const urls = Array.isArray(urlOrUrls)
    ? urlOrUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0 && !u.startsWith("data:image"))
    : [urlOrUrls].filter((u): u is string => typeof u === "string" && u.trim().length > 0 && !u.startsWith("data:image"));

  if (urls.length === 0) return true;

  try {
    // Ambil tanda session admin yang sedang aktif di browser
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

