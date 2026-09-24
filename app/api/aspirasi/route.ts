import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Rate-limit store: Map<ip, lastSubmittedTimestamp>
// Persists across requests within the same server process (module singleton).
// ---------------------------------------------------------------------------
const RATE_LIMIT_MS = 10 * 60 * 1000; // 10 menit
const rateLimitStore = new Map<string, number>();

/**
 * Reads the real client IP from standard reverse-proxy headers,
 * falling back to a placeholder so the route always has a key.
 */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") || // Cloudflare
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// POST /api/aspirasi
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  // 1. Rate-limit check
  const lastSubmit = rateLimitStore.get(ip);
  if (lastSubmit && now - lastSubmit < RATE_LIMIT_MS) {
    const remainingMs = RATE_LIMIT_MS - (now - lastSubmit);
    const remainingMins = Math.ceil(remainingMs / 60000);
    return NextResponse.json(
      {
        success: false,
        rateLimited: true,
        message: `Anda baru saja mengirim aspirasi. Silakan coba lagi dalam ${remainingMins} menit.`,
        retryAfterMs: remainingMs,
      },
      { status: 429 }
    );
  }

  // 2. Parse body
  let body: {
    name?: string;
    email?: string;
    message?: string;
    isAnonymous?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Request body tidak valid." },
      { status: 400 }
    );
  }

  if (!body.message || body.message.trim().length < 5) {
    return NextResponse.json(
      { success: false, message: "Pesan aspirasi terlalu pendek." },
      { status: 400 }
    );
  }

  // 3. Insert ke Supabase via service-role or anon key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const primaryPayload = {
        sender_name: body.isAnonymous
          ? "Anonim"
          : body.name?.trim() || "Anonim",
        sender_email: body.isAnonymous ? null : body.email?.trim() || null,
        subject: "Aspirasi Mahasiswa",
        message: body.message.trim(),
        is_anonymous: body.isAnonymous ?? false,
        is_read: false,
      };

      let { error } = await supabase.from("feedback").insert([primaryPayload]);

      // If column mismatch error occurs, attempt fallback payload with `email` key
      if (error && (error.message.includes("sender_email") || error.code === "PGRST204")) {
        console.warn("Insert with sender_email failed, trying email column fallback...", error.message);
        const fallbackPayload = {
          sender_name: primaryPayload.sender_name,
          email: primaryPayload.sender_email,
          message: primaryPayload.message,
          is_anonymous: primaryPayload.is_anonymous,
          is_read: false,
        };
        const retry = await supabase.from("feedback").insert([fallbackPayload]);
        error = retry.error;
      }

      if (error) {
        console.error("Supabase aspirasi insert error:", error.message);
        return NextResponse.json(
          { success: false, message: `Gagal menyimpan aspirasi: ${error.message}` },
          { status: 500 }
        );
      }
    } catch (e: any) {
      console.error("Aspirasi API unexpected error:", e);
      return NextResponse.json(
        { success: false, message: e?.message || "Terjadi kesalahan server." },
        { status: 500 }
      );
    }
  }

  // 4. Record timestamp (only after successful insert)
  rateLimitStore.set(ip, now);

  // Clean up old entries periodically to avoid memory leak
  if (rateLimitStore.size > 5000) {
    const cutoff = now - RATE_LIMIT_MS;
    rateLimitStore.forEach((ts, key) => {
      if (ts < cutoff) rateLimitStore.delete(key);
    });
  }

  return NextResponse.json({ success: true });
}
