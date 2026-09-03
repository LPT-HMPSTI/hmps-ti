/**
 * Kategori yang tersedia buat artikel berita dan pengumuman event.
 */
export type NewsCategory =
  | "Workshop"
  | "Prestasi"
  | "Informasi"
  | "Seminar"
  | "Pengumuman"
  | "Kegiatan"
  | string;

/**
 * Entitas lengkap artikel berita atau event yang disimpan di Supabase.
 */
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: NewsCategory;
  is_event: boolean;
  author_name: string;
  created_at: string;
  event_date?: string | null;
  reading_time?: string;
  likes_count: number;
  excerpt: string;
  content: string;
  cover_image: string;
  featured?: boolean;
}

/**
 * Payload form ketika membuat artikel berita baru di halaman admin.
 */
export type CreateNewsPayload = Omit<NewsArticle, "id" | "created_at" | "likes_count"> & {
  likes_count?: number;
};

/**
 * Payload form ketika mengedit artikel berita yang sudah ada.
 */
export type UpdateNewsPayload = Partial<CreateNewsPayload>;
