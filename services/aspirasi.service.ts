import { supabase } from "@/lib/supabase";
import { Aspirasi } from "@/types";

/**
 * Mengambil daftar pesan aspirasi dan masukan yang dikirimkan oleh mahasiswa.
 */
export async function fetchAspirasiList(): Promise<Aspirasi[]> {
  const seedItems: Aspirasi[] = [
    {
      id: "f1",
      sender_name: "Mahasiswa TI 2023",
      sender_email: "mahasiswa23@stmik-widya-utama.ac.id",
      subject: "Pelatihan Koding Akhir Pekan",
      message: "Mohon diperbanyak pelatihan workshop koding Next.js dan Supabase di akhir pekan.",
      is_anonymous: false,
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "f2",
      sender_name: "Anonim",
      sender_email: "",
      subject: "Fasilitas Lab Komputer",
      message: "Fasilitas AC di Lab Komputer 2 mohon diperiksa karena kurang dingin saat praktikum sore.",
      is_anonymous: true,
      is_read: true,
      created_at: new Date().toISOString(),
    },
  ];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Normalize fields so both `sender_email` and `email` map cleanly
        const normalized = data.map((item: any) => ({
          id: item.id || `f-${Math.random().toString(36).substring(2, 9)}`,
          sender_name: item.sender_name || (item.is_anonymous ? "Anonim" : "Mahasiswa"),
          sender_email: item.sender_email || item.email || "",
          email: item.email || item.sender_email || "",
          subject: item.subject || "Aspirasi Mahasiswa",
          message: item.message || "",
          is_anonymous: Boolean(item.is_anonymous),
          is_read: Boolean(item.is_read),
          created_at: item.created_at || new Date().toISOString(),
        }));
        return normalized as Aspirasi[];
      }

      if (error) {
        console.warn("fetchAspirasiList Supabase error:", error.message);
      }
    } catch (e) {
      console.warn("fetchAspirasiList exception:", e);
    }
  }

  // Fallback seed if Supabase is offline or table has no rows
  return seedItems;
}

/**
 * Mengubah status pesan aspirasi (sudah dibaca / belum dibaca).
 */
export async function toggleAspirasiReadStatus(
  id: string,
  currentStatus: boolean
): Promise<{ success: boolean; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ is_read: !currentStatus })
        .eq("id", id);

      if (!error) return { success: true };
    } catch (e) {
      console.warn("toggleAspirasiReadStatus Exception handled:", e);
    }
  }
  return { success: true, isMock: true };
}

/**
 * Menghapus pesan aspirasi dari daftar inbox admin.
 */
export async function deleteAspirasi(
  id: string
): Promise<{ success: boolean; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error } = await supabase.from("feedback").delete().eq("id", id);
      if (!error) return { success: true };
    } catch (e) {
      console.warn("deleteAspirasi Exception handled:", e);
    }
  }
  return { success: true, isMock: true };
}

/**
 * Mengirimkan formulir aspirasi baru dari pengunjung di halaman /kontak.
 */
export async function submitAspirasiFeedback(messageData: {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  isAnonymous: boolean;
}): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  if (supabase) {
    try {
      const primaryPayload = {
        sender_name: messageData.isAnonymous ? "Anonim" : messageData.name || "Anonim",
        sender_email: messageData.isAnonymous ? null : messageData.email || null,
        subject: messageData.subject || "Aspirasi Mahasiswa",
        message: messageData.message,
        is_anonymous: messageData.isAnonymous,
        is_read: false,
      };

      const { data, error } = await supabase.from("feedback").insert([primaryPayload]);
      if (!error) return { success: true, data };

      // Try fallback if sender_email column doesn't exist
      const fallbackPayload = {
        sender_name: primaryPayload.sender_name,
        email: primaryPayload.sender_email,
        message: primaryPayload.message,
        is_anonymous: primaryPayload.is_anonymous,
        is_read: false,
      };
      const { data: fbData, error: fbError } = await supabase.from("feedback").insert([fallbackPayload]);
      if (!fbError) return { success: true, data: fbData };

      console.warn("Supabase Feedback Submit Error:", error?.message || fbError?.message);
    } catch (e) {
      console.warn("Supabase Feedback Submit Exception:", e);
    }
  }
  return { success: true, isMock: true };
}
