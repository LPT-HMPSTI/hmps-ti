/**
 * Pilihan topik aspirasi yang bisa dipilih mahasiswa saat mengirim pesan.
 */
export type AspirasiTopic =
  | "Akademik & Kurikulum"
  | "Fasilitas & Lab"
  | "Kegiatan & Event"
  | "Kritik & Saran Organisasi"
  | "Lainnya"
  | string;

/**
 * Data formulir aspirasi / masukan dari mahasiswa ke pengurus HMPSTI SWU.
 */
export interface Aspirasi {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_anonymous: boolean;
  is_read: boolean;
  created_at: string;
}

/**
 * Payload form kirim aspirasi dari halaman publik /kontak.
 */
export type SubmitAspirasiPayload = Omit<Aspirasi, "id" | "created_at" | "is_read">;
