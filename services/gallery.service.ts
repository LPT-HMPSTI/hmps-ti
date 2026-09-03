import { supabase, withTimeout } from "@/lib/supabase";
import {
  GalleryItem,
  CreateGalleryPayload,
  UpdateGalleryPayload,
} from "@/types";
import { fallbackGalleryItems } from "@/constants";

let memoryGalleryStore: GalleryItem[] = [
  ...(fallbackGalleryItems as GalleryItem[]),
];

/**
 * Mengambil seluruh foto galeri dokumentasi kegiatan dari database Supabase.
 */
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("gallery_items")
          .select("*")
          .order("created_at", { ascending: false }),
        2500
      );

      if (!error && data && data.length > 0) {
        memoryGalleryStore = data as GalleryItem[];
        return data as GalleryItem[];
      }
    } catch (e) {
      console.warn("fetchGalleryItems fallback used:", e);
    }
  }
  return memoryGalleryStore;
}

/**
 * Menambahkan foto dokumentasi baru ke dalam galeri kegiatan.
 */
export async function createGalleryItem(
  item: CreateGalleryPayload
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  const newId = `g-${Date.now()}`;
  const newItem: GalleryItem = {
    id: newId,
    created_at: new Date().toISOString(),
    ...item,
  };

  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase.from("gallery_items").insert([item]),
        2500
      );
      if (!error) {
        memoryGalleryStore = [newItem, ...memoryGalleryStore];
        return { success: true, data };
      }
    } catch (e) {
      console.warn("createGalleryItem Exception handled:", e);
    }
  }

  memoryGalleryStore = [newItem, ...memoryGalleryStore];
  return { success: true, isMock: true, data: newItem };
}

/**
 * Memperbarui keterangan foto atau tanggal dokumentasi galeri.
 */
export async function updateGalleryItem(
  id: string,
  item: UpdateGalleryPayload
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase.from("gallery_items").update(item).eq("id", id),
        2500
      );
      if (!error) {
        memoryGalleryStore = memoryGalleryStore.map((g) =>
          g.id === id ? { ...g, ...item } : g
        );
        return { success: true, data };
      }
    } catch (e) {
      console.warn("updateGalleryItem Exception handled:", e);
    }
  }

  memoryGalleryStore = memoryGalleryStore.map((g) =>
    g.id === id ? { ...g, ...item } : g
  );
  return { success: true, isMock: true };
}

/**
 * Menghapus foto dari galeri kegiatan.
 */
export async function deleteGalleryItem(
  id: string
): Promise<{ success: boolean; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error }: any = await withTimeout(
        supabase.from("gallery_items").delete().eq("id", id),
        2500
      );
      if (!error) {
        memoryGalleryStore = memoryGalleryStore.filter((g) => g.id !== id);
        return { success: true };
      }
    } catch (e) {
      console.warn("deleteGalleryItem Exception handled:", e);
    }
  }

  memoryGalleryStore = memoryGalleryStore.filter((g) => g.id !== id);
  return { success: true, isMock: true };
}
