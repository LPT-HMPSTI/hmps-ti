import { supabase, withTimeout } from "@/lib/supabase";

export interface DivisionPhotoItem {
  division_slug: string;
  division_name: string;
  photo_url: string;
  updated_at?: string;
}

export const fallbackDivisionPhotos: Record<string, { name: string; url: string; themeColor: string }> = {
  bph: {
    name: "Badan Pengurus Harian (BPH)",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    themeColor: "#1DB954",
  },
  psdm: {
    name: "Pengembangan Sumber Daya Mahasiswa",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    themeColor: "#A855F7",
  },
  lpt: {
    name: "Lembaga Pengembangan Teknologi (LPT)",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
    themeColor: "#00F2FE",
  },
  kwu: {
    name: "Kewirausahaan & Bisnis Mandiri (KWU)",
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop",
    themeColor: "#F59E0B",
  },
  medkominfo: {
    name: "Media Komunikasi & Informasi",
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600&auto=format&fit=crop",
    themeColor: "#FF007F",
  },
  humas: {
    name: "Hubungan Masyarakat & Kemitraan",
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
    themeColor: "#3B82F6",
  },
};

let memoryDivisionPhotos: Record<string, string> = {
  bph: fallbackDivisionPhotos.bph.url,
  psdm: fallbackDivisionPhotos.psdm.url,
  lpt: fallbackDivisionPhotos.lpt.url,
  kwu: fallbackDivisionPhotos.kwu.url,
  medkominfo: fallbackDivisionPhotos.medkominfo.url,
  humas: fallbackDivisionPhotos.humas.url,
};

/**
 * Mengambil daftar URL foto bersama seluruh divisi dari Supabase tabel division_photos.
 */
export async function fetchDivisionPhotos(): Promise<Record<string, string>> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase.from("division_photos").select("*"),
        2500
      );

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: Record<string, string> = { ...memoryDivisionPhotos };
        data.forEach((item: any) => {
          if (item.division_slug && item.photo_url) {
            mapped[item.division_slug.toLowerCase()] = item.photo_url;
          }
        });
        memoryDivisionPhotos = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn("fetchDivisionPhotos fallback used:", e);
    }
  }
  return memoryDivisionPhotos;
}

/**
 * Memperbarui URL foto bersama satu divisi ke Supabase.
 */
export async function updateDivisionPhoto(
  divisionSlug: string,
  divisionName: string,
  photoUrl: string
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  const cleanSlug = divisionSlug.toLowerCase().trim();
  memoryDivisionPhotos[cleanSlug] = photoUrl;

  if (supabase) {
    try {
      const { data, error } = await supabase.from("division_photos").upsert(
        [
          {
            division_slug: cleanSlug,
            division_name: divisionName,
            photo_url: photoUrl,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "division_slug" }
      );

      if (error) {
        console.warn("Supabase updateDivisionPhoto warning:", error.message);
      } else {
        return { success: true, data };
      }
    } catch (e) {
      console.warn("updateDivisionPhoto Exception handled:", e);
    }
  }
  return { success: true, isMock: true };
}
