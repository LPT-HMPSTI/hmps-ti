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
  all_members: {
    name: "Seluruh Anggota Himpunan (Kabinet HMPSTI SWU)",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    themeColor: "#1DB954",
  },
};

let memoryDivisionPhotos: Record<string, string> = {
  bph: fallbackDivisionPhotos.bph.url,
  psdm: fallbackDivisionPhotos.psdm.url,
  lpt: fallbackDivisionPhotos.lpt.url,
  kwu: fallbackDivisionPhotos.kwu.url,
  medkominfo: fallbackDivisionPhotos.medkominfo.url,
  humas: fallbackDivisionPhotos.humas.url,
  all_members: fallbackDivisionPhotos.all_members.url,
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
 * Mengambil detail lengkap (url dan division_name) foto bersama seluruh divisi dari Supabase.
 */
export async function fetchDivisionPhotoDetails(): Promise<
  Record<string, { url: string; name: string }>
> {
  const mapped: Record<string, { url: string; name: string }> = {};
  Object.keys(fallbackDivisionPhotos).forEach((slug) => {
    mapped[slug] = {
      url: fallbackDivisionPhotos[slug].url,
      name: fallbackDivisionPhotos[slug].name,
    };
  });

  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase.from("division_photos").select("*"),
        2500
      );

      if (!error && Array.isArray(data) && data.length > 0) {
        data.forEach((item: any) => {
          if (item.division_slug) {
            const clean = item.division_slug.toLowerCase().trim();
            mapped[clean] = {
              url: item.photo_url || mapped[clean]?.url || "",
              name: item.division_name || mapped[clean]?.name || "",
            };
          }
        });
      }
    } catch (e) {
      console.warn("fetchDivisionPhotoDetails fallback used:", e);
    }
  }

  return mapped;
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

/** Slugs for the 3 cabinet slideshow slots */
export const CABINET_SLIDE_SLUGS = ["all_members_1", "all_members_2", "all_members_3"] as const;

export interface CabinetSlide {
  slug: string;
  url: string;
  name: string;
}

const fallbackCabinetSlides: CabinetSlide[] = [
  { slug: "all_members_1", url: "", name: "Foto Bersama Kabinet 1" },
  { slug: "all_members_2", url: "", name: "Foto Bersama Kabinet 2" },
  { slug: "all_members_3", url: "", name: "Foto Bersama Kabinet 3" },
];

/**
 * Mengambil 3 slide foto bersama kabinet (all_members_1/2/3) dari Supabase.
 * Hanya mengembalikan slide yang memiliki URL (tidak kosong).
 */
export async function fetchCabinetSlidePhotos(): Promise<CabinetSlide[]> {
  const slugs = CABINET_SLIDE_SLUGS;
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("division_photos")
          .select("*")
          .in("division_slug", slugs),
        3000
      );

      if (!error && Array.isArray(data)) {
        const mapped: CabinetSlide[] = slugs.map((slug) => {
          const row = data.find((d: any) => d.division_slug === slug);
          return {
            slug,
            url: row?.photo_url || "",
            name: row?.division_name || fallbackCabinetSlides.find((s) => s.slug === slug)?.name || "",
          };
        });
        // Only return slides that have a URL
        return mapped.filter((s) => !!s.url);
      }
    } catch (e) {
      console.warn("fetchCabinetSlidePhotos fallback:", e);
    }
  }
  return fallbackCabinetSlides.filter((s) => !!s.url);
}

/**
 * Menyimpan satu slot foto slideshow kabinet.
 */
export async function updateCabinetSlidePhoto(
  slug: string,
  name: string,
  url: string
): Promise<{ success: boolean; isMock?: boolean }> {
  return updateDivisionPhoto(slug, name, url);
}
