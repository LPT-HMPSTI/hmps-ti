import { supabase, withTimeout } from "@/lib/supabase";
import { NewsArticle, CreateNewsPayload, UpdateNewsPayload } from "@/types";
import { fallbackNews } from "@/constants";

let memoryNewsStore: NewsArticle[] = [...(fallbackNews as NewsArticle[])];

/**
 * Mengambil seluruh daftar artikel berita dan agenda kegiatan dari database Supabase.
 */
export async function fetchNewsList(): Promise<NewsArticle[]> {
  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("news")
          .select("*")
          .order("created_at", { ascending: false }),
        2000
      );

      if (!error && data && data.length > 0) {
        memoryNewsStore = data as NewsArticle[];
        return data as NewsArticle[];
      }
    } catch (e) {
      console.warn("fetchNewsList fallback used:", e);
    }
  }
  return memoryNewsStore;
}

/**
 * Menambahkan artikel berita atau event baru ke database Supabase.
 */
export async function createNewsArticle(
  article: CreateNewsPayload
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  const newId = `news-${Date.now()}`;
  const newItem: NewsArticle = {
    id: newId,
    created_at: new Date().toISOString(),
    likes_count: 0,
    ...article,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("news").insert([article]);
      if (!error) {
        memoryNewsStore = [newItem, ...memoryNewsStore];
        return { success: true, data };
      }
    } catch (e) {
      console.warn("createNewsArticle Exception handled:", e);
    }
  }

  memoryNewsStore = [newItem, ...memoryNewsStore];
  return { success: true, isMock: true, data: newItem };
}

/**
 * Memperbarui konten artikel berita atau event berdasarkan ID artikel.
 */
export async function updateNewsArticle(
  id: string,
  article: UpdateNewsPayload
): Promise<{ success: boolean; data?: any; isMock?: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("news").update(article).eq("id", id);
      if (!error) {
        memoryNewsStore = memoryNewsStore.map((n) =>
          n.id === id ? { ...n, ...article } : n
        );
        return { success: true, data };
      }
    } catch (e) {
      console.warn("updateNewsArticle Exception handled:", e);
    }
  }

  memoryNewsStore = memoryNewsStore.map((n) =>
    n.id === id ? { ...n, ...article } : n
  );
  return { success: true, isMock: true };
}

/**
 * Menghapus artikel berita dari database Supabase secara permanen.
 */
export async function deleteNewsArticle(
  id: string
): Promise<{ success: boolean; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (!error) {
        memoryNewsStore = memoryNewsStore.filter((n) => n.id !== id);
        return { success: true };
      }
    } catch (e) {
      console.warn("deleteNewsArticle Exception handled:", e);
    }
  }

  memoryNewsStore = memoryNewsStore.filter((n) => n.id !== id);
  return { success: true, isMock: true };
}
