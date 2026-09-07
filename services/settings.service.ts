import { supabase, withTimeout } from "@/lib/supabase";
import { SiteSettings, UpdateSiteSettingsPayload } from "@/types";
import { fallbackSiteSettings } from "@/constants";

let memorySettingsStore: SiteSettings = { ...(fallbackSiteSettings as SiteSettings) };

/**
 * Mengambil data pengaturan website (periode kepengurusan, kontak, peta) dari Supabase.
 * Kalau tabel belum siap atau offline, otomatis mengembalikan fallback data.
 */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("site_settings")
          .select("*")
          .eq("id", "default")
          .maybeSingle(),
        2000
      );

      if (!error && data) {
        memorySettingsStore = data as SiteSettings;
        return data as SiteSettings;
      }
    } catch (e) {
      console.warn("fetchSiteSettings fallback used:", e);
    }
  }
  return memorySettingsStore;
}

/**
 * Memperbarui informasi pengaturan website dan kontak di Supabase.
 */
export async function updateSiteSettings(
  settings: UpdateSiteSettingsPayload
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("site_settings").upsert(
        [
          {
            id: "default",
            current_period: settings.current_period,
            email: settings.email,
            whatsapp: settings.whatsapp,
            address: settings.address,
            map_embed_url: settings.map_embed_url,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" }
      );

      if (error) {
        console.warn("Supabase updateSiteSettings table warning:", error.message);
      } else {
        return { success: true, data };
      }
    } catch (e) {
      console.warn("updateSiteSettings Exception handled:", e);
    }
  }
  return { success: true, isMock: true };
}
