import { supabase } from "@/lib/supabase";

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  keterangan: string;
  role: "superadmin" | "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateAdminUserPayload = {
  username: string;
  password: string;
  keterangan: string;
  role: "superadmin" | "admin";
};

export type UpdateAdminUserPayload = Partial<
  Omit<AdminUser, "id" | "created_at" | "updated_at" | "password_hash">
> & { password?: string };

/**
 * Simple hash — we use a SHA-256-like hex to avoid storing plaintext.
 * (Server-side bcrypt not available in edge, so we use a client-derivable hash.)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "hmpsti_salt_swu");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifikasi login admin: cek username & password di tabel admin_users.
 */
export async function loginAdminUser(
  username: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  if (!supabase) return { success: false, error: "Koneksi database tidak tersedia." };

  try {
    const hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username.toLowerCase().trim())
      .eq("password_hash", hash)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.warn("loginAdminUser error:", error.message);
      return { success: false, error: "Terjadi kesalahan saat verifikasi." };
    }

    if (!data) {
      return { success: false, error: "Username atau kata sandi tidak valid." };
    }

    return { success: true, user: data as AdminUser };
  } catch (e) {
    console.warn("loginAdminUser exception:", e);
    return { success: false, error: "Gagal terhubung ke server." };
  }
}

/**
 * Ambil semua admin user dari database.
 */
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, keterangan, role, is_active, created_at, updated_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("fetchAdminUsers error:", error.message);
      return [];
    }
    return (data as AdminUser[]) || [];
  } catch (e) {
    console.warn("fetchAdminUsers exception:", e);
    return [];
  }
}

/**
 * Buat admin user baru.
 */
export async function createAdminUser(
  payload: CreateAdminUserPayload
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: "Tidak ada koneksi database." };

  try {
    const hash = await hashPassword(payload.password);

    const { error } = await supabase.from("admin_users").insert([
      {
        username: payload.username.toLowerCase().trim(),
        password_hash: hash,
        keterangan: payload.keterangan,
        role: payload.role,
        is_active: true,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Username sudah digunakan." };
      }
      console.warn("createAdminUser error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    console.warn("createAdminUser exception:", e);
    return { success: false, error: "Gagal membuat user." };
  }
}

/**
 * Update admin user (bisa update password, keterangan, role, is_active).
 */
export async function updateAdminUser(
  id: string,
  payload: UpdateAdminUserPayload
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: "Tidak ada koneksi database." };

  try {
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.keterangan !== undefined) updateData.keterangan = payload.keterangan;
    if (payload.role !== undefined) updateData.role = payload.role;
    if (payload.is_active !== undefined) updateData.is_active = payload.is_active;
    if (payload.username !== undefined) updateData.username = payload.username.toLowerCase().trim();
    if (payload.password) {
      updateData.password_hash = await hashPassword(payload.password);
    }

    const { error } = await supabase.from("admin_users").update(updateData).eq("id", id);

    if (error) {
      console.warn("updateAdminUser error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    console.warn("updateAdminUser exception:", e);
    return { success: false, error: "Gagal mengupdate user." };
  }
}

/**
 * Hapus admin user (non-superadmin saja yang bisa dihapus).
 */
export async function deleteAdminUser(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: "Tidak ada koneksi database." };

  try {
    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", id)
      .neq("role", "superadmin"); // Superadmin tidak bisa dihapus

    if (error) {
      console.warn("deleteAdminUser error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    console.warn("deleteAdminUser exception:", e);
    return { success: false, error: "Gagal menghapus user." };
  }
}
