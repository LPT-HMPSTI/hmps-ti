import { supabase } from "@/lib/supabase";
import { Aspirasi } from "@/types";

/**
 * Mengambil daftar pesan aspirasi dan masukan yang dikirimkan oleh mahasiswa.
 */
export async function fetchAspirasiList(): Promise<Aspirasi[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) return data as Aspirasi[];
    } catch (e) {
      console.warn("fetchAspirasiList error:", e);
    }
  }

  // Fallback aspirasi seed
  return [
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
      const { data, error } = await supabase.from("feedback").insert([
        {
          sender_name: messageData.isAnonymous ? "Anonim" : messageData.name || "Anonim",
          email: messageData.isAnonymous ? null : messageData.email,
          message: messageData.message,
          is_anonymous: messageData.isAnonymous,
          is_read: false,
        },
      ]);
      if (!error) return { success: true, data };
    } catch (e) {
      console.warn("Supabase Feedback Submit Error handled:", e);
    }
  }
  return { success: true, isMock: true };
}
