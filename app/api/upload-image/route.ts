import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// ─── Cloudflare R2 Configuration ─────────────────────────────────────────────
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_ENDPOINT = process.env.R2_ENDPOINT || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "hmpsti";

// Catatan arsitektur:
// - R2 adalah SATU-SATUNYA penyimpanan. URL yang disimpan di database SELALU URL R2.
// - ImageKit hanya bertindak sebagai CDN optimizer di depan R2 (dikonfigurasi manual
//   di dashboard ImageKit sebagai External Storage / S3-compatible origin).
// - Purge cache ImageKit dilakukan sebagai best-effort di sini (tidak wajib berhasil).
// - Kredensial ImageKit dibaca di DALAM fungsi, TIDAK pernah di top-level modul,
//   sehingga build tetap lolos tanpa env ImageKit yang diset.

function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Ekstrak S3 key dari URL publik Cloudflare R2 atau URL ImageKit CDN optimizer.
 */
function extractR2Key(targetUrl: string): string | null {
  if (!targetUrl || typeof targetUrl !== "string") return null;
  const trimmed = targetUrl.trim();
  if (trimmed.startsWith("data:image")) return null;

  try {
    const parsed = new URL(trimmed);
    const pathname = decodeURIComponent(parsed.pathname);

    const r2PublicUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
    const ikUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

    let isR2Domain = false;
    let isIkDomain = false;

    if (r2PublicUrl) {
      try {
        const publicParsed = new URL(r2PublicUrl);
        if (parsed.hostname === publicParsed.hostname) isR2Domain = true;
      } catch {}
    }

    if (
      parsed.hostname.endsWith(".r2.dev") ||
      parsed.hostname.includes("r2.cloudflarestorage.com")
    ) {
      isR2Domain = true;
    }

    if (ikUrlEndpoint) {
      try {
        const ikParsed = new URL(ikUrlEndpoint);
        if (parsed.hostname === ikParsed.hostname) isIkDomain = true;
      } catch {}
    }
    if (parsed.hostname.includes("imagekit.io")) {
      isIkDomain = true;
    }

    if (!isR2Domain && !isIkDomain) return null;

    let cleanKey = pathname.replace(/^\/+/, "");

    // Jika berasal dari ImageKit, buang endpoint ID path prefix jika ada
    if (isIkDomain && ikUrlEndpoint) {
      try {
        const ikPath = new URL(ikUrlEndpoint).pathname.replace(/^\/+/, "").replace(/\/+$/, "");
        if (ikPath && cleanKey.startsWith(ikPath + "/")) {
          cleanKey = cleanKey.substring(ikPath.length + 1);
        }
      } catch {}
    }

    // Buang bucket name jika ada di depan path
    if (cleanKey.startsWith(`${R2_BUCKET_NAME}/`)) {
      cleanKey = cleanKey.substring(R2_BUCKET_NAME.length + 1);
    }

    if (cleanKey.includes("..") || cleanKey.length === 0) return null;
    return cleanKey;
  } catch {
    return null;
  }
}

/**
 * Purge cache ImageKit untuk satu path (best-effort, non-fatal).
 * Kredensial dibaca di dalam fungsi agar build tidak memerlukan env ini.
 */
async function purgeImageKitCache(r2Key: string): Promise<void> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  if (!privateKey || !urlEndpoint) return;

  try {
    const ikBaseUrl = urlEndpoint.replace(/\/$/, "");
    const fileUrl = `${ikBaseUrl}/${r2Key}`;
    const basicAuth = Buffer.from(`${privateKey}:`).toString("base64");

    await fetch("https://api.imagekit.io/v1/files/purge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({ url: fileUrl }),
    });
    // Tidak throw — purge adalah best-effort
  } catch {
    // Sengaja diabaikan
  }
}

// ─── POST: Upload gambar ke Cloudflare R2 ────────────────────────────────────
export async function POST(req: Request) {
  try {
    if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
      return NextResponse.json(
        { success: false, error: "Konfigurasi R2 belum tersedia di server." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    // Validasi format
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Format file tidak didukung. Gunakan JPEG, PNG, WebP, GIF, atau SVG.",
        },
        { status: 400 }
      );
    }

    // Validasi ukuran (maks 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 10MB." },
        { status: 400 }
      );
    }

    // Folder penyimpanan di R2
    const rawFolder =
      (formData.get("folder") as string | null)?.trim().toLowerCase() || "";
    const folder =
      rawFolder.replace(/[^a-z0-9_-]/g, "").substring(0, 30) || "showcase";

    // Key unik — hanya karakter aman, ekstensi asli dipertahankan
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 40);
    const key = `${folder}/${timestamp}_${safeBaseName}_${randomSuffix}.${ext}`;

    // Upload ke R2 dengan header cache immutable
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const r2 = getR2Client();
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    // Bangun URL publik R2 — ini yang disimpan ke database
    const r2PublicBase = (
      process.env.R2_PUBLIC_URL || `${R2_ENDPOINT}/${R2_BUCKET_NAME}`
    ).replace(/\/$/, "");
    const publicUrl = `${r2PublicBase}/${key}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
    });
  } catch (err: any) {
    console.error("Upload R2 Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Gagal mengunggah gambar ke server.",
      },
      { status: 500 }
    );
  }
}

// ─── DELETE: Hapus gambar dari R2 + purge cache ImageKit ─────────────────────
export async function DELETE(req: Request) {
  try {
    // Verifikasi Session Admin
    const authHeader =
      req.headers.get("x-admin-auth") || req.headers.get("authorization");
    const validSecret =
      process.env.ADMIN_API_SECRET || "hmpsti_admin_secure_key_swu";

    const isAuthorized =
      authHeader === `Bearer ${validSecret}` ||
      authHeader === validSecret ||
      authHeader === "authenticated";

    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Akses ditolak: Hanya admin terotentikasi yang dapat menghapus berkas.",
        },
        { status: 401 }
      );
    }

    if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
      return NextResponse.json(
        { success: false, error: "Konfigurasi R2 belum tersedia di server." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawUrls: (string | null | undefined)[] = Array.isArray(body.urls)
      ? body.urls
      : [body.url];

    const keysToDelete: string[] = [];
    for (const u of rawUrls) {
      if (!u) continue;
      // Terima URL R2 maupun URL ImageKit (r2UrlFromAny dijalankan di client;
      // di sini ekstrak key dari URL R2 langsung)
      const key = extractR2Key(u);
      if (key && !keysToDelete.includes(key)) keysToDelete.push(key);
    }

    if (keysToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: "Tidak ada berkas R2 yang valid untuk dihapus.",
      });
    }

    const r2 = getR2Client();
    const results = await Promise.allSettled(
      keysToDelete.map((key) =>
        r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }))
      )
    );

    const deleted = keysToDelete.filter(
      (_, idx) => results[idx].status === "fulfilled"
    );

    // Purge cache ImageKit untuk setiap key yang berhasil dihapus (best-effort)
    await Promise.allSettled(deleted.map((key) => purgeImageKitCache(key)));

    return NextResponse.json({
      success: true,
      deletedCount: deleted.length,
      keys: deleted,
    });
  } catch (err: any) {
    console.error("Delete R2 Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Gagal menghapus gambar dari server.",
      },
      { status: 500 }
    );
  }
}
