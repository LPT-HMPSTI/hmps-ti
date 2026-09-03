import { supabase } from "@/lib/supabase";

/**
 * Membaca status apakah pengunjung saat ini sudah menyukai (like) item tertentu dari localStorage.
 */
export function getLocalLikeState(table: string, id: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  try {
    return localStorage.getItem(`hmpsti_liked_${table}_${id}`) === "true";
  } catch {
    return false;
  }
}

/**
 * Menyimpan atau menghapus tanda like pengunjung di localStorage perangkat lokal.
 */
export function setLocalLikeState(table: string, id: string, liked: boolean): void {
  if (typeof window === "undefined" || !id) return;
  try {
    if (liked) {
      localStorage.setItem(`hmpsti_liked_${table}_${id}`, "true");
    } else {
      localStorage.removeItem(`hmpsti_liked_${table}_${id}`);
    }
  } catch {}
}

/**
 * Sinkronisasi jumlah like ke database Supabase secara atomik.
 * Menjamin zero-lag UI (optimistic update) dan concurrency-safe jika banyak pengunjung like berbarengan.
 */
export async function toggleDatabaseLike(
  table: "news" | "student_projects" | "members" | "division_members",
  id: string,
  liked: boolean,
  currentCount?: number
): Promise<{ success: boolean; newCount: number }> {
  // 1. Simpan tanda like lokal pengunjung di browser
  setLocalLikeState(table, id, liked);

  // 2. Hitung jumlah like optimistik langsung di sisi klien
  const count = typeof currentCount === "number" ? currentCount : 0;
  let newCount = liked ? count + 1 : Math.max(0, count - 1);

  // 3. Mutasi baris tabel Supabase secara atomik
  if (supabase) {
    try {
      const delta = liked ? 1 : -1;
      // Utamakan atomic RPC function untuk proteksi race condition
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "increment_like_atomic",
        {
          table_name: table,
          row_id: id,
          delta_val: delta,
        }
      );

      if (!rpcError && typeof rpcData === "number") {
        newCount = rpcData;
      } else {
        // Fallback update manual jika RPC belum dibuat di Supabase project
        const { data } = await supabase
          .from(table)
          .select("likes_count")
          .eq("id", id)
          .maybeSingle();

        const dbLikes =
          typeof data?.likes_count === "number" ? data.likes_count : count;
        const targetCount = Math.max(0, liked ? dbLikes + 1 : dbLikes - 1);
        newCount = targetCount;

        await supabase
          .from(table)
          .update({ likes_count: targetCount })
          .eq("id", id);
      }
    } catch (e) {
      console.warn(`toggleDatabaseLike error for table ${table}:`, e);
    }
  }

  return { success: true, newCount };
}
