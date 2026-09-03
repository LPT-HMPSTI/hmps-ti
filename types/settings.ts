/**
 * Data pengaturan utama website dan informasi kontak organisasi HMPSTI SWU.
 */
export interface SiteSettings {
  id?: string;
  current_period: string;
  email: string;
  whatsapp: string;
  address: string;
  map_embed_url: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Payload form ketika admin memperbarui pengaturan utama.
 */
export type UpdateSiteSettingsPayload = Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>;
