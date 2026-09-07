import { supabase, withTimeout } from "@/lib/supabase";
import {
  WorkProgram,
  CreateWorkProgramPayload,
  UpdateWorkProgramPayload,
} from "@/types";
import { fallbackWorkPrograms } from "@/constants";

let memoryWorkProgramStore: WorkProgram[] = [
  ...(fallbackWorkPrograms as WorkProgram[]),
];

/**
 * Mengambil seluruh daftar program kerja divisi dari Supabase.
 * Jika parameter divisionSlug diberikan, hasil difilter berdasarkan divisi terkait.
 */
export async function fetchWorkPrograms(
  divisionSlug?: string
): Promise<WorkProgram[]> {
  if (supabase) {
    try {
      let query = supabase
        .from("work_programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (divisionSlug && divisionSlug !== "all") {
        query = query.eq("division_slug", divisionSlug.toLowerCase());
      }

      const { data, error }: any = await withTimeout(query, 2500);

      if (!error && data && data.length > 0) {
        // Update in-memory store
        if (!divisionSlug || divisionSlug === "all") {
          memoryWorkProgramStore = data as WorkProgram[];
        }
        return data as WorkProgram[];
      }
    } catch (e) {
      console.warn("fetchWorkPrograms fallback used:", e);
    }
  }

  // Fallback in-memory filter
  if (divisionSlug && divisionSlug !== "all") {
    return memoryWorkProgramStore.filter(
      (wp) => wp.division_slug.toLowerCase() === divisionSlug.toLowerCase()
    );
  }
  return memoryWorkProgramStore;
}

/**
 * Menambahkan program kerja baru ke Supabase.
 */
export async function createWorkProgram(
  payload: CreateWorkProgramPayload
): Promise<{
  success: boolean;
  data?: WorkProgram;
  error?: string;
  isMock?: boolean;
}> {
  const newId =
    payload.id ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `wp-${Date.now()}`);

  const newItem: WorkProgram = {
    division_slug: payload.division_slug,
    title: payload.title,
    status: payload.status,
    execution_date: payload.execution_date,
    description: payload.description,
    pic: payload.pic,
    target_audience: payload.target_audience,
    budget: payload.budget,
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase.from("work_programs").insert([newItem]).select(),
        2500
      );

      if (!error && data && data.length > 0) {
        memoryWorkProgramStore = [data[0] as WorkProgram, ...memoryWorkProgramStore];
        return { success: true, data: data[0] as WorkProgram };
      }

      if (error) {
        console.warn("createWorkProgram Supabase insert error:", error);
      }
    } catch (e: any) {
      console.warn("createWorkProgram exception handled:", e);
    }
  }

  // Local fallback
  memoryWorkProgramStore = [newItem, ...memoryWorkProgramStore];
  return { success: true, isMock: true, data: newItem };
}

/**
 * Memperbarui program kerja yang sudah ada di Supabase berdasarkan ID.
 */
export async function updateWorkProgram(
  id: string,
  payload: UpdateWorkProgramPayload
): Promise<{
  success: boolean;
  data?: WorkProgram;
  error?: string;
  isMock?: boolean;
}> {
  const updateData = {
    ...payload,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error }: any = await withTimeout(
        supabase
          .from("work_programs")
          .update(updateData)
          .eq("id", id)
          .select(),
        2500
      );

      if (!error && data && data.length > 0) {
        memoryWorkProgramStore = memoryWorkProgramStore.map((wp) =>
          wp.id === id ? (data[0] as WorkProgram) : wp
        );
        return { success: true, data: data[0] as WorkProgram };
      }

      if (error) {
        console.warn("updateWorkProgram Supabase update error:", error);
      }
    } catch (e: any) {
      console.warn("updateWorkProgram exception handled:", e);
    }
  }

  // Local fallback
  memoryWorkProgramStore = memoryWorkProgramStore.map((wp) =>
    wp.id === id ? { ...wp, ...updateData } : wp
  );
  const updated = memoryWorkProgramStore.find((wp) => wp.id === id);
  return { success: true, isMock: true, data: updated };
}

/**
 * Menghapus program kerja dari Supabase berdasarkan ID.
 */
export async function deleteWorkProgram(
  id: string
): Promise<{ success: boolean; error?: string; isMock?: boolean }> {
  if (supabase) {
    try {
      const { error }: any = await withTimeout(
        supabase.from("work_programs").delete().eq("id", id),
        2500
      );

      if (!error) {
        memoryWorkProgramStore = memoryWorkProgramStore.filter(
          (wp) => wp.id !== id
        );
        return { success: true };
      }

      if (error) {
        console.warn("deleteWorkProgram Supabase delete error:", error);
      }
    } catch (e: any) {
      console.warn("deleteWorkProgram exception handled:", e);
    }
  }

  // Local fallback
  memoryWorkProgramStore = memoryWorkProgramStore.filter((wp) => wp.id !== id);
  return { success: true, isMock: true };
}
