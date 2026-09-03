/**
 * Kategori dokumentasi kegiatan mahasiswa dan himpunan.
 */
export type GalleryCategory =
  | "MAKRAB & INAUGURASI"
  | "WORKSHOP & SEMINAR"
  | "STUDI EKSKURSI"
  | "LOMBA & PRESTASI"
  | string;

/**
 * Data foto kegiatan galeri yang disimpan di Supabase.
 */
export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  event_date: string;
  url: string;
  description: string;
  created_at?: string;
  likes_count?: number;
}

/**
 * Payload form ketika menambah foto dokumentasi baru di admin.
 */
export type CreateGalleryPayload = Omit<GalleryItem, "id" | "created_at">;

/**
 * Payload form ketika mengedit data foto galeri.
 */
export type UpdateGalleryPayload = Partial<CreateGalleryPayload>;
