import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_ENDPOINT = process.env.R2_ENDPOINT || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "hmpsti";

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
 * Helper untuk mengekstrak S3 Key dari URL publik Cloudflare R2
 */
function extractR2Key(targetUrl: string): string | null {
  if (!targetUrl || typeof targetUrl !== "string") return null;
  const trimmed = targetUrl.trim();
  if (trimmed.startsWith("data:image")) return null;

  try {
    const parsed = new URL(trimmed);
    const pathname = decodeURIComponent(parsed.pathname);

    // Cek apakah URL berasal dari domain R2
    const r2PublicUrl = process.env.R2_PUBLIC_URL || "";
    let isR2Domain = false;

    if (r2PublicUrl) {
      try {
        const publicParsed = new URL(r2PublicUrl);
        if (parsed.hostname === publicParsed.hostname) {
          isR2Domain = true;
        }
      } catch {}
    }

    if (
      parsed.hostname.endsWith(".r2.dev") ||
      parsed.hostname.includes("r2.cloudflarestorage.com")
    ) {
      isR2Domain = true;
    }

    // Jika bukan dari domain Cloudflare R2 kita, abaikan (bukan error)
    if (!isR2Domain) return null;

    let cleanKey = pathname.replace(/^\/+/, "");

    // Jika format URL endpoint mencakup nama bucket: /<bucket_name>/<key>
    if (cleanKey.startsWith(`${R2_BUCKET_NAME}/`)) {
      cleanKey = cleanKey.substring(R2_BUCKET_NAME.length + 1);
    }

    // Hindari path traversal dan key kosong
    if (cleanKey.includes("..") || cleanKey.length === 0) return null;

    return cleanKey;
  } catch {
    return null;
  }
}

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

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Format file tidak didukung. Gunakan JPEG, PNG, WebP, GIF, atau SVG." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB." },
        { status: 400 }
      );
    }

    // Extract and sanitize target folder (default: showcase)
    const rawFolder = (formData.get("folder") as string | null)?.trim().toLowerCase() || "";
    const folder = rawFolder.replace(/[^a-z0-9_-]/g, "").substring(0, 30) || "showcase";

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const safeOriginalName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 40);
    const key = `${folder}/${timestamp}_${safeOriginalName}_${randomSuffix}.${ext}`;

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const r2 = getR2Client();
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Construct the public URL
    // R2 public URL format: https://<R2_PUBLIC_URL>/<key>
    // If no custom domain, use the R2 endpoint pattern
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
      : `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
    });
  } catch (err: any) {
    console.error("Upload Image Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal mengunggah gambar ke server." },
      { status: 500 }
    );
  }
}

/**
 * Menghapus satu atau beberapa berkas gambar dari Cloudflare R2
 */
export async function DELETE(req: Request) {
  try {
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
      if (u) {
        const key = extractR2Key(u);
        if (key && !keysToDelete.includes(key)) {
          keysToDelete.push(key);
        }
      }
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
        r2.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
          })
        )
      )
    );

    const deleted = keysToDelete.filter(
      (_, idx) => results[idx].status === "fulfilled"
    );

    return NextResponse.json({
      success: true,
      deletedCount: deleted.length,
      keys: deleted,
    });
  } catch (err: any) {
    console.error("Delete R2 Image Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Gagal menghapus gambar dari server." },
      { status: 500 }
    );
  }
}
