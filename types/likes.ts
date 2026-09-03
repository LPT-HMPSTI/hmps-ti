/**
 * Target entitas yang mendukung fitur interaksi tombol like secara real-time.
 */
export type LikeEntityType =
  | "article"
  | "division_member"
  | "member"
  | "project"
  | "gallery_item";

/**
 * Hasil sinkronisasi like dari server Supabase ke browser pengunjung.
 */
export interface LikeSyncResult {
  success: boolean;
  newCount: number;
  entityId: string;
  error?: string;
}
